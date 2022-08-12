$(document).ready(function(){
    $(".dropdown-menu button,.dropdown-menu a").click(function(){
        console.log($(this).closest('.dropdown-toggle').html());
        $(this).parent().parent().parent().parent().find('.dropdown-toggle').html($(this).text());
    });
})