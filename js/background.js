var clock = new Clock();
function updateClock(id, url) {
    var domain = getDomain(url);
    var ignore = ['devtools'];
    if(ignore.indexOf(domain) != -1) return;
    var out = ['newtab', 'chrome'];
    if(out.indexOf(domain) != -1) {
        clock.clockOut();
        return;
    }
    clock.clockIn(domain);
}
setInterval(function() {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        updateClock(tabs[0]['id'], tabs[0]['url']);
    });
}, 1000);
