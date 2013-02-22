var clock = new Clock();
$(document).ready(function() {
    var orgShow = clock.genOrgTimestamp();
    $('#org-show').html(orgShow);
});
