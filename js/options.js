var opt = typeof(localStorage.getItem('opt')) == "undefined" ? JSON.parse(localStorage.getItem('opt')) : {};
function appendItem(domain, limit) {
    var html = '<input type="text" class="domain" placeholder="example.com" value="'
             + domain
             + '">'
             + '<input type="text" class="limit" placeholder="Time Limit" value="'
             + limit
             + '">'
             + '<input type="submit" class="done" value="DONE">'
             + '<input type="submit" class="cancel" value="CANCEL">';
    html = '<div class="item">'+html+'</div>';
    $('#items').prepend(html);
}
$(document).ready(function() {
    $('#add').click(function() {
        appendItem('', '');
    });
    $('#items').on('click', '.done', function() {
        console.log($(this).parent().find('.domain'));
//        var domain = $(this).parent().find('.domain').val();
//        alert(domain);
//        return false;
    });
    $('#items').on('click', '.cancel', function() {
        $(this).parent().remove();
        return false;
    });
});