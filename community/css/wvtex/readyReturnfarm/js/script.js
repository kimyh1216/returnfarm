/* script.js */

//JQUERY 시작
$(document).ready(function(){
//datepicker
$( "input.datepicker" ).datepicker({
  showOn: "both",
  buttonImage: "../img/ico_datepicker.png",
  buttonImageOnly: true,
     buttonText: "Select date",
  
});

  // KR language callendar
$.datepicker.regional['kr'] = {
  closeText: '닫기', // 닫기 버튼 텍스트 변경
  currentText: '오늘', // 오늘 텍스트 변경
  monthNames: ['1 월','2 월','3 월','4 월','5 월','6 월','7 월','8 월','9 월','10 월','11 월','12 월'], // 개월 텍스트 설정
  monthNamesShort: ['1 월','2 월','3 월','4 월','5 월','6 월','7 월','8 월','9 월','10 월','11 월','12 월'], // 개월 텍스트 설정
  dayNamesMin: ['일','월','화','수','목','금','토'], // 요일 텍스트 설정
  dayNamesShort: ['월','화','수','목','금','토','일'], // 요일 텍스트 축약 설정&nbsp;   dayNamesMin: ['월','화','수','목','금','토','일'], // 요일 최소 축약 텍스트 설정
  dateFormat: 'yy-mm-dd', // 날짜 포맷 설정
  showMonthAfterYear: true
};

$('.ui-datepicker ').css({ "margin-left" : "-100px", "margin-top": "0px"});  //달력(calendar) 위치
//  $('img.ui-datepicker-trigger').attr('align', 'absmiddle');
  // Seeting up default language, Korean
$.datepicker.setDefaults($.datepicker.regional['kr']);

 //모바일 메뉴
 $('.btn_mobile_menu').click(function () {
  $('.lnb').addClass('on');  
});

$('.btn_lnb_close').click(function () {
  $('.lnb').removeClass('on');
});
  });



