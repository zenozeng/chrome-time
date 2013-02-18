// org-clock.js
// Copyright (C) 2013 Zeno Zeng
// 提供类似org的clock的功能

Date.prototype.orgTimestamp = function() {
    var Y = this.getFullYear();
    var m = this.getMonth() + 1;
    m = m > 10 ? m : "0" + m;
    var d = this.getDate();
    d = d > 10 ? d : "0" + d;
    var H = this.getHours();
    H = H > 10 ? H : "0" + H;
    var min = this.getMinutes();
    min = min > 10 ? min : "0" + min;
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
function Clock() {
    var currentClock, data, lastClock, items;
    data = localStorage.getItem('clockData') ? JSON.parse(localStorage.getItem('clockData')) : {};
    items = localStorage.getItem('clockItems') ? JSON.parse(localStorage.getItem('clockItems')) : [];
    currentClock = localStorage.getItem('currentClock') || '';
    lastClock = localStorage.getItem('lastClock') || '';
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
        this.clockOut();
        currentClock = item;
        var now = new Date();
        if(typeof(data[item]) == "undefined") {
            this.add(item);
        } else {
            data[item]['log'].unshift({'in': now.getTime(), 'out': ''})
        }
        this.save();
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
    this.save = function() {
        localStorage.setItem('clockData', JSON.stringify(data));
        localStorage.setItem('clockItems', JSON.stringify(items));
        localStorage.setItem('currentClock', currentClock);
        localStorage.setItem('lastClock', lastClock);
    }
    this.genOrgTimestamp = function() {
        var str = "Org Timestamp Log\n======\n";
        for(var i=0; i<items.length; i++) {
            str += "* "+items[i]+"\n";
            var detail = data[items[i]]['log'];
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
                minutes = Math.round(minutes);
                minutes = minutes < 10 ? "0" + minutes : minutes;
                str += " => "+hours+":"+minutes;
                str += "\n";
            }
        }
        return str;
    }
    this.orderByRencent = function() {
    }
    this.orderBySum = function() {
    }
    this.add = function(item) {
        if(!item) return;
        if(typeof(data[item]) == "undefined") {
            data[item] = {'log':[],'sum':0};
            items.push(item);
        }
        this.clockIn(item);
    }
    this.rm = function(item) {
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
