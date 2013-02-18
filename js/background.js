var clock = new Clock();
function init() {
    clock.checkTemp();
    clock.cancelOpen();
}
function updateClock(id, url) {
    var domain = getDomain(url);
    var ignore = ['devtools'];
    if(ignore.indexOf(domain) != -1) return;
    var interrupt = ['newtab', 'chrome'];
    if(interrupt.indexOf(domain) != -1) {
        clock.clockOut();
        return;
    }
    clock.clockIn(domain);
}
init();
setInterval(function() {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        updateClock(tabs[0]['id'], tabs[0]['url']);
    });
}, 1000);
setInterval(function() {
    clock.tempSave();
}, 60000);
