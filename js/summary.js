var clock = new Clock();
$(document).ready(function() {
    clock.sortBySum();
    var items = clock.items();
    var html = '';
    for(var i=0; i<items.length; i++) {
        var item = items[i];
        html += '<div style="float:left;box-shadow: 0 0 8px #777; margin: 1em; padding: 1em; line-height: 1.5em;">';
        html += '<span style="color: blue">#'+i+" "+item+'</span>';
        html += '\n总计：' + formatTimeDelta(clock.getSum(item));
        html += '\n本月：' + formatTimeDelta(clock.getSumThisMonth(item));
        html += '\n本周：' + formatTimeDelta(clock.getSumThisWeek(item));
        html += '\n今日：' + formatTimeDelta(clock.getSumToday(item));
        html += '</div>';
    }
    $('#items').html(html);
    // var orgShow = clock.genOrgTimestamp();
    // $('#org-show').html(orgShow);
});
