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
    $('.secrComm').click(function(){
        if($(this).hasClass('lock')){
            $(this).removeClass('lock');
        }else {
            $(this).addClass('lock');
        }
    });
    $('.btnCom').click(function () {
        $(this).addClass('show');
    });
})