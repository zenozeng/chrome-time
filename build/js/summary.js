var clock = new Clock();
$(document).ready(function() {
    clock.sortBySum();
    var items = clock.items();
    var html = '';
    var opt = localStorage.getItem('opt') != null ? JSON.parse(localStorage.getItem('opt')) : {};

    for(var i=0; i<items.length; i++) {
        var item = items[i];
        html += '<div style="max-width:850px;margin:0 auto;border-bottom:#fff;  padding: 1em; line-height: 1.5em; font-size:12px;">';
        html += '<a href="detail.html#'+encodeURIComponent(JSON.stringify(item))+'" style="text-decoration:none;">';
        html += '<span style="color: red">#'+i+" "+JSON.stringify(item)+'</span>';
        html += '</a>';
        html += '<span style="float:right">';
        html += '<span style="width:90px; display:inline-block;text-align:left;">';
        html += '总计：' + formatTimeDelta(clock.getSum(item));
        html += '</span>';
        html += '&nbsp;&nbsp;';
        html += '<span style="width:90px; display:inline-block;text-align:left;">';
        html += '本月：' + formatTimeDelta(clock.getSumThisMonth(item));
        html += '</span>';
        html += '&nbsp;&nbsp;';
        html += '<span style="width:80px; display:inline-block;text-align:left;">';
        html += '本周：' + formatTimeDelta(clock.getSumThisWeek(item));
        html += '</span>';
        html += '&nbsp;&nbsp;';
        html += '<span style="width:80px; display:inline-block;text-align:left;">';
        html += '今日：' + formatTimeDelta(clock.getSumToday(item));
        html += '</span>';
        html += '</span>';
        html += '</div>';
    }
    $('#items').html(html);
});
