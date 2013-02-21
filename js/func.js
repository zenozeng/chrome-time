function getDomain(url) {
    // 对普通的url也适用，获取根域名
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
