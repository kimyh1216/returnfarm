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
    $('.accordion-btn').click(function() {
        $(this).parents().addClass('show').siblings().removeClass('show');
    })
    
    //상단 드롭다운 버튼
    $(".dropdown-menu a").click(function(){
        $(".dropdown-toggle:first-child").html($(this).text()+' <span class="caret"></span>');
    });

    //scroll top 버튼
    $(window).scroll(function() {
        if ($(this).scrollTop()>200) {
            $('.gototop button').fadeIn(500);
        }else{
            $('.gototop button').fadeOut(500);
        }
    });
    $('.gototop button').click( function() {
        $( 'html, body' ).animate( { scrollTop : 0 }, 400 );
        return false;
    });

    $('[data-toggle="offcanvas"]').on('click', function () {
        $('.offcanvas-collapse').toggleClass('open')
    });
    $('.btn-close').on('click', function () {
        $('.offcanvas-collapse').toggleClass('open')
    })

})