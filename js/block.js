var clock = new Clock();
var item = location.hash.replace('#', '');
$('#domain').html(item);
var day = formatTimeDelta(clock.getSumToday(item));
var week = formatTimeDelta(clock.getSumThisWeek(item));
var month = formatTimeDelta(clock.getSumThisMonth(item));
$('#day').html("今天: "+day);
$('#week').html("本周: "+week);
$('#month').html("本月: "+month);
