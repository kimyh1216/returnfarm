
	function urlOpen(url, width, height, scrollbars) {
		window.open(url, '', 'width=' + width + ', height=' + height + ', left=0, top=0, statusbar=0, scrollbars=' +
			scrollbars);
	}

	function fnToggle(targetId) {
		$("#" + targetId).toggle();
		$("#" + targetId).parent().siblings().children("dd").hide();
	}
$(document).ready(function($){
	// data-end속성 자동 추가
	$("[data-complete]").each(function (i) {
			$(this).find('>span').text() == '' ? $(this).find('>span').attr('data-end', false) : $(this)
				.find('>span').attr('data-end', true);
		});
		$("[data-mod]").each(function (i) {
			$(this).text() == '' ? $(this).attr('data-mod', false) : $(this).attr('data-mod', true);
		});

		// 전체페이지 및 수정완료 수량 체크
		var TotalBtn1 = $("[data-complete]").length;
		var TotalBtn2 = $("td").find("[data-mod=true]").length;
		var TotalEnd = $("[data-complete]").find("[data-end=true]").length;
		var TotalStand = TotalBtn1 - TotalEnd;
		var TotalRate = (TotalEnd / TotalBtn1) * 100;
			TotalRate = TotalRate.toFixed(2) + " %";
		
		var $tbTit = $('[class^=tm]:not(.tm)');

		$tbTit.each(function () {
			var capTit = $(this).find('a').text();
			$(this).next().find('table > caption').text(capTit);

		});

		$(".cntadd").html(TotalBtn1);
		$(".cntadd2").html(TotalBtn2);
		$(".count1").html(TotalEnd);
		$(".count2").html(TotalStand);
		$(".tcount").html(TotalRate);

		$('.hisList li:first-child').addClass('on');

		$('.hisList').each(function () {
			$(this).wrap('<div class="hisWrap" />');
			var nodes = $(this).children();
			if (nodes.length > 1) {
				$('<a class="btn off btnHis" />').prependTo($(this).parent('div')).text('수정이력');
			}
		});

		$('.menu>dt a:not(tm)').click(function () {
			var curTotalBtn1 = $(this).parent().next().find("[data-complete]").length;
			var curEnd = $(this).parent().next().find("[data-complete]").find("[data-end=true]").length;
			var curRate = (curEnd / curTotalBtn1) * 100;
				curRate = curRate.toFixed(2) + " %";

			$(".count3").html(curRate);


			$('.menu').removeClass('allview');
			$('.tm').removeClass('selected');
			$(this).addClass('selected').parent('dt').siblings('dt').children('a').removeClass(
				'selected');
			$(this).parent('dt').next('dd').show().siblings('dd').hide();
			
			var idx = parseInt( $(this).closest('dt').attr("class").replace("tm","") );
			window.localStorage.setItem("iaMenuSet",idx);

			return false;
		});
		
		// 전체보기
		$('.tm').click(function () {
			$(this).closest('.menu').addClass('allview').end().addClass('selected');
			$('.menu>dd').show().siblings('dt').children('a').removeClass('selected');
			window.localStorage.setItem("iaMenuSet",0);
			$(this).addClass('selected');
			return false;
		});

		var iaMenuAct = function(num){
			
			num = JSON.parse( window.localStorage.getItem("iaMenuSet") )  ;
			if ( num == 0 ) {
				$(".menu>dt.viewAll a.tm").trigger("click");
			} else {
				if ( !num ) {num = 1} ;
				$(".menu>dt.tm"+num+" a").trigger("click");

				
			}
		}
		iaMenuAct();

		$('.btnHis').click(function () {
			$(this).toggleClass('off');
			$(this).next('.hisList').children('li:not(.on)').toggle();
			return false;
		});
		$('.tip').hover(function () {
			$(this).children('span').toggle();
		});
		// to top
		var scrollDiv = document.createElement('div');
		$(scrollDiv).attr('id', 'toTop').html('<a href="#nohref">↑ 처음으로 이동</a>').appendTo('body');
		$(window).scroll(function () {
			if ($(this).scrollTop() != 0) {
				$('#toTop').fadeIn();
			} else {
				$('#toTop').fadeOut();
			}
		});
		$('#toTop').click(function () {
			$('body,html').animate({
				scrollTop: 0
			}, 600);
			return false;
		});

		//a 링크 text 생성
		$('table a').each(function () {
			$(this).text($(this).attr('href'));
		});
		//tr active 생성
		$('tr').on('click', function () {
			$(this).toggleClass('active');
		})

		//Created By: Brij Mohan
		//Website: http://techbrij.com
		function groupTable($rows, startIndex, total) {
			if (total === 0) {
				return;
			}
			var i, currentIndex = startIndex,
				count = 1,
				lst = [];
			var tds = $rows.find('td:eq(' + currentIndex + ')');
			var ctrl = $(tds[0]);
			lst.push($rows[0]);
			for (i = 1; i <= tds.length; i++) {
				if ( $.trim( ctrl.text() )== $.trim( $(tds[i]).text() ) && $.trim( ctrl.text() ) !== '' ) {
					count++;
					$(tds[i]).addClass('deleted');
					lst.push($rows[i]);
				} else {
					if (count > 1) {
						ctrl.attr('rowspan', count);
						groupTable($(lst), startIndex + 1, total - 1)
					}
					count = 1;
					lst = [];
					ctrl = $(tds[i]);
					lst.push($rows[i]);
				}
			}
		}

		$('table').each(function (i) {
			groupTable($(this).find('tr:has(td)'), 0, 3);

		})
		$('table .deleted').remove();
		// groupTable method has 3 arguments:
		// $rows: jQuery object of table rows to be grouped
		// startIndex: index of first column to be grouped
		// total: total number of columns to be grouped

		// 이미지 미리보기 html2canvas
		// var prevImg = function(){

		// 	var _img = new Image(),
		// 		$target = $('.menu dd a'),
		// 		$imgbox = $('.previewImg'),
		// 		isMoving = 'false';

		// 	$target.each(function(){
		// 		$(this).parent().append('<span class="btn btnPreview" style="margin-left:10px;cursor:pointer" data-attr="'+ $(this).attr('href') +'">preview</span>');
		// 	});

		// 	function takeSnapshotOfURL(url) {
		// 		var iframe = document.createElement('iframe');
		// 		iframe.src = url;
		// 		iframe.style.cssText = 'position: absolute; opacity:0; z-index: -9999';
		// 		document.body.appendChild(iframe);
		// 		isMoving = 'true';
		// 		return new Promise(function(res, rej) {
		// 			iframe.onload = function(e) {
		// 				html2canvas(iframe.contentDocument.documentElement,{
		// 					scale: .4
		// 				})
		// 				.then(function(canvas) {
		// 					document.body.removeChild(iframe);
		// 					res(canvas);
		// 				})
		// 				.catch(rej);

		// 				isMoving = 'false';
		// 				// console.log(isMoving,'iframe');

		// 			};
		// 			iframe.onerror = rej;
		// 		});
		// 	}

	
		// 	$('.btnPreview').on('mouseenter', function(e){
		// 		var _uri = $(this).data('attr').split('../../html')[1],
		// 			locHref = document.location.href.split('/guide')[0],
		// 			tarUri = locHref + _uri,
		// 			_prevImg;

		// 		if(isMoving == 'true'){
		// 			return false;
		// 		} else if(isMoving == 'false'){

		// 			takeSnapshotOfURL(tarUri).then(function(canvas) {
		// 				$imgbox.show().empty().append(canvas).find(canvas).removeAttr('style');
		// 			});
		// 			// console.log(isMoving,'mouseenter');
		// 		}


		// 	}).on('mouseleave',function(){
		// 		setTimeout(function(){
		// 			$imgbox.hide().empty();
		// 			// console.log(isMoving,'mouseleave');
		// 		},500);
		// 	});

		// }();
})
	
