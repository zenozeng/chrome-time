var clock = new Clock();
$(document).ready(function() {
    clock.sortBySum();
    var items = clock.items();
    var html = '';
    var opt = localStorage.getItem('opt') != null ? JSON.parse(localStorage.getItem('opt')) : {};

    if(typeof(opt['limit']) != "undefined") {
        for(var i=0; i<opt['limit'].length; i++) {
            var item = opt['limit'][i]['domain'];
            html += '<div style="float:left;box-shadow: 0 0 8px #777; margin: 1em; padding: 1em; line-height: 1.5em;">';
            html += '<a href="detail.html#'+encodeURIComponent(JSON.stringify(item))+'" style="text-decoration:none">';
            html += '<span style="color: blue">[*] '+JSON.stringify(item)+'</span>';
            html += '</a>';
            html += '\n总计：' + formatTimeDelta(clock.getSum(item));
            html += '\n本月：' + formatTimeDelta(clock.getSumThisMonth(item));
            html += '\n本周：' + formatTimeDelta(clock.getSumThisWeek(item));
            html += '\n今日：' + formatTimeDelta(clock.getSumToday(item));
            html += '</div>';
        }
    }

    html += '<div style="clear:left"></div>';

    for(var i=0; i<items.length; i++) {
        var item = items[i];
        html += '<div style="float:left;box-shadow: 0 0 8px #777; margin: 1em; padding: 1em; line-height: 1.5em;">';
        html += '<a href="detail.html#'+encodeURIComponent(JSON.stringify(item))+'" style="text-decoration:none">';
        html += '<span style="color: blue">#'+i+" "+JSON.stringify(item)+'</span>';
        html += '</a>';
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
