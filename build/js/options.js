var opt = localStorage.getItem('opt') != null ? JSON.parse(localStorage.getItem('opt')) : {};
function appendItem(domain, limit, period, id) {
    if(!id) {
        var now = new Date()
        id = 'hash'+now.getTime();
    }
    if(!period) {
        period = 'day';
    }
    var html = '<input type="text" class="domain" placeholder="example.com" value="'
             + domain
             + '">'
             + '<input type="text" class="limit" placeholder="Time Limit (分钟)" value="'
             + limit
             + '">'
             + '<select>';
    html += period == 'day' ? '<option value="day" selected>Day</option>' : '<option value="day">Day</option>';
    html += period == 'week' ? '<option value="week" selected>Week</option>' : '<option value="week">Week</option>';
    html += period == 'month' ? '<option value="month" selected>Month</option>' : '<option value="month">Month</option>';
    html += '</select>'
          + '<input type="submit" class="done" value="DONE">'
          + '<input type="submit" class="cancel" value="DELETE">';
    html = '<div class="item" id="'+id+'">'+html+'</div>';
    $('#items').prepend(html);
}
function saveOpt() {
    localStorage.setItem('opt', JSON.stringify(opt));
}
var confirmKeyupTimes = 0;
var confirmCheckPass = false;
var confirmTime = 10;
var confirmIdLog = '';
$(document).ready(function() {
    if(typeof(opt['limit']) == "undefined") {
        opt['limit'] = [];
    }
    if(opt['limit'].length == 0) {
        appendItem('', '');
    } else {
        for(var i=0; i<opt['limit'].length; i++) {
            var item = opt['limit'][i];
            appendItem(item['domain'], item['limit'], item['period'], item['id']);
        }
    }
    $('#add').click(function() {
        appendItem('', '');
    });
    $('#items').on('click', '.done', function() {
        $(this).css('position','relative');
        $(this).animate({'top':'5px'}, 200, 'swing', function() {
            $(this).animate({'top':'0'}, 200);
        });
        $(this).css('background','#98FB98');

        var id = $(this).parent().attr('id');
        var domain = $(this).parent().find('.domain').val();
        domain = domain.replace(/ /g, '');
        if(domain.indexOf(',') !== -1) {
            var domains = domain.split(',');
            domain = [];
            for(var i=0;i<domains.length;i++) {
                domain.push(getDomain(domains[i]));
            }
        } else {
            domain = getDomain(domain);
        }
        if(!domain) return;
        var limit = $(this).parent().find('.limit').val();
        limit = parseInt(limit);
        if(isNaN(limit)) return;
        var period = $(this).parent().find('select').val();
        var option = {'domain': domain, 'limit':limit, 'period':period, 'id':id};
        for(var i=0; i<opt['limit'].length; i++) {
            if(opt['limit'][i]['id'] == id) {
                if(!confirmCheckPass) {
                    console.log('!confirm');
                    if(opt['limit'][i]['limit'] < limit) {
                        confirmIdLog = '#'+id+' .done';
                        $('#confirm').fadeIn(400);
                        return;
                    }
                }
                opt['limit'].splice(i, 1);
            }
        }
        opt['limit'].push(option);
        saveOpt();
    });
    $('#items').on('click', '.cancel', function() {
        var id = $(this).parent().attr('id');
        if(!confirmCheckPass) {
            console.log('!confirm');
            confirmIdLog = '#'+id+' .cancel';
            $('#confirm').fadeIn(400);
        }
        for(var i=0; i<opt['limit'].length; i++) {
            if(opt['limit'][i]['id'] == id)
              opt['limit'].splice(i, 1);
        }
        saveOpt();
        $(this).parent().fadeOut(800);
    });
    $('#confirm p').html(getSaying());

    $('#confirm textarea').on('keyup', function() {
        confirmKeyupTimes += 1;
        console.log('key');
    });
    function checkConfirm() {
        if(confirmKeyupTimes <= 10) {
            alert('亲，不要闹了，认认真真打一遍吧！');
            $('#confirm textarea').val('');
            return false;
        }
        if($('#confirm textarea').val() != $('#confirm p').text()) {
            console.log($('#confirm textarea').val());
            alert('好像和上面的话不太一样哦');
            $('#confirm textarea').text('');
            return false;
        }
        return true;
    }
    $('#confirm-sure').click(function() {
        if(checkConfirm()) {
            $('#confirm-sure').text(confirmTime);
            setInterval(function() {
                if(confirmCheckPass) return;
                confirmTime -= 1;
                $('#confirm-sure').text(confirmTime);
            }, 1000);
            setTimeout(function() {
                confirmCheckPass = true;
                $('#confirm').fadeOut(800, function() {
                    var dom = confirmDomLog;
                    $(dom).click();
                });
            }, 1000*(confirmTime+1));
        }
    });
    $('#confirm-cancel').click(function() {
        window.location.reload();
    });
});
