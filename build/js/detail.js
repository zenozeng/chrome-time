var clock = new Clock();
var item = location.hash.replace('#', '');
item = decodeURIComponent(item);
$('#domain').html(item);
var items = JSON.parse(item);
console.log(items);
var day = formatTimeDelta(clock.getSumToday(items));
var week = formatTimeDelta(clock.getSumThisWeek(items));
var month = formatTimeDelta(clock.getSumThisMonth(items));
var sum = formatTimeDelta(clock.getSum(items));
$('#day').html("今天: "+day);
$('#week').html("本周: "+week);
$('#month').html("本月: "+month);
$('#sum').html("总计: "+sum);
$('#clock').html(clock.genOrgTimestamp(items));