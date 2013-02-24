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
function isArray(input){
    return typeof(input)=='object'&&(input instanceof Array);
}

// common

function getItemsViaOpt(item) {
    var opt = localStorage.getItem('opt') != null ? JSON.parse(localStorage.getItem('opt')) : {};
    var items = false;
    for(var i=0; i<opt['limit'].length; i++) {
        var optItem = opt['limit'][i];
        var sum;
        if(isArray(optItem['domain']) && optItem['domain'].indexOf(item) !== -1) {
            items = optItem['domain']
        }
    }
    return items;
}

// function getDomain(url) {
//     var parts = url.split('/');
//     return parts[2];
// }
