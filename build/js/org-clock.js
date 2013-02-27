// org-clock.js
// 提供类似org的clock的功能
// Copyright (C) 2013 Zeno Zeng
// Licensed under the MIT license
// Time-stamp: <2013-02-27 13:50:35 Zeno Zeng>

Date.prototype.orgTimestamp = function() {
    var Y = this.getFullYear();
    var m = this.getMonth() + 1;
    m = m >= 10 ? m : "0" + m;
    var d = this.getDate();
    d = d >= 10 ? d : "0" + d;
    var H = this.getHours();
    H = H >= 10 ? H : "0" + H;
    var min = this.getMinutes() + "";
    min = min.length > 1 ? min : "0" + min;
    var week = ["日","一","二","三","四","五","六"];
    var day = week[this.getDay()];
    var str = Y+"-"+m+"-"+d+" "+day+" "+H+":"+min;
    str = "["+str+"]";
    return str;
}
function formatNumberLength(num, length) {
    var r = "" + num;
    while (r.length < length) {
        r = "0" + r;
    }
    return r;
}
function formatTimeDelta(microtime) {
    var seconds = parseInt(microtime / 1000);
    var minutes = parseInt(seconds / 60);
    var hours = parseInt(minutes / 60);
    minutes = minutes % 60;
    seconds = seconds % 60;
    minutes = formatNumberLength(minutes, 2);
    seconds = formatNumberLength(seconds, 2);
    var arr = [minutes, seconds];
    if(hours > 0) arr.unshift(hours);
    return arr.join(":");
}
function Clock() {
    var currentClock, data, lastClock, items;
    data = localStorage.getItem('clockData') ? JSON.parse(localStorage.getItem('clockData')) : {};
    items = localStorage.getItem('clockItems') ? JSON.parse(localStorage.getItem('clockItems')) : [];
    currentClock = localStorage.getItem('currentClock') || '';
    lastClock = localStorage.getItem('lastClock') || '';

    function clone(obj){
        if(obj == null || typeof(obj) != 'object')
          return obj;
        var temp = obj.constructor();
        for(var key in obj)
          temp[key] = clone(obj[key]);
        return temp;
    }
    function isArray(input){
        return typeof(input)=='object'&&(input instanceof Array);
    }
    this.add = function(item) {
        if(!item) return;
        if(typeof(data[item]) == "undefined") {
            data[item] = {'log':[],'sum':0};
            items.push(item);
        }
    }
    this.current = function() {
        if(!currentClock) return false;
        return currentClock;
    }
    this.last = function() {
        if(!lastClock) return false;
        return lastClock;
    }
    this.data = function() {
        return data;
    }
    this.items = function() {
        return items;
    }
    this.clockIn = function(item) {
        if(!item) return;
        if(item == ' ') return;
        if(this.current() == item) return;

        console.log('clockIn:'+item);
        this.clockOut();
        currentClock = item;
        var now = new Date();
        if(typeof(data[item]) == "undefined") {
            this.add(item);
        }
        data[item]['log'].unshift({'in': now.getTime(), 'out': ''});
        this.save();
    }
    this.getItemUpdateTime = function(item) {
        var log = data[item]['log'];
        if(this.current() == item) {
            var now = new Date();
            return now.getTime();
        }
        if(log.length == 0) {
            return 0;
        } else {
            return typeof log[0]['out'] == "undefined" ? log[0]['in'] : log[0]['out'];
        }
    }
    this.clockOut = function() {
        if(!this.current()) return;
        if(typeof(data[this.current()]['log'][0]) == "undefined") return;
        var now = new Date();
        data[this.current()]['log'][0]['out'] = now.getTime();
        var delta = now.getTime() - data[this.current()]['log'][0]['in'];
        data[this.current()]['sum'] += delta;
        lastClock = currentClock;
        currentClock = '';
        this.save();
    }
    this.tempSave = function() {
        if(!this.current()) return;
        if(typeof(data[this.current()]['log'][0]) == "undefined") return;
        var now = new Date();
        var delta = now.getTime() - data[this.current()]['log'][0]['in'];
        data[this.current()]['temp'] = delta;
        this.save();
    }
    this.cancelOpen = function() {
        // Cancel the open timer altogether.  It will be as though you never clocked in.
        if(!this.current()) return;
        if(typeof(data[this.current()]['log'][0]) == "undefined") return;
        if(data[this.current()]['log'][0]['out'] == '')
          data[this.current()]['log'].shift();
        lastClock = currentClock;
        currentClock = '';
        this.save();
    }
    this.checkTemp = function() {
        // check temp
        if(!this.current()) return;
        if(typeof(data[this.current()]['log'][0]) == "undefined") return;
        if(typeof(data[this.current()]['temp']) != "undefined") {
            var temp = parseInt(data[this.current()]['temp']);
            data[this.current()]['sum'] += temp;
            if(data[this.current()]['log'][0]['out'] == '') {
                data[this.current()]['log'][0]['out'] = data[this.current()]['log'][0]['in'] + temp;
            }
            data[this.current()]['temp'] = 0;
        }
        this.save();
    }
    this.save = function() {
        localStorage.setItem('clockData', JSON.stringify(data));
        localStorage.setItem('clockItems', JSON.stringify(items));
        localStorage.setItem('currentClock', currentClock);
        localStorage.setItem('lastClock', lastClock);
    }
    this.genOrgTimestamp = function(theItems) {
        if(!theItems) theItems = items;
        if(!isArray(theItems)) theItems = [theItems];
          var str = "Org Timestamp Log\n======\n";
        for(var i=0; i<theItems.length; i++) {
            str += "* "+theItems[i]+"\n";
            if(typeof(data[theItems[i]]) == "undefined") continue;
            var detail = data[theItems[i]]['log'];
            for(var j=0; j<detail.length; j++) {
                if(!detail[j]['out']) continue;
                var delta = (detail[j]['out'] - detail[j]['in'])/1000;
                if(delta < 60) continue;
                str += "  CLOCK: ";
                var t = new Date(detail[j]['in']);
                str += t.orgTimestamp()+"--";
                t = new Date(detail[j]['out']);
                str += t.orgTimestamp();
                var hours = parseInt(delta/3600);
                if(hours < 10) hours = " "+hours;
                var minutes = (delta - 3600*hours) / 60;
                minutes = ""+Math.round(minutes);
                minutes = minutes.length == 1 ? "0" + minutes : minutes;
                str += " => "+hours+":"+minutes;
                str += "\n";
            }
        }
        return str;
    }
    this.getSum = function(item, minTimestamp, maxTimestamp) {
        // 若输入数组
        if(Object.prototype.toString.call(item) === '[object Array]') {
            var sum = 0;
            for(var i=0; i<item.length; i++) {
                sum += this.getSum(item[i], minTimestamp, maxTimestamp);
            }
            return sum;
        }

        if(typeof(data[item]) == "undefined" || !data[item]['log']) return 0;

        var log, sum, now;
        log = clone(data[item]['log']);
        sum = 0;
        now = new Date();

        if(!maxTimestamp)
          maxTimestamp = now.getTime();
        if(!minTimestamp)
          minTimestamp = 0;


        for(var i=0; i<log.length; i++) {
            if(!log[i]['out']) {
                if(i == 0)
                  log[i]['out'] = now.getTime();
                else
                  continue;
            }
            if(log[i]['in'] > maxTimestamp) break;
            if(log[i]['out'] < minTimestamp) break;
            if(log[i]['in'] < minTimestamp) log[i]['in'] = minTimestamp;
            if(log[i]['out'] > maxTimestamp) log[i]['out'] = maxTimestamp;
            sum += log[i]['out'] - log[i]['in'];
        }

        // console.log(log);
        // console.log("getsum:"+item+","+minTimestamp+","+maxTimestamp+","+sum);

        return sum;
    }
    this.getSumToday = function(item) {
        var d = new Date();
        d.setHours(0,0,0);
        return this.getSum(item, d.getTime());
    }
    this.getSumThisWeek = function(item) {
        // 从周一 00:00 开始计算
        var d = new Date();
        if(d.getDay() == 0) {
            d.setTime(d.getTime() - 1000*60*60*24*6);
        } else {
            d.setTime(d.getTime() - 1000*60*60*24*(d.getDay() - 1));
        }
        d.setHours(0,0,0);
        return this.getSum(item, d.getTime());
    }
    this.getSumThisMonth = function(item) {
        var d = new Date();
        d.setDate(1);
        d.setHours(0,0,0);
        return this.getSum(item, d.getTime());
    }
    this.sortByRencent = function() {
        var that = this;
        items.sort(function(a, b) {
            return that.getItemUpdateTime(b) - that.getItemUpdateTime(a);
        });
        this.save();
    }
    this.sortBySum = function() {
        items.sort(function(a, b) {
            return data[b]['sum'] - data[a]['sum'];
        });
        this.save();
    }
    this.remove = function(item) {
        if(this.current() == item)
          this.clockOut();
        delete data[item];
        for(var i=0;i<items.length;i++) {
            if(item == items[i]) {
                items.splice(i, 1);
            }
        }
        this.save();
    }
    this.reset = function() {
        currentClock = '';
        lastClock = '';
        data = {};
        items = [];
        this.save();
        window.location.reload()
    }
    this.delta = function() {
        if(!this.current()) return false;
        var now = new Date();
        now = now.getTime();
        var last = data[this.current()]['log'][0]['in'];
        var s = Math.floor((now - last) / 1000);
	var hours = formatNumberLength(Math.floor(s/3600));
	var minutes = formatNumberLength(Math.floor((s-hours*3600)/60), 2);
	var seconds = formatNumberLength(Math.floor(s%60), 2);
        var result = seconds;
        if(minutes > 0)
          result = minutes+":"+result;
        if(hours > 0)
          result = hours+":"+result;
        return result;
    }
}
