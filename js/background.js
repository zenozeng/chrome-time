var clock = new Clock();
function init() {
    clock.checkTemp();
    clock.cancelOpen();
}
var notify = function(message, timeout) {
    var notification = webkitNotifications.createNotification(
      chrome.extension.getURL('icons/on.png'),
      'Time Notify',
      message
    );
    notification.show();
    // 显示完之后5秒关闭
    timeout = timeout ? timeout : 900;
    notification.ondisplay = function(e) {
        setTimeout(function() { notification.cancel(); }, timeout);
    }
}
function updateClock(id, url) {
    var opt = localStorage.getItem('opt') != null ? JSON.parse(localStorage.getItem('opt')) : {};
    // 检查有无超时
    function checkLimit() {
        if(typeof(opt['limit']) == "undefined") {
            return;
        }
        for(var i=0; i<opt['limit'].length; i++) {
            var item = opt['limit'][i];
            var sum;
            if(domain == item['domain']) {
                if(item['period'] == 'day') {
                    sum = clock.getSumToday(clock.current());
                } else if(item['period'] == 'week') {
                    sum = clock.getSumThisWeek(clock.current());
                } else {
                    sum = clock.getSumThisMonth(clock.current());
                }
                console.log(domain);
                var max = item['limit'] * 60 * 1000;
                var delta = parseInt((max - sum)/1000);
                if(delta > 0 && delta <= 60) {
                    notify(delta);
                }
                if(delta == 300) {
                    notify('时间预算还有五分钟');
                }
                console.log(delta);
                if(sum > max) {
                    block();
                }
            }
        }
    }
    // （若超时）屏蔽该页面
    function block() {
        console.log('Block:'+domain);
        chrome.tabs.update(id, {"url": 'block.html#'+domain});
    }
    //    console.log("check-url:"+url);
    var domain = getDomain(url);
    var ignore = ['chrome-devtools'];
    if(ignore.indexOf(domain) != -1) return;
    var interrupt = ['newtab', 'chrome', 'chrome-extension'];
    if(interrupt.indexOf(domain) != -1) {
        clock.clockOut();
        return;
    }
    clock.clockIn(domain);
    checkLimit();
}
init();
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    updateClock(tabId, tab['url']);
});
setInterval(function() {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        updateClock(tabs[0]['id'], tabs[0]['url']);
    });
}, 1000);
setInterval(function() {
    clock.tempSave();
}, 60000);
