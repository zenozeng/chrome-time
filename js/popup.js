function update() {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        var clock = new Clock();
        var item = getDomain(tabs[0]['url']);
        console.log(item);
        var day = formatTimeDelta(clock.getSumToday(item));
        var week = formatTimeDelta(clock.getSumThisWeek(item));
        var month = formatTimeDelta(clock.getSumThisMonth(item));
        $('#day').html("Today: "+day);
        $('#week').html("This Week: "+week);
        $('#month').html("This Month: "+month);
    });
}
update();
setInterval(function() {
    update();
}, 1000);
