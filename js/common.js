$(document).ready(function(){
    $(".dropdown-menu button,.dropdown-menu a").click(function(){
        $(this).parent().parent().parent().parent().find('.dropdown-toggle').html($(this).text());
    });
    
    $('.share').click(function(){
        $('.share-box').show();
    });
    $('.share-box .close').click(function(){
        $('.share-box').hide();
    });
    $('.secr-comm').click(function(){
        if($(this).hasClass('lock')){
            $(this).removeClass('lock');
        }else {
            $(this).addClass('lock');
        }
    });
    $('.btn-com').click(function () {
        $(this).addClass('show');
    });
    $('.accordion-btn').click(function() {
        $(this).parents().addClass('show').siblings().removeClass('show');
    })
})