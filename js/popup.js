function update() {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        var clock = new Clock();
        var item = getDomain(tabs[0]['url']);
        var items = getItemsViaOpt(item);
        if(items.length == 0) items = item;

        var day = formatTimeDelta(clock.getSumToday(items));
        var week = formatTimeDelta(clock.getSumThisWeek(items));
        var month = formatTimeDelta(clock.getSumThisMonth(items));

        if(!day || day == ' ') day = "暂无记录";
        if(!week) week = "暂无记录";
        if(!month) month = "暂无记录";

        $('#day').html("今天: "+day);
        $('#week').html("本周: "+week);
        $('#month').html("本月: "+month);
    });
}
update();
setInterval(function() {
    update();
}, 1000);
