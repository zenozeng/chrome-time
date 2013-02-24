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
        var arr = getItemsViaOpt(domain, true);
        var itemsViaOpt = arr[0];
        var delta = arr[1];
        if(itemsViaOpt.length == 0) return;

        if(delta <= 0) {
            block(JSON.stringify(itemsViaOpt));
        }
        if(delta > 0 && delta <= 60) {
            notify(delta);
        }
        if(delta == 300) {
            notify('时间预算还有五分钟', 5000);
        }
    }
    // （若超时）屏蔽该页面
    function block(go) {
        go = go ? go : domain;
        chrome.tabs.update(id, {"url": 'block.html#'+go});
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
