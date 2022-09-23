/**
 * jquery.wvtex.util.js
 * author : giant194@gmail.com
 * created : 2016.06.30
 * 화면 공통 유틸 스크립트를 작성한다.
 */

var UT = {
	/**
     * get cookie
     */
    getCookie : function(name) {
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
            var cook = cookies[i].split("=");
            if (cook.length == 2) {
                cook[0] = cook[0].trim();
                cook[1] = cook[1].trim();
                if (cook[0] == name) {
                    return unescape(cook[1]);
                }
            }
        }
        return "";
    },
    /**
     * set cookie
     */
    setCookie : function(name, value, seconds, path, domain, secure) {
        var cookie = [];
        cookie.push(name + "=" + escape(value));
        if (path != "") {
            cookie.push("path=" + path);
        }
        if (domain != "") {
            cookie.push("domain=" + domain);
        }
        if (secure != "") {
            cookie.push("secure");
        }
        if (typeof seconds === "number") {
            var date = new Date((new Date()).getTime() + (seconds * 1000));
            cookie.push("expires=" + date.toGMTString());
        } else if (typeof seconds === "object") {
            cookie.push("expires=" + seconds.toGMTString());
        }
        document.cookie = cookie.join(";");
    },
    /**
     * del cookie
     */
    delCookie : function(name, path, domain, secure) {
        var cookie = [];
        cookie.push(name + "=");
        if (path != "") {
            cookie.push("path=" + path);
        }
        if (domain != "") {
            cookie.push("domain=" + domain);
        }
        if (secure != "") {
            cookie.push("secure");
        }
        cookie.push("expires=");
        document.cookie = cookie.join(";");
    },
    /**
     * enter를 쳤을 경우 함수 호출하기
     * useage : onKeyup="UT.callFunctionByEnter(event, doLogin);"
     * 
     */
    callFunctionByEnter : function(event, func) {
        var args = Array.prototype.slice.call(arguments, 2);
        if (event.keyCode == 13) {
            if (typeof func === "function") {
                func.apply(this, args);
            }
        } else {
            return;
        }
    },
    /**
     * 메뉴 이동 함수
     * useage : onclick="UT.moveByMenuUrl(url, currentMenuNo, formId, tabOrdr);"
     * 
     */
    moveByMenuUrl : function(url, currentMenuNo, formId) {
    	if (url == '' || formId == '') {
    		return;
    	}
    	
    	var form = $("#" + formId);
    	form.find("#currentMenuNo").val(currentMenuNo);
    	
    	form.attr("method", "POST");
		form.attr("action", url);
		form.submit();
    },
    /**
     * 공통 단일 submit complete 함수
     * useage : Global.completeFunction = doList 설정. submit 이후 실행할 함수를 설정한다. 
     * 실행할 함수가 없을 경우 null로 지정한다.
     */
    commonSave : function(result) {
    	var resultMessage = "처리하였습니다.";
    	
    	if (result == 'insert') {
    		resultMessage = "저장하였습니다.";
    	} else if (result == 'neighborhoodInsert') {
    		resultMessage = "저장하였습니다.\n관리자 검토 후 게시여부가 승인되는 절차입니다.";
    	} else if (result == 'update') {
    		resultMessage = "수정하였습니다.";
    	} else if (result == 'delete') {
    		resultMessage = "삭제하였습니다.";
    	} else if (result == 'failure') {
    		resultMessage = "실패하였습니다. 관리자에게 문의바랍니다.";
    	} else if (result == 'complete') {
    		resultMessage = "처리되었습니다.";
    	} else if (result == 'captcharFail') {
    		resultMessage = "보안문자가 틀립니다 다시 확인하시기 바랍니다.";
    	} else if (result == 'oneMin') {
    		resultMessage = "게시물 작성은 최근 게시물 작성 후 1분 뒤에 가능합니다.";
    	} else if (result == 'eduInsert') {
    		resultMessage = "신청이 완료되었습니다.";
    	} else if (result == 'eduInsert1') {
    		resultMessage = "귀하께서는 예비 순위로 신청되었습니다. 교육 취소 등 결원 상황을 고려하여 교육일 3일전까지 최종 승인 여부를 문자 안내 드리겠습니다. 감사합니다.";
    	} else if (result == 'eduInsert2') {
    		resultMessage = "귀하께서는 예비 순위로 신청되었습니다. 교육 취소 등 결원 상황을 고려하여 교육일 전일 오후 6시까지 최종 승인 여부를 문자 안내 드리겠습니다. 감사합니다.";
		} else if (result == 'joinMember') {
			resultMessage = "회원가입 정보가 등록되었습니다.";
    	} else if (result == 'sessionFailure') {
    		alert("인증 세션정보가 없습니다. 회원가입 화면으로 이동합니다.");
    		location.href = '/usr/login/joinForm.do';
    	}else if (result == 'insertEdu') {
			resultMessage = "저장하였습니다. 타교육신청 시 해당 교육신청을  취소하고 신청할 수 있습니다. ";
    	}
    	
    	var func = Global.completeFunction;
    	$.alert({
    		message : resultMessage,
    		button1 : {
    			callback : function() {
    				if (typeof func === "function" && result != 'captcharFail') {
    	                func.apply(this);
    	            }
    			}
    		}
    	});
    },
    /**
     * 에러 페이지 이동하기(iframe submit)
     * usage : error.jsp 참조
     */
    goError : function(errorCode) {
    	location.href = '/common/error.jsp?param=' + errorCode;
    },
    /**
     * 주어진 form의 checkbox의 check를 toggle 시키기(check -> uncheck, uncheck -> check)
     * usage : UT.toggleCheckbox('formList', 'checkAll', 'checkkeys', '1')
     * index 값을 주면 해당 index 만 처리된다.
     */
    toggleCheckbox : function(form, checkElement, checkboxName, index) {
		var $form = null;
		var $checkElement = null;
		if (typeof form === "string") {
			$form = jQuery("#" + form);
		} else {
			$form = form;
		}
		if (typeof checkElement === "string") {
			$checkElement = jQuery("#" + checkElement);
		} else {
			$checkElement = checkElement;
		}
		
		jQuery(":checkbox[name='" + checkboxName + "']", $form).each(function(i) {
			if (jQuery(this).is(":visible")) {
				if (typeof index === "undefined" || i === index) {
					if (this.disabled == false) {
						if ($checkElement.is(":checked")) {
							this.checked = true;
						} else {
							this.checked = false;
						}
					}
				}
			}
		});
	},
	/**
     * 주어진 form의 input내용을 jsonString으로 변환.
     * usage : UT.formToJsonString('formName')
     * form명이나 폼객체를 주면 된다.
     */
	formToJsonString : function(form) {
		var $form = null;
		if (typeof form === "string") {
			$form = jQuery("#" + form);
		} else {
			$form = form;
		}
		
		var stringData = $form.serializeArray();
		var o = {};
		$.each(stringData, function() {
	        if (o[this.name] !== undefined) {
	            if (!o[this.name].push) {
	                o[this.name] = [o[this.name]];
	            }
	            o[this.name].push(this.value || '');
	        } else {
	            o[this.name] = this.value || '';
	        }
	    });
		
		return JSON.stringify(o);
	},
	/**
     * 주어진 jsonString을 form의 input내용으로 변환.
     * usage : UT.jsonStringToForm('jsonString', 'formName')
     * json구조의 string과 form명을 주면 form에 데이터를 넣는다.
     */
	jsonStringToForm : function(jsonString, form) {
		var $form = null;
		if (typeof form === "string") {
			$form = jQuery("#" + form);
		} else {
			$form = form;
		}
		if (typeof jsonString === 'undefined' || jsonString == null || jsonString == '') {
			return;
		}
		
		var parseData = jQuery.parseJSON(jsonString);
		var parseDataSize = Object.keys(parseData).length;
		if (parseDataSize > 0) {
			for (obj in parseData){
				$form.find("input[name="+ obj + "]").val( (parseData[obj]) ? parseData[obj] : '' );
			}
		}
	},
	/**
     * 달력을 출력한다.
     * usage : UT.datepicker('#startDate', 'options', 'xoptions')
     * 특정 옵션을 추가할 필요가 없다면 그냥 selector만 Id를 지정해 주면 된다. 특수 옵션(yearRange etc)
     */
	datepicker : function(selector, options, xOptions) {
		var xDefaults = {
				language : "ko",	
				readOnly : false, 
				buttonImage : "/images/egovframework/com/cmm/icon/bu_icon_carlendar.gif",
				onClose : null, 
				clearText : {
					ko : "지우기",
					en : "Clear"
				},
				closeText : {
					ko : "닫기",
					en : "Close"
				},
				buttonText : {
					ko : "달력",
					en : "Calendar"
				},
				currentText : {
					ko : "오늘",
					en : "Today"
				},
				dayNamesMin : {
					ko : ["일","월","화","수","목","금","토"],
					en : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
				},
				monthNamesShort : {
					ko : ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"],
					en : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
				}
			};
			xOptions = jQuery.extend(true, xDefaults, xOptions || {});

			var defaults = {
				changeYear : true,
				changeMonth : true,
				showMonthAfterYear : true,
				buttonImageOnly : true,
				showButtonPanel : true,
				constrainInput : true,
				dateFormat : "yy.mm.dd",
				monthNamesShort : xOptions.monthNamesShort[xOptions.language],
				dayNamesMin : xOptions.dayNamesMin[xOptions.language],
				showOn : "both", // focus, button, both
				buttonImage : xOptions.buttonImage,
				buttonText : xOptions.buttonText[xOptions.language],
				currentText : xOptions.currentText[xOptions.language],
				closeText : xOptions.closeText[xOptions.language],
				clearText : xOptions.clearText[xOptions.language]
			};
			options = jQuery.extend(true, defaults, options || {});
			options.gotoCurrent = true;

			var $datepickerback = jQuery("#datepickerback");
			if ($datepickerback.length == 0) {
				$datepickerback = jQuery("<iframe id='datepickerback'></iframe>");
				$datepickerback.appendTo(self.document.body);
				$datepickerback.css({
					"position"     : "absolute",
					"filter"       : "alpha(opacity=0)",
					"-moz-opacity" : "0",
					"opacity"      : "0",
					"border"       : "none"
				});
				$datepickerback.hide();
			}
			var showDatepickerback = function($datepicker) {
				var $widget = $datepicker.datepicker("widget");
				$datepickerback.css({
					"top"    : $widget.css("top"),
					"left"   : $widget.css("left"),
					"height" : $widget.height() + "px",
					"width"  : $widget.width() + "px"
				});
				$datepickerback.show();
			}
			var showClearButton = function($datepicker, text) {
				var $widget = $datepicker.datepicker("widget");
				var $buttonPane = $widget.find( ".ui-datepicker-buttonpane" );
				if ($buttonPane.find(".customClear").length == 0) {
					var $btn = jQuery('<button class="ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all customClear">' + options.clearText  + '</button>');      
					$btn.unbind("click").bind("click", function () {   
							jQuery.datepicker._clearDate($datepicker);
				  		}
					);   
					$btn.appendTo($buttonPane);
				}
			}
			var $datepicker = null;
			var pair = typeof selector === "string" ? selector.split(",") : [];
			if (pair.length > 1) {
				options.beforeShow = function(input, inst) {
					var $this = jQuery(this);
					var index = -1;
					for (var i = 0; i < pair.length; i++) {
						if (("#" + $this.attr("id")) == pair[i].trim()) {
							index = i;
						}
					}
					if (index < 0) {
						return;
					}
					if (index - 1 >= 0) {
						var otherDate = jQuery(pair[index - 1].trim()).val();
						var date = jQuery.datepicker.parseDate(options.dateFormat, otherDate, inst.settings);
						$this.datepicker("option", "minDate", date);
					}
					if (index + 1 < pair.length) {
						var otherDate = jQuery(pair[index + 1].trim()).val();
						var date = jQuery.datepicker.parseDate(options.dateFormat, otherDate, inst.settings);
						$this.datepicker("option", "maxDate", date);
					}
					setTimeout(function() {
						showDatepickerback($this);
						showClearButton($this, options.clearText);
						$(".ui-datepicker-year").focus();
					}, 1);
				}
				
			} else {
				options.beforeShow = function(input, inst) {
					var $this = jQuery(this);
					setTimeout(function() {
						showDatepickerback($this);
						showClearButton($this, options.clearText);
						$(".ui-datepicker-year").focus();
					}, 1);
				}
			}
			options.onChangeMonthYear = function(year, month, inst) {
				var $this = jQuery(this);
				setTimeout(function() {
					showDatepickerback($this);
					showClearButton($this, options.clearText);
				}, 1);
			}
			
			if (typeof xOptions.onClose === "function") {
				options.onClose = function(dateText, inst) {
					xOptions.onClose.call(this, jQuery(inst["input"])[0].name);
					$datepickerback.hide();
					
					if (typeof xOptions.afterLocation !== 'string') {
						jQuery("#" + xOptions.afterLocation).focus();
					}
				};
			} else {
				options.onClose = function(dateText, inst) {
					$datepickerback.hide();
					
					if (typeof xOptions.afterLocation === 'string') {
						jQuery("#" + xOptions.afterLocation).focus();
					}
				};
			}
			
			$datepicker = jQuery(selector).datepicker(options);
			
			if (true == xOptions.readOnly) {
				jQuery(selector).attr("readOnly", true);
			}
			if (options.showOn != "focus") {
				jQuery(".ui-datepicker-trigger").css("cursor", "pointer");
			}
			
			// 포커스 이동
			jQuery(".ui-datepicker-year").focus();
	},
	/**
     * map data 의 값을 targetForm의 elements로 값을 복사 한다.
     * map = {"formElementName1" : "value", "formElementName2" : "value"}
     */
    copyValueMapToForm : function(map, targetForm) {
        if (typeof map === "undefined" || typeof targetForm === "undefined") {
            return;
        }
        if (typeof targetForm === "string") {
            $target = jQuery("#" + targetForm);
        } else {
            $target = targetForm;
        }
        jQuery(":input", $target).each(function () {
            if (typeof map[this.name] !== "undefined" ) {
                var type = this.type.toLowerCase();
                if ((type === "radio" || type === "checkbox") && this.value == map[this.name]) {
                    this.checked = true;
                } else {
                    jQuery(this).val(map[this.name]);
                }
            }
        });
    },
    /**
     * smarteditor 설정
     * @param element
     */
    setEditor : function(element) {
    	nhn.husky.EZCreator.createInIFrame({
			oAppRef: Global.oEditors,
			elPlaceHolder: element,
			sSkinURI: "/js/smarteditor/SmartEditor2Skin.html",	
			htParams : {
				bUseToolbar : true,				// 툴바 사용 여부 (true:사용/ false:사용하지 않음)
				bUseVerticalResizer : true,		// 입력창 크기 조절바 사용 여부 (true:사용/ false:사용하지 않음)
				bUseModeChanger : true,			// 모드 탭(Editor | HTML | TEXT) 사용 여부 (true:사용/ false:사용하지 않음)
				//bSkipXssFilter : true,		// client-side xss filter 무시 여부 (true:사용하지 않음 / 그외:사용)
				//aAdditionalFontList : aAdditionalFontSet,		// 추가 글꼴 목록
				fOnBeforeUnload : function(){
				}
			}, //boolean
			fOnAppLoad : function(){
			},
			fCreator: "createSEditor2"
		});
    	Global.editorElement = element;
    },
    setNamoEditor : function(element, id) {
    	element.params.Width = "100%";
    	element.params.ParentEditor = document.getElementById(id);
    	element.EditorStart();
    },
    /**
     * 시도 셀렉트 박스 옵션 생성
     * @param targetId
     * @param selectedVal
     * @param subTargetId
     * @param subSelectVal
     */
    setSidoCd : function(targetId, selectedVal, subTargetId, subSelectVal) {
    	$.ajax({
			url: "/cmn/returnFarm/infra/organCode/sidoListJson.do",
			type: "POST",
			contentType: 'application/x-www-form-urlencoded; charset=utf-8',
			dataType: 'json',
			success: function(result){
				var rs = result.resultList;
				var html = [];
				if (typeof selectedVal === 'undefined') {
					html.push("<option value='' selected='selected'>시도선택</option>");
					
					for (var i = 0; i < rs.length; i++) {
						html.push("<option value='" + rs[i].sidoCd + "'>" + rs[i].sidoNm + "</option>");
					};
					
					$("#" + targetId).html(html.join(""));
				} else {
					html.push("<option value=''>시도선택</option>")
					
					for (var i = 0; i < rs.length; i++) {
						if (rs[i].sidoCd == selectedVal) {
							html.push("<option value='" + rs[i].sidoCd + "' selected='selected'>" + rs[i].sidoNm + "</option>");
						} else {
							html.push("<option value='" + rs[i].sidoCd + "'>" + rs[i].sidoNm + "</option>");
						}
					};
					
					$("#" + targetId).html(html.join(""));
					//시군구 표시
					if (typeof subTargetId !== 'undefined' && typeof subSelectVal !== 'undefined') {
						UT.setSigunCd(targetId, subTargetId, subSelectVal);
					}
				}
			},
			error:function(msg){
		    }
		});
    },
    /**
     * 시군구 셀렉트 박스 옵션 생성
     * @param element
     * @param targetId
     * 
     */
    setSigunCd: function(elementId, targetId, selectedVal) {
    	var $element = $("#" + elementId);
    	var currentVal = $element.val();
    	
    	var html = [];
		html.push("<option value='' selected='selected'>시군구선택</option>");
    	
    	if (currentVal == '') {
    		$("#" + targetId).html(html.join(""));
    	} else {
    		$.ajax({
				url: "/cmn/returnFarm/infra/organCode/sigunListJson.do",
				type: "POST",
				contentType: 'application/x-www-form-urlencoded; charset=utf-8',
				data: {sidoCd : currentVal},
				dataType: 'json',
				success: function(result){
					var rs = result.resultList;
					
					for (var i = 0; i < rs.length; i++) {
						if(rs[i].sigunNm != "청원군" && rs[i].sigunNm != "상당구" && rs[i].sigunNm != "흥덕구" && rs[i].sigunNm != "-" && rs[i].sigunNm != "진해시" && rs[i].sigunNm != "마산시") {
							html.push("<option value='" + rs[i].sigunCd + "'>" + rs[i].sigunNm + "</option>");
						}
					};
					
					$("#" + targetId).html(html.join(""));
					if (typeof selectedVal !== 'undefined') {
						$("#" + targetId).val(selectedVal);
					}
				},
				error:function(msg){
			    }
			});
    	}
    },
    /**
     * 시도 셀렉트 박스 옵션 생성
     * @param targetId
     * @param selectedVal
     * @param subTargetId
     * @param subSelectVal
     */
    setAplctListAdminSidoCd : function(targetId, selectedVal, subTargetId, subSelectVal) {
    	$.ajax({
			url: "/cmn/returnFarm/infra/organCode/sidoListJson.do",
			type: "POST",
			contentType: 'application/x-www-form-urlencoded; charset=utf-8',
			dataType: 'json',
			success: function(result){
				var rs = result.resultList;
				var html = [];
				if (typeof selectedVal === 'undefined') {
					html.push("<option value='' selected='selected'>시도선택</option>");
					
					for (var i = 0; i < rs.length; i++) {
						html.push("<option value='" + rs[i].sidoCd + "'>" + rs[i].sidoNm + "</option>");
					};
					
					$("#" + targetId).html(html.join(""));
				} else {
					html.push("<option value=''>시도선택</option>")
					
					for (var i = 0; i < rs.length; i++) {
						if (rs[i].sidoCd == selectedVal) {
							html.push("<option value='" + rs[i].sidoCd + "' selected='selected'>" + rs[i].sidoNm + "</option>");
						} else {
							html.push("<option value='" + rs[i].sidoCd + "'>" + rs[i].sidoNm + "</option>");
						}
					};
					
					$("#" + targetId).html(html.join(""));
					//시군구 표시
					if (typeof subTargetId !== 'undefined' && typeof subSelectVal !== 'undefined') {
						UT.setAplctListAdminSigunCd(targetId, subTargetId, subSelectVal);
					}
				}
			},
			error:function(msg){
		    }
		});
    },
    /**
     * 시군구 셀렉트 박스 옵션 생성
     * @param element
     * @param targetId
     * 
     */
    setAplctListAdminSigunCd: function(elementId, targetId, selectedVal) {
    	var $element = $("#" + elementId);
    	var currentVal = $element.val();
    	
    	var html = [];
		html.push("<option value='' selected='selected'>시군구선택</option>");
    	
    	if (currentVal == '') {
    		$("#" + targetId).html(html.join(""));
    	} else {
    		$.ajax({
				url: "/cmn/returnFarm/infra/organCode/sigunListJson.do",
				type: "POST",
				contentType: 'application/x-www-form-urlencoded; charset=utf-8',
				data: {sidoCd : currentVal},
				dataType: 'json',
				success: function(result){
					var rs = result.resultList;
					
					for (var i = 0; i < rs.length; i++) {
						if(rs[i].sigunNm != "청원군" && rs[i].sigunNm != "상당구" && rs[i].sigunNm != "흥덕구" && rs[i].sigunNm != "-" && rs[i].sigunNm != "진해시" && rs[i].sigunNm != "마산시") {
							html.push("<option value='" + rs[i].sigunCd + "'>" + rs[i].sigunNm + "</option>");
						}
					};
					
					$("#" + targetId).html(html.join(""));
					if (typeof selectedVal !== 'undefined') {
						$("#" + targetId).val(selectedVal);
						AutodoSearch();
					}
				},
				error:function(msg){
			    }
			});
    	}
    },
    /**
     * 마을명 셀렉트 박스 옵션 생성
     * @param element
     * @param targetId 
     */
    setTownNm: function(targetId , sidoCd, sigunCd) {
    	var $element = $("#" + targetId);
    	var currentVal = $element.val();
    	
    	var html = [];
    	html.push("<option value='' selected='selected'>마을명선택</option>");
    	
		$.ajax({
			url: "/adm/returnFarm/module/readyReturnfarm/townListJson.do",
			type: "POST",
			contentType: 'application/x-www-form-urlencoded; charset=utf-8',
			data: {sidoCd : sidoCd , sigunCd: sigunCd},
			dataType: 'json',
			success: function(result){
				var rs = result.resultList;
				
				for (var i = 0; i < rs.length; i++) {
					html.push("<option value='" + rs[i].townId + "'>" + rs[i].townNm + "</option>");
				};
				
				$("#" + targetId).html(html.join(""));
			},
			error:function(msg){
		    }
		});
    },
    /**
     * 방이름 셀렉트 박스 옵션 생성
     * @param element
     * @param targetId 
     */
    setRoomNm: function(targetId , townId ) {
    	var $element = $("#" + targetId);
    	var currentVal = $element.val();
    	
    	var html = [];
    	html.push("<option value='' selected='selected'>객실명선택</option>");
    	
		$.ajax({
			url: "/adm/returnFarm/module/readyReturnfarm/RoomListJson.do",
			type: "POST",
			contentType: 'application/x-www-form-urlencoded; charset=utf-8',
			data: {townId : townId },
			dataType: 'json',
			success: function(result){
				var rs = result.resultList;
				
				for (var i = 0; i < rs.length; i++) {
					html.push("<option value='" + rs[i].roomNo + "'>" + rs[i].roomNm + "</option>");
				};
				
				$("#" + targetId).html(html.join(""));
			},
			error:function(msg){
		    }
		});
    	
    },
    /**
     * 	지식인게시판에서 귀농/귀촌 유형의 지식인 리스트 출력
     *  @param extraColumn1
     *  @param targetId
     */
    setIntellectual: function(targetId, extraColumn1) {
    	var $element = $("#" +  targetId);
    	var currentVal = $element.val();
    	
    	var html = [];
    	html.push("<option value='All' selected='selected'>전체</option>");
    	$.ajax({
    		url: "/usr/board/findIntellectual.do",
    		type: "POST",
    		contentType: 'application/x-www-form-urlencoded; charset=utf-8',
    		data: {intellectualYn : extraColumn1},
    		dataType: 'json',
    		success: function(result){
    			var rs = result.resultList;
    			
    			for (var i = 0; i < rs.length; i++) {
    				html.push("<option value='" + rs[i].mber.mberId + "'>" + rs[i].mber.mberNm + "</option>");
    			};
    			
    			$("#" + targetId).html(html.join(""));
    		},
    		error:function(msg){
    		}
    	});
    },
    /**
     * 클래스에 따라 visible 처리
     * @param element
     * @param targetId
     */
    classShow: function(element, className) {
    	var $element = $(element);
    	$("[class^=ETC]").removeClass("on");
    	
    	if (typeof className !== 'undefined') {
    		$("[class^=" + className + "]").hide();
    		$("." + $element.val()).show();
    	}
    },
    /**
     * 팝업창 크기 조절
     * @param element
     */
    getWindowWidth : function(setWidth) {
    	var windowWidth = 0;
    	
    	if ($(window).width() > parseInt(setWidth, 10)) {
			windowWidth = setWidth;
		} else {
			windowWidth = $(window).width();
		}
    	
    	return windowWidth;
    },
    /**
     * sns 연동
     * @param snsType
     */
    goSnsRegist : function(snsType) {
    	var options = {
			top: 0,
			left: 0,
			width: 300,                                                                        
			height: 200,                                                                       
			title: "SNS",
			resizeable: "yes",
			scrollbars: "yes",
			toolbars:"no",
			status:"no",
			menu:"no",
			mode : "center"
		};
	
    	var snsUrl = {
    			twitter: "https://", twitter2: "twitter.com", twitter3 : "/return2farm",
    			facebook: "http://", facebook2: "www.facebook.com", facebook3: "/sharer.php?s=100&p[url]=",
    			me2day: "http://", me2day2: "me2day.net", me2day3: "/posts/new?new_post[body]=",
    			yozm: "http://", yozm2: "yozm.daum.net", yozm3: "/api/popup/post?prefix=" , 
    			kakao: "https://", kakao2: "story.kakao.com", kakao3: "/share?url="
    	};
    	
    	var url = window.location;
    	var sns = snsType;
    	var name = document.title;
    	var link = "";
		var opt = "";
		
		switch ( sns ) {
			case 'twitter'	:
							options.width = 550;
							options.height = 450;
//							url = document.getElementById("twitter").getAttribute("url");
						//	alert(url);
						//	url = encodeURIComponent(url);
						//	alert(url);
							if(options.mode == "center"){ 
						    	options.left = (screen.width - options.width) / 2;
								options.top = (screen.height - options.height) / 2;
							}
							
							if(options.mode == "left"){
								options.left = 0;
							}
							
							if(options.mode == "right"){
								options.left = screen.width;
							}
							
							//link = "/setSns.jsp?url=" + encodeURIComponent (url) + "&text=" + encodeURIComponent ( name );
//							link = "https://twitter.com/return2farm";
							link = snsUrl.twitter + snsUrl.twitter2 + snsUrl.twitter3;
							
//							link = "http://twitter.com/share?url=" + url + "&text=" + encodeURIComponent ( name );
//							link = "http://twitter.com/home?status=" + encodeURIComponent ( name ) + " " + url;
							opt = 'width='+options.width+',height='+options.height+',top='+options.top+',left='+options.left+',resizable='+options.resizeable+',scrollbars='+options.scrollbars;
							opt+= ',toolbars='+options.toolbars+',status='+options.status+',menu='+options.menu;
							break;
			case 'facebook'	:
							options.width = 1000;
							options.height = 550;
							if(options.mode == "center"){ 
						    	options.left = (screen.width - options.width) / 2;
								options.top = (screen.height - options.height) / 2;
							}
							
							if(options.mode == "left"){
								options.left = 0;
							}
							
							if(options.mode == "right"){
								options.left = screen.width;
							}
//							link = "http://www.facebook.com/sharer.php?s=100&p[url]=" +encodeURIComponent(url) + "&p[title]=" + encodeURIComponent ( name );
							link = snsUrl.facebook + snsUrl.facebook2 + snsUrl.facebook3 + encodeURIComponent(url) + "&p[title]=" + encodeURIComponent ( name );
							opt = 'width='+options.width+',height='+options.height+',top='+options.top+',left='+options.left+',resizable='+options.resizeable+',scrollbars='+options.scrollbars;
							opt+= ',toolbars='+options.toolbars+',status='+options.status+',menu='+options.menu;
							break;
			case 'me2day'	:
							options.width = 1000;
							options.height = 500;
							if(options.mode == "center"){ 
						    	options.left = (screen.width - options.width) / 2;
								options.top = (screen.height - options.height) / 2;
							}
							
							if(options.mode == "left"){
								options.left = 0;
							}
							
							if(options.mode == "right"){
								options.left = screen.width;
							}
//							link = "http://me2day.net/posts/new?new_post[body]="+encodeURIComponent('\"'+name+'\"')+":"+url;
							link = snsUrl.me2day + snsUrl.me2day2 + snsUrl.me2day3 + encodeURIComponent('\"'+name+'\"')+":"+url;
							opt = 'width='+options.width+',height='+options.height+',top='+options.top+',left='+options.left+',resizable='+options.resizeable+',scrollbars='+options.scrollbars;
							opt+= ',toolbars='+options.toolbars+',status='+options.status+',menu='+options.menu;
							break;
			case 'yozm'		:
							options.width = 490;
							options.height = 400;
							if(options.mode == "center"){ 
						    	options.left = (screen.width - options.width) / 2;
								options.top = (screen.height - options.height) / 2;
							}
							
							if(options.mode == "left"){
								options.left = 0;
							}
							
							if(options.mode == "right"){
								options.left = screen.width;
							}
//							link = "http://yozm.daum.net/api/popup/post?prefix="+encodeURIComponent('\"'+name+'\"')+":"+url;
							link = snsUrl.yozm + snsUrl.yozm2 + snsUrl.yozm3 + encodeURIComponent('\"'+name+'\"')+":"+url;
							opt = 'width='+options.width+',height='+options.height+',top='+options.top+',left='+options.left+',resizable='+options.resizeable+',scrollbars='+options.scrollbars;
							opt+= ',toolbars='+options.toolbars+',status='+options.status+',menu='+options.menu;
							break; 
			case 'kakao'		:
							options.width = 490;
							options.height = 400;
							if(options.mode == "center"){ 
						    	options.left = (screen.width - options.width) / 2;
								options.top = (screen.height - options.height) / 2;
							}
							
							if(options.mode == "left"){
								options.left = 0;
							}
							
							if(options.mode == "right"){
								options.left = screen.width;
							}
//							link = "https://story.kakao.com/share?url="+url;
							link = snsUrl.kakao + snsUrl.kakao2 + snsUrl.kakao3 + url;
							opt = 'width='+options.width+',height='+options.height+',top='+options.top+',left='+options.left+',resizable='+options.resizeable+',scrollbars='+options.scrollbars;
							opt+= ',toolbars='+options.toolbars+',status='+options.status+',menu='+options.menu;
							break; 
		}
		
		// 팝업 열기
		win = window.open(link, sns, opt);
		if (parseInt(navigator.appVersion) >= 4) { 
			win.focus(); 
		}	
    },
    /**
     * 스크랩 함수
     * @param menuNo
     */
    doScrap: function(menuNo) {
    	var params = "";
    	var search = "";
    	if(location.pathname == '/cmn/returnFarm/locgov/locgovMain.do') {
    		menuNo = "-1";
    		if(currentFunction != "") {
    			search += "?submitFunction=" + currentFunction;
    			if(submitParam != "") {
    				search += "&submitParam=" + submitParam;
    			}
    		}
    	} else if(location.pathname == '/cmn/returnFarm/module/eduAkademy/eduAkademyMain.do') {
    		if(currentTypeCode != "") {
    			search += "?typeCode=" + currentTypeCode;
    			if(currentShowTypeCode != "") {
    				search += "&showTypeCode=" + currentShowTypeCode;
    			}
    		}
    	} else if(location.pathname == '/cmn/returnFarm/module/fmlgIhmSnsc/fmlgIhmSnscDetail.do') {
    		search = "?fmlgIhmSnscId=" + $("#FormDetail").find(":input[name='fmlgIhmSnscId']").val();
    	} else if(location.pathname == '/cmn/returnFarm/module/fmlgCnfnSport/fmlgCnfnSportList.do') {
    		search = "?sidoCd=" + $("#FormSearch").find("[name='sidoCd']").val();
    	}else {
    		search = location.search;
    	}
    	
    	var scrapUrl = location.pathname + search;
    	
    	$.ajax({
    		url: "/usr/returnFarm/mypage/insertMyScrap.do",
    		type: "POST",
    		contentType: 'application/x-www-form-urlencoded; charset=utf-8',
    		data: {
    			"menuNo"   : menuNo,
    			"scrapUrl" : scrapUrl
    		},
    		dataType: 'json',
    		success: function(result){
    			$.alert({
			    	message : result.err_message
			    });
    		},
    		error:function(xhr, status, error){
    	    }
    	});
    },
    /**
     * 페이지 만족도 등록
       */
    doInsertCsnst : function() {
    	var form = $("#FormCsnst");
    	$.ajax({
    		url: "/cmn/returnFarm/insertMenuCsnst.do",
    		type: "POST",
    		contentType: 'application/x-www-form-urlencoded; charset=utf-8',
    		data: form.serialize(),
    		dataType: 'json',
    		success: function(result){
    			if (result.result == 'SUCCESS') {
    				$.alert({message: "만족도 조사에 협조해 주셔서 감사합니다."});
//    				form.hide();
    			}
    		},
    		error:function(msg){
    			
    		}
    	});
    },
    /**
     * 이미지가 존재하지 않을때 처리
     * @param element
     * @param function
     */
    noImageHeaderError : function(obj, callback) {
    	obj.src = '/images/wvtex/infra/noImage.png';
    	if(callback != undefined) {
    		callback(obj);
    	}
    },
    /**
     * 상담 1차 분류
     * 
     * @param targetId
     * @param selectedVal
     * @param subTargetId
     * @param subSelectVal
     */
    setCnsltSeCode : function(targetId, selectedVal, subTargetId, subSelectVal) {
    	$.ajax({
			url: "/adm/returnFarm/module/cstmrCnslt/getCnsltSeCodeAjax.do",
			type: "POST",
			contentType: 'application/x-www-form-urlencoded; charset=utf-8',
			dataType: 'json',
			success: function(result){
				var rs = result.resultList;
				var html = [];
				if (typeof selectedVal === 'undefined') {
					html.push("<option value='' selected='selected'>1차분류</option>")
					
					for (var i = 0; i < rs.length; i++) {
						html.push("<option value='" + rs[i].cstmrCnslt.codeId + "'>" + rs[i].cstmrCnslt.codeIdNm + "</option>");
					};
					
					$("#" + targetId).html(html.join(""));
				} else {
					html.push("<option value=''>1차분류</option>")
					
					for (var i = 0; i < rs.length; i++) {
						if (rs[i].cstmrCnslt.codeId == selectedVal) {
							html.push("<option value='" + rs[i].cstmrCnslt.codeId + "' selected='selected'>" + rs[i].cstmrCnslt.codeIdNm + "</option>");
						} else {
							html.push("<option value='" + rs[i].cstmrCnslt.codeId + "'>" + rs[i].cstmrCnslt.codeIdNm + "</option>");
						}
					};
					
					$("#" + targetId).html(html.join(""));
					//시군구 표시
					if (typeof subTargetId !== 'undefined' && typeof subSelectVal !== 'undefined') {
						UT.setCnsltDetailSeCode(targetId, subTargetId, subSelectVal);
					}
				}
			},
			error:function(msg){
		    }
		});
    },
    /**
     * 상담 2차 분류
     * 
     * @param elementId
     * @param targetId
     * @param selectedVal
     */    
    setCnsltDetailSeCode: function(elementId, targetId, selectedVal) {
    	var $element = $("#" + elementId);
    	var currentVal = $element.val();
    	
    	var html = [];
		html.push("<option value='' selected='selected'>2차분류</option>")
    	
    	if (currentVal == '') {
    		$("#" + targetId).html(html.join(""));
    	} else {
    		$.ajax({
				url: "/adm/returnFarm/module/cstmrCnslt/getCnsltDetailSeCodeAjax.do",
				type: "POST",
				contentType: 'application/x-www-form-urlencoded; charset=utf-8',
				data: {cnsltSeCode : currentVal},
				dataType: 'json',
				success: function(result){
					var rs = result.resultList;
					
					for (var i = 0; i < rs.length; i++) {
						html.push("<option value='" + rs[i].cstmrCnslt.code + "'>" + rs[i].cstmrCnslt.codeNm + "</option>");
					};
					
					$("#" + targetId).html(html.join(""));
					if (typeof selectedVal !== 'undefined') {
						$("#" + targetId).val(selectedVal);
					}
				},
				error:function(msg){
			    }
			});
    	}
    },
	/**
     * 메뉴 이동 함수 - 파라미터 추가시 사용
     * useage : onclick="UT.moveByMenuUrl(url, currentMenuNo, formId, params);"
     * params = 'searchCondition=1,searchCondition2=2'; 형식
     * 
     */
    moveByMenuUrlWithParam : function(url, currentMenuNo, formId, params) {
    	if (url == '' || formId == '') {
    		return;
    	}
    	
    	var form = $("#" + formId);
    	form.find("#currentMenuNo").val(currentMenuNo);
    	
    	if (typeof params !== 'undefined') {
    		var paramArray = params.split(',');
    		
    		for (i = 0; i < paramArray.length; i++) {
    			var inputParam = paramArray[i].split('=');
    			var html = [];
    			
    			html.push("<input type='hidden' name='" + inputParam[0] + "' value='" + inputParam[1] + "' />");
    			form.append(html.join(""));
    		}
    	}
    	
    	form.attr("method", "POST");
		form.attr("action", url);
		form.submit();
    },
};

/**
 * 박람회 댓글 관련 기능
 */
var EXHB = {
	/**
	 * 댓글 목록 - ajax
	 */
	getList : function(exhbId, sidoCd, sigunCd, target, type) {
		var url = "/adm/returnfarm/module/exhbComment/exhbCommentList.do";
		
		if (typeof type !== 'undefined' && type == 'usr') {
			url = "/cmn/returnfarm/module/exhbComment/exhbCommentList.do";
		}
		
		$.ajax({
			url: url,
			type: "POST",
			data: {exhbId: exhbId, sidoCd: sidoCd, sigunCd: sigunCd, target: target},
			contentType: 'application/x-www-form-urlencoded; charset=utf-8',
			dataType: 'html',
			success: function(result){
				$("#" + target).html(result);
			},
			error:function(msg){
				$.alert({message: "관리자에게 문의 바랍니다."});
		    }
		});
	},
	/**
	 * 댓글 등록 - ajax
	 */
	doInsert : function(element, form, target, closeTag, type) {
		var form = $("#" + form);
		var $element = jQuery(element);
		var answer;
		
		if (typeof closeTag === 'undefined') {
			answer = $element.closest("tr").find("textArea[name='answer']").val();
		} else {
			answer = $element.closest(closeTag).find("textArea[name='answer']").val();
		}
		
		if (answer == null || answer == '') {
			$.alert({message: "댓글 내용을 입력하시기 바랍니다."});
			return false;
		}
		
		if (answer.getBytes() > 1000) {
			$.alert({message: "댓글 내용이 너무 깁니다."});
			return false;
		}
		
		form.find("input[name='answer']").val(answer);
		
		var exhbId = form.find("input[name='exhbId']").val();
		var sidoCd = form.find("input[name='sidoCd']").val();
		var sigunCd = form.find("input[name='sigunCd']").val();
		
		$.confirm({
			message : "저장하시겠습니까?",
			button1 : {
				callback : function() {
					$.ajax({
						url: "/cmn/returnfarm/module/exhbComment/insertExhbComment.do",
						type: "POST",
						data: form.serialize(),
						contentType: 'application/x-www-form-urlencoded; charset=utf-8',
						dataType: 'json',
						success: function(result){
							if (result.code == 'SUCCESS') {
								$.alert({
									message: "저장되었습니다.", 
									button1 : {
										callback : function() {
											if (typeof type !== 'undefined') {
												EXHB.getList(exhbId, sidoCd, sigunCd, target, type);
											} else {
												EXHB.getList(exhbId, sidoCd, sigunCd, target);
											}
										}
									}
								});
							}
						},
						error:function(msg){
							$.alert({message: "관리자에게 문의하시기 바랍니다."});
					    }
					});
				}
			},
			button2 : {
				callback : function() {
					return false;
				}
			}
		});
	},
	/**
	 * 댓글 수정 - ajax
	 */
	doUpdate : function(element, form, target, closeTag, type) {
		var form = $("#" + form);
		var $element = jQuery(element);
		var answer;
		var answerNo;
		
		if (typeof closeTag === 'undefined') {
			answer = $element.closest("tr").find("textArea[name='answer']").val();
			answerNo = $element.closest("tr").find("input[name='answerNo']").val();
		} else {
			answer = $element.closest(closeTag).find("textArea[name='answer']").val();
			answerNo = $element.closest(closeTag).find("input[name='answerNo']").val();
		}
		
		if (answer == null || answer == '') {
			$.alert({message: "댓글 내용을 입력하시기 바랍니다."});
			return false;
		}
		
		if (answer.getBytes() > 1000) {
			$.alert({message: "댓글 내용이 너무 깁니다."});
			return false;
		}
		
		form.find("input[name='answer']").val(answer);
		form.find("input[name='answerNo']").val(answerNo);
		
		var exhbId = form.find("input[name='exhbId']").val();
		var sidoCd = form.find("input[name='sidoCd']").val();
		var sigunCd = form.find("input[name='sigunCd']").val();
		
		$.confirm({
			message : "수정하시겠습니까?",
			button1 : {
				callback : function() {
					$.ajax({
						url: "/cmn/returnfarm/module/exhbComment/updateExhbComment.do",
						type: "POST",
						data: form.serialize(),
						contentType: 'application/x-www-form-urlencoded; charset=utf-8',
						dataType: 'json',
						success: function(result){
							if (result.code == 'SUCCESS') {
								$.alert({
									message: "수정되었습니다.", 
									button1 : {
										callback : function() {
											if (typeof type !== 'undefined') {
												EXHB.getList(exhbId, sidoCd, sigunCd, target, type);
											} else {
												EXHB.getList(exhbId, sidoCd, sigunCd, target);
											}
										}
									}
								});
							}
						},
						error:function(msg){
							$.alert({message: "관리자에게 문의하시기 바랍니다."});
					    }
					});
				}
			},
			button2 : {
				callback : function() {
					return false;
				}
			}
		});
	},
	/**
	 * 댓글 삭제 - ajax
	 */
	doDelete : function(element, form, target, answerNo, type) {
		var form = $("#" + form);
		var $element = jQuery(element);
		
		form.find("input[name='answerNo']").val(answerNo);
		
		var exhbId = form.find("input[name='exhbId']").val();
		var sidoCd = form.find("input[name='sidoCd']").val();
		var sigunCd = form.find("input[name='sigunCd']").val();
		
		$.confirm({
			message : "삭제하시겠습니까?",
			button1 : {
				callback : function() {
					$.ajax({
						url: "/cmn/returnfarm/module/exhbComment/deleteExhbComment.do",
						type: "POST",
						data: form.serialize(),
						contentType: 'application/x-www-form-urlencoded; charset=utf-8',
						dataType: 'json',
						success: function(result){
							if (result.code == 'SUCCESS') {
								$.alert({
									message: "삭제되었습니다.", 
									button1 : {
										callback : function() {
											if (typeof type !== 'undefined') {
												EXHB.getList(exhbId, sidoCd, sigunCd, target, type);
											} else {
												EXHB.getList(exhbId, sidoCd, sigunCd, target);
											}
										}
									}
								});
							}
						},
						error:function(msg){
							$.alert({message: "관리자에게 문의하시기 바랍니다."});
					    }
					});
				}
			},
			button2 : {
				callback : function() {
					return false;
				}
			}
		});
	},
	/**
	 * 댓글의 답변 등록 - ajax
	 */
	doInsertReply : function(element, form, target, closeTag, type) {
		var form = $("#" + form);
		var $element = jQuery(element);
		var answer;
		var parntscttNo;
		
		if (typeof closeTag === 'undefined') {
			answer = $element.closest("tr").find("textArea[name='answer']").val();
			parntscttNo = $element.closest("tr").find("input[name='parntscttNo']").val();
		} else {
			answer = $element.closest(closeTag).find("textArea[name='answer']").val();
			parntscttNo = $element.closest(closeTag).find("input[name='parntscttNo']").val();
		}
		
		if (answer == null || answer == '') {
			$.alert({message: "댓글 내용을 입력하시기 바랍니다."});
			return false;
		}
		
		if (answer.getBytes() > 1000) {
			$.alert({message: "댓글 내용이 너무 깁니다."});
			return false;
		}
		
		form.find("input[name='answer']").val(answer);
		form.find("input[name='parntscttNo']").val(parntscttNo);
		
		var exhbId = form.find("input[name='exhbId']").val();
		var sidoCd = form.find("input[name='sidoCd']").val();
		var sigunCd = form.find("input[name='sigunCd']").val();
		
		$.confirm({
			message : "저장하시겠습니까?",
			button1 : {
				callback : function() {
					$.ajax({
						url: "/cmn/returnfarm/module/exhbComment/insertExhbComment.do",
						type: "POST",
						data: form.serialize(),
						contentType: 'application/x-www-form-urlencoded; charset=utf-8',
						dataType: 'json',
						success: function(result){
							if (result.code == 'SUCCESS') {
								$.alert({
									message: "저장되었습니다.", 
									button1 : {
										callback : function() {
											if (typeof type !== 'undefined') {
												EXHB.getList(exhbId, sidoCd, sigunCd, target, type);
											} else {
												EXHB.getList(exhbId, sidoCd, sigunCd, target);
											}
										}
									}
								});
							}
						},
						error:function(msg){
							$.alert({message: "관리자에게 문의하시기 바랍니다."});
					    }
					});
				}
			},
			button2 : {
				callback : function() {
					return false;
				}
			}
		});
	},
	/**
	 * 댓글 내용 길이 표시
	 */
	cehckLength : function(element) {
		var cmtValue = jQuery(element).val();
		var length = 0;
		var currentLength = cmtValue.length;
		
		for (var i=0; i < currentLength; i++) {
			var ch = escape(cmtValue.charAt(i));
			
			if (ch.length == 1) {
				length++;
			} else if (ch.indexOf("%u")!= -1) {
				length += 2;
			} else if (ch.indexOf("%")!= -1) {
				length += ch.length/3;
			}
		}
		
		jQuery(element).closest("tr").find(".showLength").text(length + '/1000byte');
		if (length > 1000) {
			EXHB.cutLength(element, cmtValue);
		}
	},
	/**
	 * 댓글 내용 길이 표시
	 */
	cehckLengthUser : function(element, target) {
		var cmtValue = jQuery(element).val();
		var length = 0;
		var currentLength = cmtValue.length;
		
		for (var i=0; i < currentLength; i++) {
			var ch = escape(cmtValue.charAt(i));
			
			if (ch.length == 1) {
				length++;
			} else if (ch.indexOf("%u")!= -1) {
				length += 2;
			} else if (ch.indexOf("%")!= -1) {
				length += ch.length/3;
			}
		}
		
		jQuery(element).closest(target).find(".showLength").text(length + '/1000byte');
		if (length > 1000) {
			EXHB.cutLength(element, cmtValue);
		}
	},
	/**
	 * 댓글 데이터 조정
	 */
	cutLength : function(element, cmtVal) {
		var cmtValue = cmtVal;
		var length = 0;
		var currentLength = cmtValue.length;
		var minusVal = 0;
		
		for (var i=0; i < currentLength; i++) {
			var ch = escape(cmtValue.charAt(i));
			
			if (ch.length == 1) {
				length++;
				minusVal = 1;
			} else if (ch.indexOf("%u")!= -1) {
				length += 2;
				minusVal = 2;
			} else if (ch.indexOf("%")!= -1) {
				length += ch.length/3;
				minusVal = ch.length/3;
			}
			
			if (length > 1000) {
				jQuery(element).closest("tr").find(".showLength").text((length - minusVal) + '/1000byte');
				jQuery(element).val(cmtValue.substring(0,i));
				return false;
			}
		}
	},
	/**
	 * 수정화면 노출
	 */
	showUpdate : function(element) {
		var checkTr = $("#" + element);
		
		checkTr.find(".showInput").hide();
		checkTr.find(".hideInput").show();
	},
	/**
	 * 수정화면 닫기
	 */
	doClose : function(element) {
		var checkTr = $("#" + element);
		
		checkTr.find(".hideInput").hide();
		checkTr.find(".showInput").show();
	},
	/**
	 * 댓글 화면 노출
	 */
	openReply : function(element) {
		var checkTr = $("#" + element);
		checkTr.show();
	}, 
	/**
	 * 댓글 화면 닫기
	 */
	closeReply : function(element) {
		var checkTr = $("#" + element);
		checkTr.hide();
	},
	/**
	 * 로그인 페이지 이동
	 */
	moveLoginPage : function() {
		var locationVal = window.location;
		var url = "/usr/login/loginForm.do?ref_url_v=" + locationVal;
		UT.moveByMenuUrl(url,'2020100', 'defaultMenuForm');
	}
}