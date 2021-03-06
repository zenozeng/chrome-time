function getDomain(url) {
    // 对普通的url也适用，获取根域名
    if(url.indexOf('localhost') == 0 || url.indexOf('://localhost') != -1) {
        return 'localhost';
    }
    if(url.indexOf('chrome-extension://') == 0) {
        return 'chrome-extension';
    }
    if(url.indexOf('chrome-devtools://') == 0) {
        return 'chrome-devtools';
    }
    if(url.indexOf('chrome://newtab') == 0) {
        return 'newtab';
    }
    if(url.indexOf('chrome://extensions') == 0) {
        return 'chrome-extension';
    }
    if(url.indexOf('chrome://') == 0) {
        return 'chrome';
    }
    var parts = url.split('/');
    var domain = '';
    for(var i=0; i<parts.length; i++) {
        var part = parts[i];
        if(part.indexOf('.') != -1) {
            domain = part;
            break;
        }
    }
    parts = domain.split('.');
    if(parts[0] == 'www') {
        parts.shift();
    }
    return parts.join('.');
}
// function getDomain(url) {
//     var parts = url.split('/');
//     return parts[2];
// }

function isArray(input){
    return typeof(input)=='object'&&(input instanceof Array);
}

// common

function getSaying() {
    if(typeof(sayings) == "undefined") return false;
    var random = Math.random() * sayings.length;
    random = parseInt(random);
    return sayings[random];
}

function getItemsViaOpt(item, returnDelta, period, returnBudget) {
    var opt = localStorage.getItem('opt') != null ? JSON.parse(localStorage.getItem('opt')) : {};
    var itemsViaOpt = [];

    if(typeof(opt['limit']) == "undefined") return [];

    var delta = 3600*10000; // as the init delta value should be large enough
    var budget = false;
    for(var i=0; i<opt['limit'].length; i++) {
        var optItem = opt['limit'][i];
        var sum;
        if(period) {
            if(optItem['period'] != period) continue;
        }
        if(item == optItem['domain'] || (isArray(optItem['domain']) && optItem['domain'].indexOf(item) !== -1)) {
            if(optItem['period'] == 'day') {
                sum = clock.getSumToday(optItem['domain']);
            } else if(optItem['period'] == 'week') {
                sum = clock.getSumThisWeek(optItem['domain']);
            } else {
                sum = clock.getSumThisMonth(optItem['domain']);
            }
            var max = optItem['limit'] * 60 * 1000;
            var deltaTmp = parseInt((max - sum)/1000);
            if(deltaTmp < delta) {
                delta = deltaTmp;
                itemsViaOpt = optItem['domain'];
                budget = max;
            }
        }
    }

    itemsViaOpt = isArray(itemsViaOpt) ? itemsViaOpt : [itemsViaOpt];
    if(returnDelta) {
        if(returnBudget) {
            return [itemsViaOpt, delta, budget];
        } else {
            return [itemsViaOpt, delta];
        }
    } else {
        if(returnBudget) {
            return [itemsViaOpt, budget];
        } else {
            return itemsViaOpt;
        }
    }
}
function getBudget(item, period) {
    var arr = getItemsViaOpt(item, false, period, true);
    return arr[1];
}
