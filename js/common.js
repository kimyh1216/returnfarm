$(document).ready(function(){
    $(".dropdown-menu button,.dropdown-menu a").click(function(){
        $(this).parent().parent().parent().parent().find('.dropdown-toggle').html($(this).text());
    });
    
    $('.share').click(function(){
        $('.shareBox').show();
    });
    $('.shareBox .close').click(function(){
        $('.shareBox').hide();
    });
    
})