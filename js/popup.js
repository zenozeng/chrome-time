var clock = new Clock();
function update() {
    var item = clock.current();
    var items = getItemsViaOpt(item);
    if(items.length == 0) items = item;

    var day = clock.getSumToday(items);
    var week = clock.getSumThisWeek(items);
    var month = clock.getSumThisMonth(items);

    var dayBudget = getBudget(item, 'day');
    var weekBudget = getBudget(item, 'week');
    var monthBudget = getBudget(item, 'month');

    day = dayBudget ? formatTimeDelta(day)+" / "+formatTimeDelta(dayBudget) : formatTimeDelta(day);
    week = weekBudget ? formatTimeDelta(week)+" / "+formatTimeDelta(weekBudget) : formatTimeDelta(week);
    month = monthBudget ? formatTimeDelta(month)+" / "+formatTimeDelta(monthBudget) : formatTimeDelta(month);

    $('#day').html("今天: "+day);
    $('#week').html("本周: "+week);
    $('#month').html("本月: "+month);
}
console.log('fisrt try');
$(document).ready(function() {
    update();
});
setInterval(function() {
    update();
}, 1000);
