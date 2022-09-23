var adminS = function(options){
	var pageW,sizeCN,sizeCN2; // pageW은 window의 가로사이즈, sizeCN는 가변적인 사이즈에 유동적으로 사용
	var defaults = {//default setting
		pageMode :	"normal",	// 본 페이지 콘텐츠 사이즈 normal & wide
		pageN:		[1,02,03],	// 본 페이지 메뉴 설정 [1depth,2depth,3depth,]
		menuOpen:	"open",		// open & close
		pageSize : 895,			// content width size
		topMenu : 160,			// 가로사이즈 정보 [기본은 고정]
		menuMode : "left"		// 본 페이지 메뉴 영역설정 left & right			(default : 895)
	}
	var options = $.extend(defaults, options);
	if(options.menuOpen == "close"){
		 $(".leftLayout").css("width",40);
		 $(".contentLayout").css("margin-left",40);
		 $(".sMode > a").css("margin-left",10);
	}
	$(window).resize(function(){
		reSizeS(); // loayout size
		if (options.menuMode == "right"){
			reSizeSR(); // menuMode right
		}
	});
	$(window).load(function() {
	  $('.loadingBox').fadeOut(1000, function() {
		$(this).remove();
	  });
	});	
	adminMS(); // admin default script
	reSizeS(); // loayout size
	function reSizeS(){
		pageW = $(window).width();
		sizeCN = $(".topTopBoxIn").offset();
		if(options.pageMode !== "wide"){
			if (options.menuMode == "left"){
				if(pageW > (sizeCN.left+options.pageSize+options.topMenu)){
					$(".topButtonBox").css("left",options.pageSize+10);
				}else{
					$(".topButtonBox").css("left",options.pageSize-options.topMenu);
				}
			}
		}
	}
	function reSizeSR(){
		pageW = $(window).width();
		sizeCN = options.pageSize;
		var menuSize;
		var reSizeR;
		if($(".leftMenuBox > ul > li").hasClass("sMode")){
			menuSize = 40;
		}else{
			menuSize = 380;
		}
		reSizeR = pageW-(sizeCN+menuSize)
		if(reSizeR < 0){
			reSizeR = 0;
		}
		$(".topTopBoxIn").stop().animate({"margin-left" : reSizeR},500,"easeOutQuint");
		$(".contentLayoutIn").stop().animate({"margin-left" : reSizeR},500,"easeOutQuint",function(){
			if(reSizeR > (options.topMenu + 10)){
				$(".topButtonBox").css("left",reSizeR-(options.topMenu + 10));
			}else{
				$(".topButtonBox").css("left",reSizeR+10);
			}
		});
		$(".sModeName").css("right",60);
	}
	function adminMS(){//admin main script
		if(options.menuOpen == "close"){
			mode();
		}
		if(options.pageSize !== 895){
			if(options.pageMode == "normal"){
				$(".topTopBoxIn").css("max-width",options.pageSize);
				$(".contentLayoutIn").css("max-width",options.pageSize);
			}
		}
		if(options.pageMode == "wide"){
			$(".contentLayoutIn").css("max-width","100%");
		}
		var mIndex;
		$(".leftMenuBox").find("a").after('<span class="fa"></span>');
		$(".leftMenuBox > ul > li > a").click(function(){
			mIndex = $(this).parent().attr("mid");
			pageS(mIndex,0,0);
		});
		$(".leftMenuBox > ul > li > ul > li > a").click(function(){
			mIndex = $(this).parent().attr("mid");
			pageS(0,mIndex,0);
		});
		$(".leftMenuBox").mouseenter(function(){
			if($(".leftMenuBox > ul > li").hasClass("sMode")){
				$(".leftLayout").stop().animate({"width" : 380},500,"easeOutQuint");
				$(".leftTopBox > h1").show();
				$(".sMode > a").animate({"margin-left" : 0},100);
				$(".menuOn > ul").show();
			}
		});
		$(".leftLayout").mouseleave(function(){
			if($(".leftMenuBox > ul > li").hasClass("sMode")){
				$(".leftMenuBox > ul > li > ul").hide();
				$(".sMode > a").animate({"margin-left" : 10},100);
				$(".leftLayout").stop().animate({"width" : 40},500,"easeOutQuint");
				$(".leftTopBox > h1").hide();
			}
		});
		$(".locationBox > ul > li").mouseenter(function(){
			$(".locationBoxIn").stop().slideUp();
			$(this).find(".locationBoxIn").stop().slideDown();
		});
		$(".locationBox").mouseleave(function(){
			$(".locationBoxIn").stop().slideUp();
		});
		$(".leftCButton").click(function(){// wide mode control
			mode();
		});
		if (options.menuMode == "right"){
			$(".leftLayout").addClass("rightMode");
			reSizeSR();	// menuMode right
		}
		pageS(options.pageN[0],options.pageN[1],options.pageN[2]); //page setting
	}
	function pageS(n,m,l){//menu on&off script
		if(n !== 0){
			$(".leftMenuBox > ul > li").removeClass("menuOn");
			
			$(".leftMenuBox > ul > li").each(function(){
				// 2017.01.17 폴더 열리고 닫히는 아이콘 변경 처리
				$(this).find("a > span").addClass("fa-folder");
				$(this).find("a > span").removeClass("fa-folder-open");
				if($(this).attr("mid") == n){
					$(this).addClass("menuOn");
					// 2017.01.17 폴더 열리고 닫히는 아이콘 변경 처리
					$(this).find("a > span").removeClass("fa-folder");
					$(this).find("a > span").addClass("fa-folder-open");
				}
			});
			$(".leftMenuBox > ul > li > span").addClass("fa-angle-right");
			$(".leftMenuBox > ul > li > ul").hide();
			$(".menuOn > ul").slideDown();
			$(".menuOn > ul > li").each(function(){
				if($(this).children("ul").index() > -1){
					$(this).children("span").addClass("fa-angle-down");
					if($(this).hasClass("submenuOn")){
						$(this).children("ul").slideDown();
						$(this).children("span").removeClass("fa-angle-down");
						$(this).children("span").addClass("fa-angle-up");
					}
				}
			});
		}
		if(m !== 0){
			$(".menuOn > ul > li").removeClass("submenuOn");
			$(".menuOn > ul > li").each(function(){
				// 2017.01.17 폴더 열리고 닫히는 아이콘 변경 처리
				$(this).find("a > span").addClass("fa-folder");
				$(this).find("a > span").removeClass("fa-folder-open");
				if($(this).attr("mid") == m){
					
					$(this).addClass("submenuOn");
					// 2017.01.17 폴더 열리고 닫히는 아이콘 변경 처리
					$(this).find("a > span").removeClass("fa-folder");
					$(this).find("a > span").addClass("fa-folder-open");
				}
			});
			$(".menuOn > ul > li > ul").slideUp();
			$(".menuOn > ul > li > span").removeClass("fa-angle-up");
			$(".menuOn > ul > li").each(function(){
				/*$(this).addClass("fa-angle-down");*/
				if($(this).children("ul").index() > -1){
					$(this).children("span").addClass("fa-angle-down");
					if($(this).hasClass("submenuOn")){
						$(this).children("ul").slideDown();
						$(this).children("span").removeClass("fa-angle-down");
						$(this).children("span").addClass("fa-angle-up");
					}
				}
			});
		}
		if(l !== 0){
			$(".submenuOn > ul > li").each(function(){
				if($(this).attr("mid") == l){
					$(this).children("span").addClass("fa-minus");
					$(this).children("a").addClass("subPageOn");
				}
			});
		}
	}
	
	function mode (){
		var sMName = $(".leftTopBox").text();
		
		if($(".leftMenuBox > ul > li").hasClass("sMode")){
			UT.setCookie("closeYn", "open", 60*60*24*30, "/", "", "");
			$(".leftCButton").removeClass("fa-navicon");
			$(".leftCButton").addClass("fa-dedent");
			$(".leftTopBox > h1").show();
			$(".sMode > a").animate({"margin-left" : 0},100);
			$(".leftMenuBox > ul > li").removeClass("sMode");
			$(".leftLayout").animate({"width" : 380},500,"easeOutQuint");
			if (options.menuMode == "left"){
				$(".contentLayout").animate({"margin-left" : 380},500,"easeOutQuint");
			}else{
				$(".contentLayout").animate({"margin-left" : 0},500,"easeOutQuint");
			}
			$(".sModeName").hide();
			$(".copyBox").show();
			pageS(options.pageN[0],0,0);
		}else{
			UT.setCookie("closeYn", "close", 60*60*24*30, "/", "", "");
			$(".leftCButton").addClass("fa-navicon");
			$(".leftCButton").removeClass("fa-dedent");
			$(".leftTopBox > h1").hide();
			$(".leftMenuBox > ul > li > ul").hide();
			$(".leftMenuBox > ul > li").addClass("sMode");
			$(".sMode > a").animate({"margin-left" : 10},100);
			$(".leftLayout").animate({"width" : 40},500,"easeOutQuint");
			if (options.menuMode == "left"){
				$(".contentLayout").animate({"margin-left" : 40},500,"easeOutQuint");
			}else{
				$(".contentLayout").animate({"margin-left" : 0},500,"easeOutQuint");
			}
			$(".sModeName").text(sMName);
			$(".sModeName").show();
			$(".copyBox").hide();
		}
		if (options.menuMode == "right"){
			reSizeSR();	// menuMode right
		}	
	}
	function etc(){
		$("input").each(function(){
			if($(this).attr("readonly") == true){
				$(this).addClass("noWrite");
			}
		});
	}
	etc();

}