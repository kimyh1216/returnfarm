/**
 * jquery.wvtex.js
 * author : giant194@gmail.com
 * created : 2016.06.30
 * 화면 공통 스크립트를 작성한다.
 */

/**
 * 공통
 */
var Global = {
	classicDialog : false,
	oEditors: [],
	nEditor : null,
	nEditors: [],
	editorElement: null,
	loadingbar : {
		show : true,
		styleClass : "loading",
		loader : null,
		icon : null
	},
	parameters : "", // 공통파라미터
	runningAction : null,
	completeFunction : null,
	layer : null,
	validator : null,
	dialog : {
		confirm : {
			title : "확인",
			button1 : {
				name : "확인"
			},
			button2 : {
				name : "취소"
			},
			width : 300
		},
		alert : {
			title : "알림",
			button1 : {
				name : "확인"
			},
			width : 300
		},
		info : {
			title : "알림",
			width : 300
		}
	},
	apikey : "eab662ee898604175d477c8e9bcea3ff"
};

/**
 * dialog
 */
(function($) {
	if (typeof $.fn.dialog === "function") {
		var publics = {
			getTopWindow : function() {
				var topWindow = self;
				while(topWindow.parent && topWindow.parent != topWindow) {
					try {
						if (topWindow.parent.document.domain != document.domain) {
							break;
						}
						if (topWindow.parent.document.getElementsByTagName("frameset").length > 0 ) {
							break;
						}
					} catch(e) {
						break;
					}
					topWindow = topWindow.parent;
				}
				return topWindow;
			},
			appendBgiframe : function($, win) {
		        var $bgiframe = $("<iframe></iframe>").appendTo(win.document.body);
		        $bgiframe.css({
		            "position"          : "fixed"
		            ,"z-index"          : 999
		            ,"top"              : "0px"
		            ,"left"             : "0px"
		            ,"height"           : "100%"
		            ,"width"            : "100%"
		            ,"filter"           : "alpha(opacity=0)"
		            ,"-moz-opacity"     : "0"
		            ,"opacity"          : "0"
		            ,"border"           : "none"
		        });

		        return $bgiframe;
			},
			html : function(param) {
		        var html = "<div id='" + param.id + "' title='" + param.title + "'>";
		        html += "<p id='message-" + param.id + "' ";
		        if (param.textStyleClass != "") {
		        	html += " class='" + param.textStyleClass + "' ";
		        }
				
				if(!(typeof param.textArea == "undefined" || param.textArea == "" || param.textArea == null)) {
		        	html += " style='width:90%;'>" + param.message + "</p>";
					html += "<textArea name='" + param.textArea +"' id='" + param.textArea + "'  style='box-sizing:border-box; width:100%; height: " + (parseInt(param.height) - 160) + "px;'></textArea>";	
				} else {
					html += " style='position:absolute;top:50%;width:90%;'>" + param.message + "</p>";
				}
		        html += "</div>";
				
		        return html;
			},
			ieObject : [],
			visibleIeObject : function(style) {
		        if ($.browser.msie == true || (/Trident\/7\./).test(navigator.userAgent)) { // ie11 일경우 포함.
		        	if (style == "visible") {
		        		for (var index = 0; index < publics.ieObject.length; index++) {
		        			publics.ieObject[index].css("visibility", style);
		        		}
		        		publics.ieObject = [];
		        	} else if (style == "hidden") {
			        	$("object").each(function() {
		        			var $obj = $(this);
		        			if ($obj.is(":visible")) {
			        			$obj.css("visibility", style);
			        			publics.ieObject.push($obj);
		        			}
			        	});
						$("iframe").each(function() {
							try {
								var $iframeBody = $(this.contentWindow.document.body);
								$iframeBody.find("object,iframe").each(function() {
				        			var $obj = $(this);
				        			if ($obj.is(":visible")) {
					        			$obj.css("visibility", style);
					        			publics.ieObject.push($obj);
				        			}
				        		});
							} catch (e) {
								// iframe src가 타 사이트일경우 access가 안된다.
								var $obj = $(this);
			        			if ($obj.is(":visible")) {
				        			$obj.css("visibility", style);
				        			publics.ieObject.push($obj);
			        			}
							}
						});
		        	}
		        }
			},
			adjust : function($dialog) {
				$dialog.find(".ui-dialog-content").each(function(){
		        	var $this = $(this);
		        	var $p = $this.find(":first");
		        	if ($p.height() > $this.height()) {
		        		$this.css({"position":"relative", "overflow":"hidden", "height": $p.height() + 5});
		        	} else {
		        		$this.css({"position":"relative", "overflow":"hidden"});
		        	}
		        	$p.css({"width" : ($this.width() - (parseInt($p.css("padding-left"), 10))) + "px"})
		        	var h = $p.height() + parseInt($p.css("padding-top"), 10) + parseInt($p.css("padding-bottom"), 10);
		        	$p.css({"marginTop" : "-" + parseInt(h/2, 10) + "px"});
		        });
			},
			addCustomStyleClass : function($uiDialog) {  // $uiDialog : dialog 제일 외곽의 .ui-dialog 가 있는 div
				if ($.browser.msie == true && parseInt($.browser.version, 10) == 9) {
					$uiDialog.css("overflow", "visible");    // ie9에서 object 가 안보이는 문제 해결
				}
	        	$uiDialog.addClass("ui-dialog-custom");
			}
		};
		$.confirm = function(options) {
			var defaults = {
				title : Global.dialog.confirm.title,
				message : "",
				width : 300,
				height : "auto",
                resizable : false,
                draggable : true,
                modal : true,
                closeOnEscape : true,
                textStyleClass : "ui-custom-confirm-text",
                button1 : {name : Global.dialog.confirm.button1.name, callback : null},
                button2 : {name : Global.dialog.confirm.button2.name, callback : null},
                id : (new Date()).getTime(),
				backgroundOpacity : 0.3,
				textArea : ""
			};
			
			var topWin = publics.getTopWindow();
			var $ = topWin.$;
			
			options = $.extend(true, defaults, options);
			
			//var $bgiframe = publics.appendBgiframe($, topWin);
			$(publics.html(options)).appendTo(topWin.document.body);

	        var buttons = {};
	        buttons[options.button1.name] = function() {   // OK
				if (typeof options.button1.callback === "function") {
					if(!(typeof options.textArea == "undefined" || options.textArea == "" || options.textArea == null)) {
						options.button1.callback.call($("#"+options.textArea).val());
						if($("#"+options.textArea).val().length > 0 ) {
							$(this).dialog("close");
						}
					} else {
						options.button1.callback.call();
						$(this).dialog("close");
					} 
	            }  
	        };
	        buttons[options.button2.name] = function() {   // Cancel
	            $(this).dialog("close");
	            if (typeof options.button2.callback === "function") {
	                options.button2.callback.call(); 
	            }
	        };
			
			// Dialog            
	        var $dialog = $("#" + options.id).dialog({
	            autoOpen  : true,
	            resizable : options.resizable,
	            draggable : options.draggable,
	            width     : options.width,
	            height    : options.height,
	            modal     : options.modal,
	            buttons   : buttons,
	            closeOnEscape : options.closeOnEscape,
	            close     : function(event, ui) {
	            	//$bgiframe.remove();
	            	publics.visibleIeObject("visible");
	                if (event.which == 0 || event.which == 27) {  // X icon, esc Key 일 경우 Cancel 과 같게.
	                    if (typeof options.button2.callback === "function") {
	                        options.button2.callback.call(); 
	                    }
	                }
	                $("#" + options.id).remove();
	                $(this).dialog("widget").empty().remove();
	                $(this).dialog("destroy");
	            },
	            open: function(event, ui) {
	            	var $uiDialog = $(this).closest(".ui-dialog");
	            	publics.addCustomStyleClass($uiDialog);
	            	publics.visibleIeObject("hidden");
	            	publics.adjust($uiDialog);
        			$(".ui-widget-overlay").css({
        				"filter" : "Alpha(Opacity=" + (options.backgroundOpacity * 100) + ")",
        				"opacity" : options.backgroundOpacity
        			});
	            } 
	        });
			
			if(!(typeof options.textArea == "undefined" || options.textArea == "" || options.textArea == null)) {
				$dialog.find("#message-" + options.id).css('margin-top', '0px');
			}  

	        return $dialog;
		};
		$.alert = function(options) {
			var defaults = {
				title : Global.dialog.alert.title,
				message : "",
				width : 300,
				height : "auto",
                resizable : false,
                draggable : true,
                modal : true,
                closeOnEscape : true,
                textStyleClass : "ui-custom-alert-text",
                button1 : {name : Global.dialog.alert.button1.name, callback : null},
                id : (new Date()).getTime(),
				backgroundOpacity : 0.3 
			};
			
			var topWin = publics.getTopWindow();
			var $ = topWin.$;
			
			options = $.extend(true, defaults, options);
			
			//var $bgiframe = publics.appendBgiframe($, topWin);
			$(publics.html(options)).appendTo(topWin.document.body);

	        var buttons = {};
	        buttons[options.button1.name] = function() {   // OK
	            $(this).dialog("close");
	        };
			
			// Dialog            
	        var $dialog = $("#" + options.id).dialog({
	            autoOpen  : true,
	            resizable : options.resizable,
	            draggable : options.draggable,
	            width     : options.width,
	            height    : options.height,
	            modal     : options.modal,
	            buttons   : buttons,
	            closeOnEscape : options.closeOnEscape,
	            close     : function(event, ui) {
	            	//$bgiframe.remove();
	            	publics.visibleIeObject("visible");
                    if (typeof options.button1.callback === "function") {
                        options.button1.callback.call(); 
                    }
                    $("#" + options.id).remove();
                    $(this).dialog("widget").empty().remove();
	                $(this).dialog("destroy");
	            },
	            open: function(event, ui) {
	            	var $uiDialog = $(this).closest(".ui-dialog");
	            	publics.addCustomStyleClass($uiDialog);
	            	publics.visibleIeObject("hidden");
	            	publics.adjust($uiDialog);
        			$(".ui-widget-overlay").css({
        				"filter" : "Alpha(Opacity=" + (options.backgroundOpacity * 100) + ")",
        				"opacity" : options.backgroundOpacity
        			});
	            } 
	        });
	        return $dialog;
		};
		$.info = function(options) {
			var defaults = {
				title : Global.dialog.info.title,
				message : "",
				width : 300,
				height : "auto",
				resizable : false,
				draggable : true,
				modal : true,
				closeOnEscape : false,
				textStyleClass : "ui-custom-info-text",
				autoOpen : true,
				sizeAdjust : true,
				id : (new Date()).getTime(),
				backgroundOpacity : 0.3 
			};
			
			var topWin = publics.getTopWindow();
			var $ = topWin.$;
			
			options = $.extend(true, defaults, options);
			
			//var $bgiframe = publics.appendBgiframe($, topWin);
			$(publics.html(options)).appendTo(topWin.document.body);
			
			// Dialog            
			var $dialog = $("#" + options.id).dialog({
				autoOpen  : options.autoOpen,
				resizable : options.resizable,
				draggable : options.draggable,
				width     : options.width,
				height    : options.height,
				modal     : options.modal,
				closeOnEscape : options.closeOnEscape,
				close     : function(event, ui) {
					//$bgiframe.remove();
					publics.visibleIeObject("visible");
					$("#" + options.id).remove();
					$(this).dialog("widget").empty().remove();
					$(this).dialog("destroy");
				},
	            open: function(event, ui) { 
	            	var $uiDialog = $(this).closest(".ui-dialog");
	            	publics.addCustomStyleClass($uiDialog);
	            	$uiDialog.find(".ui-dialog-titlebar-close").hide();
	            	publics.visibleIeObject("hidden");
	            	if (options.sizeAdjust == true) {
	            		publics.adjust($uiDialog);
	            	}
        			$(".ui-widget-overlay").css({
        				"filter" : "Alpha(Opacity=" + (options.backgroundOpacity * 100) + ")",
        				"opacity" : options.backgroundOpacity
        			});
	            	
	            } 
			});
			
			return $dialog;
		};
		$.layer = function(options) {
			var defaults = {
				title : "",
				message : "",
				width : 700,
				height : 700,
				resizable : false,
				draggable : true,
				modal : true,
				id : (new Date()).getTime(),
				callback : null,
				callbackArrayParam : null,
				titlebarClose : "show",
				titlebarHide : false,
				backgroundOpacity : 0.3,
				url : ""
			};
			
			var topWin = publics.getTopWindow();
			var $ = topWin.$;
			
			options = $.extend(true, defaults, options);
			
			//var $bgiframe = publics.appendBgiframe($, topWin);
			var iframe = options.id + "-iframe";
	        var html = [];
	        html.push("<div id='" + options.id + "' title='" + options.title + "'>");
//	        html.push("<p style='position:absolute;top:0px;left:0px;width:100%;height:100%;overflow-y:hidden;'>");
	        html.push("<iframe name='" + iframe + "' id='" + iframe + "' frameborder='0' tabIndex='-1' style='width:" + (options.width - 13) + "px;height:100%;'");
	        if ("yes" == options.scrolling) {
	        	html.push("scrolling='yes'");
	        } else {
	        	html.push("scrolling='no'");
	        }
	        if (typeof options.url === 'string') {
	        	html.push("src=" + options.url);
	        }
	        html.push("></iframe>");
//	        html.push("</p></div>");
	        html.push("</div>");
			$(html.join(" ")).appendTo(topWin.document.body);
			
			// Dialog            
			var $dialog = $("#" + options.id).dialog({
				autoOpen  : true,
				resizable : options.resizable,
				draggable : options.draggable,
				width     : options.width,
				height    : options.height,
				modal     : options.modal,
				closeOnEscape : false,
				position : typeof options.position === "object" ? options.position : "", 
				close     : function(event, ui) {
					//$bgiframe.remove();
					publics.visibleIeObject("visible");
                    if (typeof options.callback === "function") {
                        options.callback.apply(null, [].concat($(this).dialog("option", "callbackArrayParam"))); 
                    }
                    $("#" + iframe).attr("src", "about:blank").remove();
                    $("#" + options.id).remove();
                    $(this).dialog("widget").empty().remove();
                    $(this).dialog("destroy");
				},
	            open: function(event, ui) { 
	            	$("#" + options.id).css('overflow','hidden');
	            	var $uiDialog = $(this).closest(".ui-dialog");
	            	publics.addCustomStyleClass($uiDialog);

	            	publics.visibleIeObject("hidden");
	            	var layerFrame = null;
	            	for(var x = 0; x < topWin.window.length; x++) {
	            		try {
	            			if (iframe == topWin[x].name) {
		            			layerFrame = topWin[x];
		            		}
						} catch (e) {  
							// iframe src가 타 사이트일경우 access가 안된다.
						}
	            	}
	            	if (options.titlebarHide == true) {
	            		$uiDialog.find(".ui-dialog-titlebar").remove();
	            	}
	            	if (options.titlebarClose == "hide") {
	            		$uiDialog.find(".ui-dialog-titlebar-close").hide();
	            	}
	            	$uiDialog.find(".ui-dialog-content").each(function(){
	            		$uiDialog.css({padding : "0px"});
					});
        			$(".ui-widget-overlay").css({
        				"filter" : "Alpha(Opacity=" + (options.backgroundOpacity * 100) + ")",
        				"opacity" : options.backgroundOpacity
        			});
	            	$uiDialog.find("iframe").focus();
	            	
	    			$("#" + iframe).bind("load", function(event) {
	    				if (typeof layerFrame.$layer === "undefined") {
	    					// alert("undefined variable '$layer' on layer.");
	    				} else {
	    					/* iframe 내에 $layer 변수에 $dialog를 기억시킨다. 
	    					 * $layer.dialog("close"); 를 하거나,
	    					 * $layer.dialog("option").parent 를 이용하여 parent와 소통한다.
	    					 */
	    					layerFrame.$layer = $dialog;    
	    				}
	    				if (layerFrame != null && jQuery.browser.msie) { // ie에서 플레시가 있을경우 레이어 닫힐 때 에러 나는 문제 해결.
	    					jQuery(layerFrame).unload(function() {
	    						jQuery(this.document.body).find("object").parent().empty(); 
	    					});
	    				}
	    			});

	    			var hWin = jQuery(topWin).height();
	    			var hDia = $uiDialog.height();
	            	if (hWin > hDia && typeof options.position !== "object") {
	            		$uiDialog.css({
	            			position : "fixed",
	            			top : ((hWin - hDia) / 2) + "px"
	            		});
	            	}
	            	// url이 객체면 오픈하면서 실행 시킨다.
	            	if (typeof options.url === 'object') {
            			var submitForm = $("#" + options.url.form);
            			submitForm.attr("method", "POST");
            			submitForm.attr("target", $("#"+iframe).attr("name"));
            			submitForm.attr("action", options.url.action);
            			submitForm.submit();
	            	}
	            },
				parent : self /* dialog를 만들기 위한 옵션이 아니다. iframe에서 parent를 찾기 위하여 넣는다. */
			});
			// 담아 뒀다가 닫는 메소드나 열때 활용한다.
			Global.layer = $dialog;
			return $dialog;
		};
	} else {
		var publics = {
	        getTopWindow : function() {
	            var topWindow = self;
	            while(topWindow.parent && topWindow.parent != topWindow) {
	                try {
	                    if (topWindow.parent.document.domain != document.domain) {
	                        break;
	                    }
	                    if (topWindow.parent.document.getElementsByTagName("frameset").length > 0 ) {
	                        break;
	                    }
	                } catch(e) {
	                    break;
	                }
	                topWindow = topWindow.parent;
	            }
	            return topWindow;
	        },
	        ieObject : [],
	        visibleIeObject : function(style) {
	            var ua = window.navigator.userAgent;
	            if (ua.indexOf("MSIE ") > 0 || ua.indexOf("Trident/") > 0) { // ie11 일경우 포함.
	                if (style == "visible") {
	                    for (var index = 0; index < publics.ieObject.length; index++) {
	                        publics.ieObject[index].css("visibility", style);
	                    }
	                    publics.ieObject = [];
	                } else if (style == "hidden") {
	                    $("object").each(function() {
	                        var $obj = $(this);
	                        if ($obj.is(":visible")) {
	                            $obj.css("visibility", style);
	                            publics.ieObject.push($obj);
	                        }
	                    });
	                    $("iframe").each(function() {
	                        try {
	                            var $iframeBody = $(this.contentWindow.document.body);
	                            $iframeBody.find("object,iframe").each(function() {
	                                var $obj = $(this);
	                                if ($obj.is(":visible")) {
	                                    $obj.css("visibility", style);
	                                    publics.ieObject.push($obj);
	                                }
	                            });
	                        } catch (e) {
	                            // iframe src가 타 사이트일경우 access가 안된다.
	                            var $obj = $(this);
	                            if ($obj.is(":visible")) {
	                                $obj.css("visibility", style);
	                                publics.ieObject.push($obj);
	                            }
	                        }
	                    });
	                }
	            }
	        }
	    };
		$.dialog = function(type, options) {
	        var topWin = publics.getTopWindow();
	        var $ = topWin.$;
	        var kendo = topWin.kendo;
	        var id = (new Date()).getTime();

	        options = options || {};
	        var text = {
	            confirm: {
	                title: "확인", 
	                button1: "확인",
	                button2: "취소"
	            },
	            alert: {
	                title: "알림",
	                button1: "확인"
	            },
	            layer: {
	                title: options.title
	            }
	        };
	        
	        publics.visibleIeObject("hidden"); // ie 일때 object나 iframe을 hidden 시킨다. 레이어가 뒤로 숨는 경우를 방지.
	        
	        var defaults = {
	            title: (text[type].title || " "),
	            modal: true,
	            draggable : true,
	            autoFocus: true,
	            resizable: false,
	            animation: false,
	            width: 300,
	            height: "auto",
	            actions: ["Close"],
	            hideTitlebar: false // custom option 타이틀바 감추기
	        };
	        
	        var template = [];
	        template.push("<div id='" + id + "'>");
	        switch(type) {
	        case "alert":
	            if (typeof options.template === "string" && options.template != "") {
	                template.push(options.template); // 템플릿 제작 : 메시지 영역에 #: message # 과 button 영역에 class='button1' 이 반드시 존재해야 한다. 
	            } else {
	                template.push("<div>#: message #</div>");
	                template.push("<div style='text-align:center; margin-top:10px;'>");
	                template.push("<button type='button' class='k-button button1'>" + text[type].button1 + "</button>");
	                template.push("</div>");
	            }
	            break;
	        case "confirm":
	            if (typeof options.template === "string" && options.template != "") {
	                template.push(options.template); // 템플릿 제작 : 메시지 영역에 #: message # 과 button 영역에 class='button1' 과 class='button2' 가 반드시 존재해야 한다. 
	            } else {
	                template.push("<div>#: message #</div>");
	                template.push("<div style='text-align:center; margin-top:10px;'>");
	                template.push("<button type='button' class='k-button button1'>" + text[type].button1 + "</button>");
	                template.push(" ");
	                template.push("<button type='button' class='k-button button2'>" + text[type].button2 + "</button>");
	                template.push("</div>");
	            }
	            break;
	        case "layer":
	            break;
	        }
	        template.push("</div>");
	        var html = template.join("");
	        $(html).appendTo(topWin.document.body);

	        var dialog = null;
	        if (type == "layer") {
	            dialog = $("#" + id).kendoWindow({
	                visible: false,
	                content: (typeof options.content === "string" ? options.content : "about:blank"),
	                iframe: true
	            }).data("kendoWindow");
	        } else {
	            dialog = $("#" + id).kendoWindow({
	                visible: false,
	                content: {
	                    template: kendo.render(kendo.template(html), [{message: (options.message || "")}])
	                },
	                minHeight: 0,
	                iframe: false
	            }).data("kendoWindow");
	        }
	        
	        dialog.parent = self; // iframe에서 parent를 찾기 위하여 넣는다
	        if (type === "layer") {
	            dialog.$iframe = $("#" + id).find("iframe");
	            dialog.$iframe.attr({
	                name: id + "-iframe",
	                id: id + "-iframe"
	            });
	            var $parent = dialog.$iframe.parent();
	            var $clone = dialog.$iframe.clone();
	            dialog.$iframe.remove();
	            $parent.append($clone);
	            dialog.$iframe = $("#" + id).find("iframe");
	            
	            // url이 객체면 오픈하면서 실행 시킨다.
            	if (typeof options.url === 'object') {
            		var submitForm = $("#" + options.url.form);
            		submitForm.attr("method", "POST");
            		submitForm.attr("target", dialog.$iframe.attr("name"));
            		submitForm.attr("action", options.url.action);
            		submitForm.submit();
            	}
	            
	            dialog.$iframe.each(function() {
	            	var $this = $(this);
	                var iframe = null;
	                for(var x = 0; x < topWin.window.length; x++) {
	                    try {
	                        if (this.name == topWin[x].name) {
	                            iframe = topWin[x];
	                        }
	                    } catch (e) {  
	                        // iframe src가 타 사이트일경우 access가 안된다.
	                    }
	                }
	                $this.load(function(event) {
	                    iframe.$layer = dialog; // iframe 내에 $layer 변수에 dialog를 기억시킨다. $layer.close(); 를 $layer.parent 를 이용하여 parent와 소통한다
	                });
	                $this.unload(function(event) { // ie에서 플레시가 있을경우 레이어 닫힐 때 에러 나는 문제 해결.
	                    jQuery(this.document.body).find("object").parent().empty();
	                });
	            });
	        }
	        
	        defaults.open = function() {
	            if (options.hideTitlebar === true) {
	                $("#" + id).closest(".k-window").find(".k-window-titlebar").hide();
	                $("#" + id).closest(".k-window").css("paddingTop", "0");
	            }
	        };
	        defaults.close = function() {
	            publics.visibleIeObject("visible");
	            dialog.destroy();
	            if (typeof options.callback === "function") {
	                options.callback.call(this); 
	            }
	        };
	        options = $.extend(true, defaults, options);

	        dialog.setOptions(options);
	        $("#" + id).find(".button1").click(function() {
	            dialog.close();
	            if (typeof options.button1 === "object" && typeof options.button1.callback === "function") {
	                options.button1.callback.call(this); 
	            }
	        });
	        $("#" + id).find(".button2").click(function() {
	            dialog.close();
	            if (typeof options.button2 === "object" && typeof options.button2.callback === "function") {
	                options.button2.callback.call(this); 
	            }
	        });
	        dialog.center();
	        dialog.open();
	        
	        return dialog;
	    };
	}
})(jQuery);

/**
 * validate form data
 */
(function($) {
    var Validator = {
        defaults : {
        },
        messages : {
            "eq" : "{_title_}{_postword_} {_value_}으로 {_verb_}",
            "le" : "{_title_}{_postword_} {_value_}보다 작거나 같은 값으로 {_verb_}",
            "ge" : "{_title_}{_postword_} {_value_}보다 크거나 같은 값으로 {_verb_}",
            "lt" : "{_title_}{_postword_} {_value_}보다 작은 값으로 {_verb_}",
            "gt" : "{_title_}{_postword_} {_value_}보다 큰 값으로 {_verb_}",
            "maxlength" : "{_title_}{_postword_} 최대길이[{_value_}자] 이하로 {_verb_}",
            "minlength" : "{_title_}{_postword_} 최소길이[{_value_}자] 이상으로 {_verb_}",
            "fixlength" : "{_title_}{_postword_} 길이[{_value_}자]로 {_verb_}",
            "maxbyte" : "{_title_}{_postword_} 최대[{_value_}bytes] 이하로 {_verb_}",
            "minbyte" : "{_title_}{_postword_} 최소[{_value_}bytes] 이상으로 {_verb_}",
            "!space" : "{_title_}{_postword_} 공백문자를 허용하지 않습니다.", // 
            "!null" : "{_title_}{_postword_} {_verb_}",
            "!tag" : "{_title_}{_postword_} tag를 허용하지 않습니다",
            "!chars" : "{_title_}{_postword_} [{_value_}] 문자를 허용하지 않습니다.",
            "ssn" : "{_title_}{_postword_} 형식이 정확하지 않습니다.",
            "frn" : "{_title_}{_postword_} 형식이 정확하지 않습니다.",
            "email" : "{_title_}{_postword_} 형식이 정확하지 않습니다.",
            "url" : "{_title_}{_postword_} 형식이 정확하지 않습니다.", 
            "ip" : "{_title_}{_postword_} 형식이 정확하지 않습니다.",
            "date" : "{_title_}{_postword_} [{_value_}] 형식이 정확하지 않습니다.",
            "regex" : "{_title_}{_postword_} 형식이 정확하지 않습니다.",
            "!regex" : "{_title_}{_postword_} 형식이 정확하지 않습니다.",
            "alphabet" : "{_title_}{_postword_} 형식이 정확하지 않습니다.",
            "hangul" : "{_title_}{_postword_} 형식이 정확하지 않습니다.",
            "number" : "{_title_}{_postword_} 형식이 정확하지 않습니다.", // 
            "signnumber" : "{_title_}{_postword_} 형식이 정확하지 않습니다.",
            "hypennumber" : "{_title_}{_postword_} 형식이 정확하지 않습니다.",
            "commanumber" : "{_title_}{_postword_} 형식이 정확하지 않습니다.",
            "decimalnumber" : "{_title_}{_postword_} 형식이 정확하지 않습니다."
        },
        verbs : {
            "select" : "선택하십시오.",
            "enter" : "입력하십시오."
        },
        postwords : {
             "!space"        : {word1 : "은", word2 : "는"}
            ,"!null"         : {word1 : "을", word2 : "를"}
            ,"!tag"          : {word1 : "은", word2 : "는"}
            ,"!chars"        : {word1 : "은", word2 : "는"}
            ,"maxlength"     : {word1 : "을", word2 : "를"}
            ,"minlength"     : {word1 : "을", word2 : "를"}
            ,"fixlength"     : {word1 : "을", word2 : "를"}
            ,"maxbyte"       : {word1 : "을", word2 : "를"}
            ,"minbyte"       : {word1 : "을", word2 : "를"}
            ,"eq"            : {word1 : "을", word2 : "를"}
            ,"le"            : {word1 : "을", word2 : "를"}
            ,"ge"            : {word1 : "을", word2 : "를"}
            ,"lt"            : {word1 : "을", word2 : "를"}
            ,"gt"            : {word1 : "을", word2 : "를"}
            ,"ssn"           : {word1 : "의", word2 : "의"}
            ,"frn"           : {word1 : "의", word2 : "의"}
            ,"email"         : {word1 : "의", word2 : "의"}
            ,"url"           : {word1 : "의", word2 : "의"}
            ,"ip"            : {word1 : "의", word2 : "의"}
            ,"date"          : {word1 : "의", word2 : "의"}
            ,"regex"         : {word1 : "의", word2 : "의"}
            ,"!regex"        : {word1 : "의", word2 : "의"}
            ,"alphabet"      : {word1 : "의", word2 : "의"}
            ,"hangul"        : {word1 : "의", word2 : "의"}
            ,"number"        : {word1 : "의", word2 : "의"}
            ,"signnumber"    : {word1 : "의", word2 : "의"}
            ,"hypennumber"   : {word1 : "의", word2 : "의"}
            ,"commanumber"   : {word1 : "의", word2 : "의"}
            ,"decimalnumber" : {word1 : "의", word2 : "의"}
        },
        getMessage : function(checker, title, verb, compareValue) {
            var postword = title.endJongsung() ? Validator.postwords[checker] ? Validator.postwords[checker].word1 : ""
                                               : Validator.postwords[checker] ? Validator.postwords[checker].word2 : "";
            var param = {
                _title_ : title,
                _postword_ : postword,
                _verb_ : Validator.verbs[verb],
                _value_ : compareValue
            };
            return Validator.messages[checker].format(param);
        },
        checker : {
            "eq" : function(elementValue, compareValue) {
                if (typeof compareValue === "number") {
                    return elementValue.length == 0 ? true : Number(elementValue.replace(",", "")) == compareValue ? true : false;
                } else { // string
                    return elementValue.length == 0 ? true : elementValue == compareValue ? true : false;
                }
            },
            "le" : function(elementValue, compareValue) {
                if (typeof compareValue === "number") {
                    return elementValue.length == 0 ? true : Number(elementValue.replace(",", "")) <= compareValue ? true : false; 
                } else { // string
                    return elementValue.length == 0 ? true : elementValue <= compareValue ? true : false;
                }
            },
            "ge" : function(elementValue, compareValue) { 
                if (typeof compareValue === "number") {
                    return elementValue.length == 0 ? true : Number(elementValue.replace(",", "")) >= compareValue ? true : false; 
                } else { // string
                    return elementValue.length == 0 ? true : elementValue >= compareValue ? true : false;
                }
            },
            "lt" : function(elementValue, compareValue) { 
                if (typeof compareValue === "number") {
                    return elementValue.length == 0 ? true : Number(elementValue.replace(",", "")) < compareValue ? true : false; 
                } else { // string
                    return elementValue.length == 0 ? true : elementValue < compareValue ? true : false;
                }
            },
            "gt" : function(elementValue, compareValue) { 
                if (typeof compareValue === "number") {
                    return elementValue.length == 0 ? true : Number(elementValue.replace(",", "")) > compareValue ? true : false; 
                } else { // string
                    return elementValue.length == 0 ? true : elementValue > compareValue ? true : false;
                }
            },            
            "maxlength" : function(elementValue, compareValue) { 
                return elementValue.length == 0 ? true : elementValue.length <= compareValue ? true : false;
            },
            "minlength" : function(elementValue, compareValue) { 
                return elementValue.length == 0 ? true : elementValue.length >= compareValue ? true : false;
            },
            "fixlength" : function(elementValue, compareValue) { 
                return elementValue.length == 0 ? true : elementValue.length == compareValue ? true : false;
            },
            "maxbyte" : function(elementValue, compareValue) { 
                return elementValue.length == 0 ? true : elementValue.getBytes() <= compareValue ? true : false; 
            },
            "minbyte" : function(elementValue, compareValue) { 
                return elementValue.length == 0 ? true : elementValue.getBytes() >= compareValue ? true : false;
            },
            "date" : function(elementValue, compareValue) { 
                if (elementValue.length == 0 || compareValue.length == 0) {
                    return true;
                }
                compareValue = compareValue.toUpperCase();
                var pattern = null;
                var date = null;
                switch(compareValue) {
                    case "YYYY.MM.DD": pattern = /^(\d{4})\.(\d{2})\.(\d{2})$/;    break;
                    case "YYYY-MM-DD": pattern = /^(\d{4})\-(\d{2})\-(\d{2})$/; break;
                    case "YYYY/MM/DD": pattern = /^(\d{4})\/(\d{2})\/(\d{2})$/; break;
                    case "YYYYMMDD"  : pattern = /^(\d{4})(\d{2})(\d{2})$/; break;
                    case "YY.MM.DD"  : pattern = /^(\d{2})\.(\d{2})\.(\d{2})$/;    break;
                    case "YY-MM-DD"  : pattern = /^(\d{2})\-(\d{2})\-(\d{2})$/; break;
                    case "YY/MM/DD"  : pattern = /^(\d{2})\/(\d{2})\/(\d{2})$/; break;
                    case "YYMMDD"    : pattern = /^(\d{2})(\d{2})(\d{2})$/;    break;
                    case "DD.MM.YYYY": pattern = /^(\d{2})\.(\d{2})\.(\d{4})$/;    break;
                    case "DD-MM-YYYY": pattern = /^(\d{2})\-(\d{2})\-(\d{4})$/;    break;
                    case "DD/MM/YYYY": pattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;    break;
                    case "DDMMYYYY"  : pattern = /^(\d{2})(\d{2})(\d{4})$/;    break;
                    case "DD.MM.YY"  : pattern = /^(\d{2})\.(\d{2})\.(\d{2})$/;    break;
                    case "DD-MM-YY"  : pattern = /^(\d{2})\-(\d{2})\-(\d{2})$/;    break;
                    case "DD/MM/YY"  : pattern = /^(\d{2})\/(\d{2})\/(\d{2})$/;    break;
                    case "DDMMYY"    : pattern = /^(\d{2})(\d{2})(\d{2})$/;    break;
                }
                if (pattern == null) {
                    alert("unknown date pattern " + compareValue);
                    return false;
                }
                if (!pattern.test(elementValue)) {
                    return false;
                }
                switch(compareValue) {
                    case "YYYY.MM.DD":
                    case "YYYY-MM-DD":
                    case "YYYY/MM/DD":
                    case "YYYYMMDD":
                        date = new Date(elementValue.replace(pattern, '$2/$3/$1'));
                        return (parseInt(RegExp.$1, 10) == date.getFullYear())
                            && (parseInt(RegExp.$2, 10) == (1+date.getMonth())) 
                            && (parseInt(RegExp.$3, 10) == date.getDate());
                        break;
                    case "YY.MM.DD":
                    case "YY-MM-DD":
                    case "YY/MM/DD":
                    case "YYMMDD":
                        date = new Date(elementValue.replace(pattern, '$2/$3/$1'));
                        return (parseInt(RegExp.$1, 10) == date.getYear())
                            && (parseInt(RegExp.$2, 10) == (1+date.getMonth())) 
                            && (parseInt(RegExp.$3, 10) == date.getDate());
                        break;
                    case "DD.MM.YYYY":
                    case "DD-MM-YYYY":
                    case "DD/MM/YYYY":
                    case "DDMMYYYY":
                        date = new Date(elementValue.replace(pattern, '$2/$1/$3'));
                        return (parseInt(RegExp.$3, 10) == date.getFullYear())
                            && (parseInt(RegExp.$2, 10) == (1+date.getMonth())) 
                            && (parseInt(RegExp.$1, 10) == date.getDate());
                        break;
                    case "DD.MM.YY":
                    case "DD-MM-YY":
                    case "DD/MM/YY":
                    case "DDMMYY":
                        date = new Date(elementValue.replace(pattern, '$2/$1/$3'));
                        return (parseInt(RegExp.$3, 10) == date.getYear())
                            && (parseInt(RegExp.$2, 10) == (1+date.getMonth())) 
                            && (parseInt(RegExp.$1, 10) == date.getDate());
                        break;
                }
                return true;
            },
            "regex" : function(elementValue, compareValue) {
                if (elementValue.length == 0) {
                    return true;
                }
                var pattern = null;
                if (typeof compareValue === "string") {
                    if (compareValue.length == 0) {
                        return true;
                    }
                    pattern = new RegExp(compareValue);
                } else if (typeof compareValue === "object") {
                    pattern = compareValue;
                }
                var result = pattern.test(elementValue) ? true : false;
                return result;
            },
            "!regex" : function(elementValue, compareValue) { 
                if (elementValue.length == 0 || compareValue.length == 0) {
                    return true;
                }
                var pattern = null;
                if (typeof compareValue === "string") {
                    if (compareValue.length == 0) {
                        return true;
                    }
                    pattern = new RegExp(compareValue);
                } else if (typeof compareValue === "object") {
                    pattern = compareValue;
                }
                var result = !pattern.test(elementValue) ? true : false; 
                return result;
            },
            "!chars" : function(elementValue, compareValue) {
                var result = true;
                var chars = compareValue.split("");
                $.each(chars, function(i, c) {
                    result = elementValue.indexOf(c) > -1 ? false : true;
                    if (!result) {
                        return false; // break;
                    }
                });
                return result;
            },
            "!null" : function(elementValue, compareValue) { 
                return compareValue == false || elementValue.length > 0 ? true : false; 
            },
            "!space" : function(elementValue, compareValue) { 
                var pattern = /[ \t\r\n\v\f]/;
                return compareValue == false || !pattern.test(elementValue) ? true : false;
            },
            "!tag" : function(elementValue, compareValue) { 
                var pattern = /<\w+(\s?("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+\s?>/gi;
                return compareValue == false || elementValue.length == 0 || !pattern.test(elementValue) ? true : false; 
            },
            "ssn" : function(elementValue, compareValue) {
                if (compareValue == false || elementValue.length == 0) {
                    return true;
                }
                var result = true;
                var pattern = /^[0-9]{13}$/;
                if (pattern.test(elementValue)) {
                    var sum = 0;
                    var ssnArray = new Array(13);
                    var chkArray = new Array( 2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5 );
                    for ( var y = 0; y < 13; y++ ) {
                        ssnArray[y] = parseInt( elementValue.charAt(y), 10);
                    }
                    for ( var y = 0; y < 12; y++ ) {
                        sum += ssnArray[y] * chkArray[y];
                    }
                    var rs = (11 - (sum % 11)) % 10;
                    if ( rs != ssnArray[12] ) {
                        result = false;
                    }
                } else {
                    result = false;
                }
                return result;
            },
            "frn" : function(elementValue, compareValue) { 
                if (compareValue == false || elementValue.length == 0) {
                    return true;
                }
                var result = true;
                var pattern = /^[0-9]{13}$/;
                if (pattern.test(elementValue)) {
                    var sum = 0;
                    var frnArray = new Array(13);
                    var chkArray = new Array( 2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5 );
                    for ( var y = 0; y < 13; y++ ) {
                        frnArray[y] = parseInt( elementValue.charAt(y), 10 );
                    }
                    for ( var y = 0; y < 12; y++ ) {
                        sum += frnArray[y] * chkArray[y];
                    }
                    if (((frnArray[7] * 10 + frnArray[8]) % 2 != 0)
                        || ((frnArray[11] != 6) && (frnArray[11] != 7) && (frnArray[11] != 8) && (frnArray[11] != 9))) {
                        result = false;
                    } else {
                        sum = 11 - (sum % 11);
                        if (sum >= 10) { 
                            sum -= 10; 
                        }
                        sum += 2;
                        if (sum >= 10) { 
                            sum -= 10; 
                        }
                        if (sum != frnArray[12]) {
                            result = false;
                        }
                    }
                } else {
                    result = false;
                }
                return result;
            },
            "email" : function(elementValue, compareValue) { 
                var pattern = /\w{1,}[@][\w\-]{1,}([.]([\w\-]{1,})){1,3}$/;
                return compareValue == false || elementValue.length == 0 || pattern.test(elementValue) ? true : false; 
            },
            "url" : function(elementValue, compareValue) { 
                var pattern = /^(http|https|ftp|mms):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i;
                return compareValue == false || elementValue.length == 0 || pattern.test(elementValue) ? true : false; 
            },
            "ip" : function(elementValue, compareValue) { 
                var pattern = /(([0-1]?[0-9]{1,2}\.)|(2[0-4][0-9]\.)|(25[0-5]\.)){3}(([0-1]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))/i;
                return compareValue == false || elementValue.length == 0 || pattern.test(elementValue) ? true : false; 
            },            
            "alphabet" : function(elementValue, compareValue) { 
                var pattern = /[^A-Za-z ]/;
                return compareValue == false || elementValue.length == 0 || !pattern.test(elementValue) ? true : false; 
            },
            "Hangul" : function(elementValue, compareValue) { 
                var pattern = /[^ㄱ-힣 ]/;
                return compareValue == false || elementValue.length == 0 || !pattern.test(elementValue) ? true : false; 
            },
            "number" : function(elementValue, compareValue) { 
                var pattern = /[^0-9]/;
                return compareValue == false || elementValue.length == 0 || !pattern.test(elementValue) ? true : false; 
            },
            "signnumber" : function(elementValue, compareValue) { 
                var pattern = /^([+-])?((?:\d*))?$/;
                return compareValue == false || elementValue.length == 0 || pattern.test(elementValue) ? true : false; 
            },
            "hypennumber" : function(elementValue, compareValue) { 
                var pattern = /[^0-9-]/;
                return compareValue == false || elementValue.length == 0 || !pattern.test(elementValue) ? true : false; 
            },
            "commanumber" : function(elementValue, compareValue) { 
                var pattern = /[^,0-9]|^[,]|^(\d{4,})|[,]{1}\d{0,2}$|(\d{4,})$|([,]{1}\d{0,2}[,]{1})/;
                return compareValue == false || elementValue.length == 0 || !pattern.test(elementValue) ? true : false; 
            },
            "decimalnumber" : function(elementValue, compareValue) { 
                var pattern = /[^\.0-9]|^[\.]/;
                return compareValue == false || elementValue.length == 0 || !pattern.test(elementValue) ? true : false; 
            }
        },
        events : {
            maxlength : ["maxlength", "maxbyte", "fixlength"],
            keydown : {
                "alphabet" : {
                    keyCodes : [8, 9, 13, 32, 35, 36, 37, 38, 39, 40, 46], // backspace, tab, enter, space, end, home, ←, ↑, →, ↓, delete, 한영
                    condition : [
                        "((event.keyCode >= 65) && (event.keyCode <= 90))" // 알파벳 
                    ]
                },
                "hangul" : {
                    keyCodes : [8, 9, 13, 32, 35, 36, 37, 38, 39, 40, 46, 229], // backspace, tab, enter, space, end, home, ←, ↑, →, ↓, delete, 한영
                    condition : [
                        "((event.keyCode >= 12592) && (event.keyCode <= 12687))"
                    ]
                },
                "number" : {
                    keyCodes : [8, 9, 13, 35, 36, 37, 38, 39, 40, 46], // backspace, tab, enter, end, home, ←, ↑, →, ↓, delete
                    condition : [
                        "(!event.shiftKey && (event.keyCode >= 48 && event.keyCode <= 57))",
                        "(!event.shiftKey && (event.keyCode >= 96 && event.keyCode <= 105))"
                    ]
                },
                "signnumber" : {
                    keyCodes : [8, 9, 13, 35, 36, 37, 38, 39, 40, 46], // backspace, tab, enter, end, home, ←, ↑, →, ↓, delete
                    condition : [
                        "(!event.shiftKey && (event.keyCode >= 48 && event.keyCode <= 57))", // 0 ~ 9
                        "(!event.shiftKey && (event.keyCode >= 96 && event.keyCode <= 105))", // 키패드 0 ~ 9
                        "(!event.shiftKey && (event.keyCode == 189 || event.keyCode == 107 || event.keyCode == 109))", // -, 키패드 +, 키패드 -
                        "( event.shiftKey && event.keyCode == 187)" // +
                    ]
                },
                "hypennumber" : {
                    keyCodes : [8, 9, 13, 35, 36, 37, 38, 39, 40, 46], // backspace, tab, enter, end, home, ←, ↑, →, ↓, delete
                    condition : [
                                 "(!event.shiftKey && (event.keyCode >= 48 && event.keyCode <= 57))", // 0 ~ 9
                                 "(!event.shiftKey && (event.keyCode >= 96 && event.keyCode <= 105))", // 키패드 0 ~ 9
                                 "(!event.shiftKey && (event.keyCode == 189 || event.keyCode == 109))" // -, 키패드 -
                                 ]
                },
                "commanumber" : {
                    keyCodes : [8, 9, 13, 35, 36, 37, 38, 39, 40, 46], // backspace, tab, enter, end, home, ←, ↑, →, ↓, delete
                    condition : [
                        "(!event.shiftKey && (event.keyCode >= 48 && event.keyCode <= 57))",
                        "(!event.shiftKey && (event.keyCode >= 96 && event.keyCode <= 105))"
                    ]
                },
                "decimalnumber" : {
                    keyCodes : [8, 9, 13, 35, 36, 37, 38, 39, 40, 46], // backspace, tab, enter, end, home, ←, ↑, →, ↓, delete
                    condition : [
                         "(!event.shiftKey && (event.keyCode >= 48 && event.keyCode <= 57))",
                         "(!event.shiftKey && (event.keyCode >= 96 && event.keyCode <= 105))",
                         "(!event.shiftKey && (event.keyCode == 110 || event.keyCode == 190) && ($(event.currentTarget).val().indexOf('.') == -1))" // 키패드 ., .
                    ]
                },
                "ssn" : {
                    keyCodes : [8, 9, 13, 35, 36, 37, 38, 39, 40, 46], // backspace, tab, enter, end, home, ←, ↑, →, ↓, delete
                    condition : [
                        "(!event.shiftKey && (event.keyCode >= 48 && event.keyCode <= 57))",
                        "(!event.shiftKey && (event.keyCode >= 96 && event.keyCode <= 105))"
                    ]
                }
            }
        },
        availKeys : function(event) {
            if ($.inArray(event.keyCode, event.data.keyCodes) > -1) {
                event.returnValue = true;
            } else {
                if (typeof event.data.condition !== "undefined") {
                    if (eval(event.data.condition.join(" || "))) {
                        event.returnValue = true;
                    } else {
                        event.returnValue = false;
                    }
                } else {
                    event.returnValue = false;
                }
            }
            if (event.returnValue == false && event.preventDefault) {
                event.preventDefault();
            }
        }
    };
    var methods = {
        create : function(formId, options) {
            var _validator = function () {
                var property = {
                    title : null,
                    name : null,
                    when : null,
                    message : null,
                    notExistIsNull : false, // !null 을 설정했을 때 해당 element가 존재하지 않을 경우 null 로 간주한다. 
                    data : [
                        "trim", "!null", "!space", "!tag", "number", "signnumber", "hypennumber", "commanumber", "decimalnumber", 
                        "hangul", "alphabet", "ssn", "frn", "email", "ip", "url"
                    ],
                    check : {
                        number : ["eq", "le", "ge", "lt", "gt", "maxlength", "minlength", "fixlength", "maxbyte", "minbyte"],
                        string : ["eq", "le", "ge", "lt", "gt", "date", "regex", "!regex", "!chars"],
                        object : ["eq", "le", "ge", "lt", "gt"]
                    },
                    keyPrevent : true
                };
                var objectProperty = ["name", "title"];
                var publics = {
                    option : {
                    },
                    settings : [],
                    $form : null,
                    formId : "",
                    isValidParameter : function(setting) {
                        if (typeof setting.name === "undefined") {
                            alert("'name' is required.");
                            return false;
                        }
                        if (typeof setting.name !== "string" && $.isArray(setting.name) == false) {
                            alert("name type is invalid. 'string' and 'array' is only available.");
                            return false;
                        }
                        if ($.isArray(setting.name) == true && setting.name.length < 2) {
                            alert("'name' array must be at least two.");
                            return false;
                        }
                        if (typeof setting.title === "undefined" && typeof setting.message === "undefined") {
                            alert("'title' or 'message' must be defined.");
                            return false;
                        }
                        if (typeof setting.data === "undefined" && typeof setting.check === "undefined") {
                            alert("'data' or 'check' must be defined.");
                            return false;
                        }
                        if (typeof setting.data !== "undefined") {
                            if ($.isArray(setting.data) == false) {
                                alert("data type is invalid. 'array of string' is only available.");
                                return false;
                            }
                            for (var index = 0; index < setting.data.length; index++) {
                                if ($.inArray(setting.data[index], property.data) == -1) {
                                    alert("'" + setting.data[index] + "' is not supported.");
                                    return false;
                                }
                            }
                        }
                        if (typeof setting.check !== "undefined") {
                            for (var item in setting.check) {
                                if ($.inArray(item, property.check[typeof setting.check[item]]) == -1) {
                                    alert("'" + item + ":" + typeof setting.check[item] + "' is not supported.");
                                    return false;
                                }
                                if (typeof setting.check[item] === "object") {
                                    for (var index = 0; index < objectProperty.length; index++) {
                                        if (typeof setting.check[item][objectProperty[index]] === "undefined") {
                                            alert("'" + objectProperty[index] + "' is required.");
                                            return false;
                                        }
                                    }
                                }
                            }
                        }
                        for (var item in setting) {
                            if (typeof property[item] === "undefined") {
                                alert("'" + item + "' is not supported.");
                                return false;
                            }
                        }
                        return true;
                    },
                    set : function(setting) {
                        switch (typeof setting) {
                        case "function":
                            this.settings.push(setting);
                            break;
                        case "object":
                            if (this.isValidParameter(setting) == false) {
                                return;
                            }
                            if (setting.keyPrevent !== false) {
                                this.setEvent(setting);
                            }
                            this.settings.push(setting);
                            break;
                        default :
                            alert("parameter is invalid.");
                            break;
                        }
                    },
                    checking : function($elements, elementValue, compareValue, checkItem, setting) {
                        var _super = this;
                        if (typeof setting.data !== "undefined") {
                            if ($.inArray("alphabet", setting.data) == -1 && $.inArray("hangul", setting.data) == -1) {
                                if ($.inArray("number", setting.data) > -1 || $.inArray("decimalnumber", setting.data) > -1
                                || $.inArray("commanumber", setting.data) > -1 || $.inArray("signnumber", setting.data) > -1 
                                || $.inArray("hypennumber", setting.data) > -1) {
                                    if (typeof compareValue === "string") {
                                        compareValue = Number(compareValue.replace(",", ""));
                                    }
                                }
                            }
                        }
                        if (Validator.checker[checkItem](elementValue, compareValue) == false) {
                            var element = $elements.get(0);
                            var message = _super.getMessage(element, checkItem, setting);
                            $.alert({
                                message : message, 
                                button1 : {
                                    callback : function() {
                                        try {
                                            element.focus();
                                        } catch (e) {
                                        }
                                    }
                                }
                            });
                            return false;
                        }
                        return true;
                    },
                    checkingData : function($elements, elementValue, setting) {
                        var _super = this;
                        var patterns = {
                            "alphabet" : "A-Za-z",
                            "number" : "0-9",
                            "hangul" : "ㄱ-힣"
                        };
                        var single = [];
                        var multiple = [];
                        var c = 0;
                        for (var index = 0; index < setting.data.length; index++) {
                            if (typeof patterns[setting.data[index]] !== "undefined") {
                                c++;
                            }
                        }
                        for (var index = 0; index < setting.data.length; index++) {
                            if (c < 2 || typeof patterns[setting.data[index]] === "undefined") {
                                single.push(setting.data[index]); 
                            } else {
                                multiple.push(patterns[setting.data[index]]);
                            }
                        }
                        var result = "";
                        for (var index = 0; index < single.length; index++) {
                            var checkItem = single[index];
                            if ("trim" === checkItem) {
                                continue;
                            }
                            if (Validator.checker[checkItem](elementValue, true) == false) {
                                result = checkItem;
                                break;
                            }
                        }
                        if (result == "" && multiple.join("").length > 0 && Validator.checker["!regex"](elementValue, "[^" + multiple.join("") + "]") == false) {
                            result = "!regex";
                        }
                        if (result != "") {
                            var element = $elements.get(0);
                            var message = _super.getMessage(element, result, setting);
                            _super.alertMessage(element, message);
                            return false;
                        }
                        return true;
                    },
                    alertMessage : function(element, message) {
                        var _super = this;
                        $.alert({
                            message : message, 
                            button1 : {
                                callback : function() {
                                    try {
                                        element.focus();
                                    } catch (e) {};
                                }
                            }
                        });
                    },
                    isValid : function() {
                        if (this.$form == null) {
                            this.$form = $("#" + this.formId); 
                        }
                        if (this.$form.length != 1) {
                            return true;
                        }
                        var _super = this;
                        for (var item in _super.settings) {
                            var setting = _super.settings[item];
                            if (typeof setting.when === "function") {
                                var result = setting.when.call();
                                if (typeof result !== "boolean" ) {
                                    alert("'when' function must return a boolean.");
                                    return false;
                                }
                                if (result == false) {
                                    continue;
                                }
                            }
                            if (typeof setting === "function") {
                                var result = setting.call();
                                if (typeof result !== "boolean" ) {
                                    alert("function must return a boolean.");
                                    return false;
                                }
                                if (result == false) {
                                    return result;
                                }
                            } else {
                                var $elements = _super.getElements(setting.name);
                                $elements = $elements.not(":disabled");
                                if ($elements.length == 0) {
                                    if (typeof setting.data !== "undefined" && $.inArray("!null", setting.data) > -1 && setting.notExistIsNull == true) {
                                        var message = _super.getMessage(null, "!null", setting);
                                        _super.alertMessage(null, message);
                                        return false;
                                    } else {
                                        continue;
                                    }
                                }
                                
                                if (typeof setting.data !== "undefined" && $.inArray("trim", setting.data) > -1) {
                                    $elements.each(function() {
                                        $(this).val($(this).val().trim());
                                    });
                                }

                                if ($.isArray(setting.name) == true) {
                                    var elementValue = _super.getElementsValues($elements);
                                    for (var checkItem in setting.check) {
                                        var compareValue = setting.check[checkItem];
                                        if (typeof compareValue === "object") {
                                            var $compareElements = _super.getElements(setting.check[checkItem].name);
                                            $compareElements = $compareElements.not(":disabled");
                                            if ($compareElements.length == 0) {
                                                continue;
                                            } else if ($compareElements.length > 1) {
                                                alert("can not compare with multiple elements.");
                                                return false;
                                            }
                                            compareValue = _super.getElementsValues($compareElements).join("");
                                        }
                                        if (_super.checking($elements, elementValue.join(""), compareValue, checkItem, setting) == false) {
                                            return false;
                                        }
                                    }
                                    if (_super.checkingData($elements, elementValue.join(""), setting) == false) {
                                        return false;
                                    }
                                } else {
                                    var result = true;
                                    $elements.each(function() {
                                        var element = this;
                                        var elementValue = "";
                                        if (element.type.toUpperCase() == "RADIO" || element.type.toUpperCase() == "CHECKBOX") {
                                            elementValue = _super.getElementsValues($elements).join("");
                                        } else {
                                            elementValue = $(element).val();
                                        }
                                        if (elementValue == null) {
                                            elementValue = "";
                                        }
                                        if (typeof setting.check !== "undefined") {
                                            for (var checkItem in setting.check) {
                                                var compareValue = setting.check[checkItem];
                                                if (typeof compareValue === "object") {
                                                    var $compareElements = _super.getElements(setting.check[checkItem].name);
                                                    $compareElements = $compareElements.not(":disabled");
                                                    if ($compareElements.length == 0) {
                                                        continue;
                                                    } else if ($compareElements.length > 1) {
                                                        alert("can not compare with multiple elements.");
                                                        result = false;
                                                        return false;
                                                    }
                                                    compareValue = _super.getElementsValues($compareElements).join("");
                                                }
                                                if (_super.checking($(element), elementValue, compareValue, checkItem, setting) == false) {
                                                    result = false;
                                                    return false;
                                                }
                                            }
                                        }
                                        if (typeof setting.data !== "undefined") {
                                            if (_super.checkingData($(element), elementValue, setting) == false) {
                                                result = false;
                                                return false;
                                            }
                                        }
                                    });
                                    if (result == false) {
                                        return result;
                                    }
                                }
                            }
                        }
                        return true;
                    },
                    getElements : function(elementName) {
                        $field = this.$form.find(":input").filter(function() {
                            if (typeof elementName === "string") {
                                return this.name == elementName; 
                            } else if ($.isArray(elementName) == true) {
                                for (var index = 0; index < elementName.length; index++) {
                                    return this.name == elementName[index];
                                }
                            }
                        });
                        return $field;
                    },
                    getElementsValues : function($element) {
                        var values = [];
                        $element.each(function() {
                            var val = "";
                            if (this.type.toUpperCase() == "RADIO" || this.type.toUpperCase() == "CHECKBOX") {
                                if (this.checked == true) {
                                    val = $(this).val();
                                }
                            } else {
                                val = $(this).val();
                            }
                            if (val == null) {
                                val = "";
                            }
                            values.push(val);
                        });
                        return values;
                    },
                    setEvent : function(setting) {
                        if (this.$form == null) {
                            this.$form = $("#" + this.formId); 
                        }
                        if (this.$form.length != 1) {
                            return;
                        }
                        var $elements = this.getElements(setting.name);
                        for (var item in setting.check) {
                            if ($.inArray(item, Validator.events.maxlength) > -1) {
                                $elements.each(function() {
                                    var element = this;
                                    if (element.tagName == "INPUT" && element.type.toUpperCase() == "TEXT") {
                                        $(element).attr("maxLength", setting.check[item]);
                                    }
                                });
                            }
                        }

                        var keydownParam = {keyCodes : [], condition : []};
                        for (var index in setting.data) {
                            if (typeof Validator.events.keydown[setting.data[index]] !== "undefined") {
                                $.merge(keydownParam.keyCodes, Validator.events.keydown[setting.data[index]].keyCodes);
                                $.merge(keydownParam.condition, Validator.events.keydown[setting.data[index]].condition);
                            }
                        }

                        if (keydownParam.keyCodes.length > 0 || keydownParam.condition.length > 0) {
                            $elements.each(function() {
                                var element = this;
                                $(element).bind("keydown", keydownParam, Validator.availKeys);
                            });
                        }
                        $elements.each(function() {
                            var element = this;
                            if (typeof setting.data !== "undefined") {
                                if ($.inArray("alphabet", setting.data) > -1) {
                                    $(element).css("ime-mode", "inactive");
                                }
                                if ($.inArray("hangul", setting.data) > -1) {
                                    $(element).css("ime-mode", "active");
                                } else {
                                    if ($.inArray("number", setting.data) > -1 
                                            || $.inArray("signnumber", setting.data) > -1 
                                            || $.inArray("hypennumber", setting.data) > -1 
                                            || $.inArray("commanumber", setting.data) > -1 
                                            || $.inArray("decimalnumber", setting.data) > -1) { 
                                        $(element).css("ime-mode", "disabled");
                                    }
                                }
                                if ($.inArray("commanumber", setting.data) > -1) {
                                    $(element).val($(element).val().toComma());
                                    $(element).bind("keyup", function(event) {
                                        var obj = event.target ? event.target : event.srcElement;    
                                        var str = obj.value.replace(/[,]/g, '');
                                        var arr = str.split('.');
                                        if (arr.length <= 2) {
                                            if (!isNaN(arr[0])) {
                                                var pattern = /([+-]?\d+)(\d{3})/;   // 정규식
                                                while (pattern.test(arr[0])) {
                                                    arr[0] = arr[0].replace(pattern, '$1,$2');
                                                }
                                            }
                                            obj.value = arr.join('.');
                                        }
                                    });
                                }
                            }
                        });
                        
                    },
                    getMessage : function(element, item, setting) {
                        if (typeof setting.message === "undefined") {
                            var params = {
                                _title_ : setting.title
                                ,_postword_ : this.getPostword(setting.title, item)
                                ,_value_ : typeof setting.check !== "undefined" && typeof setting.check[item] !== "undefined" ? setting.check[item] : ""  
                                ,_verb_ : this.getVerb(element)
                            };
                            if (typeof setting.check !== "undefined" && typeof setting.check[item] === "object") {
                                params._value_ = setting.check[item].title;
                            }
                            return Validator.messages[item].format(params);
                        } else {
                            return setting.message;
                        }
                        
                    },
                    getVerb : function(element) {
                        var verb = Validator.verbs.enter;
                        if (element != null) {
                            switch(element.type.toUpperCase()) {
                                case "CHECKBOX":
                                case "RADIO":
                                case "SELECT-ONE":
                                case "SELECT-MULTIPLE":
                                    verb = Validator.verbs.select;
                                    break;
                            }
                        }
                        return verb;
                    },
                    getPostword : function(title, checker) {
                        if (title == null) {
                            title = "";
                        }
                        return title.endJongsung() ? Validator.postwords[checker] ? Validator.postwords[checker].word1 : ""
                                                   : Validator.postwords[checker] ? Validator.postwords[checker].word2 : "";
                    }
                };
                
                return publics;
            }
            var _validator = new _validator();
            _validator.formId = formId;
            _validator.option = $.extend(true, Validator.defaults, options);
            return _validator;
        }
    };
    $.validator = function(formId, options) {
        
        var _validator = methods.create.apply(this, arguments);
        if (typeof formId !== "string" || _validator == null) {
            alert("validator does not create");
            return null;
        }
        return _validator;
    };
    Global.validator = Validator;
})(jQuery);

/**
 * 브라우져 버전 보완 및 function 추가
 */
(function($) {
    if (!String.prototype.trim) {
        String.prototype.trim = function() {
            return this.replace(/^\s*|\s*$/g, "");
        };
    }
    if (!String.prototype.startsWith) {
        String.prototype.startsWith = function(str) {
            return (this.match("^"+str) == str);
        };
    }
    if (!String.prototype.endsWith) {
        String.prototype.endsWith = function(str) {
            return (this.match(str+"$") == str);
        };
    }
    if (!String.prototype.getBytes) {
        String.prototype.getBytes = function () {
            var byteLength = (function(s,b,i,c) {
            	for(b=i=0;c=s.charCodeAt(i++);b+=c>>11?3:c>>7?2:1);
            	return b
            })(this);
            return byteLength;
//        	return this.length + (escape(this)+"%u").match(/%u/g).length-1;
        };
    }
    if (!String.prototype.relaceAll) {
        String.prototype.replaceAll = function(oldstr, newstr) {
            var pattern = new RegExp(oldstr, "g");
            return this.replace(pattern, newstr);
        };
    }
    if (!String.prototype.toComma) {
        String.prototype.toComma = function () {
            var str = this.replace(/,/g, '');
            if (!isNaN(str)) {
                var pattern = new RegExp('([0-9])([0-9][0-9][0-9][,.])');
                var num = str.split('.');
                num[0] += '.';
                do {
                    num[0] = num[0].replace(pattern, '$1,$2');
                } while (pattern.test(num[0]));
                if (num.length > 1) {
                    return num.join('');
                } else {
                    return num[0].split('.')[0];
                }
            } else {
                return this;
            }
        };
    }
    if (!String.prototype.escapeXml) {
        String.prototype.escapeXml = function () {
            var returnValue = this;
            var chars = {"&amp;" : "&", "&lt;" : "<", "&gt;" : ">", "&#034;" : '"', "&#039;" : "'"};  
            $.each(chars, function (i, c) {
                returnValue = returnValue.replace(new RegExp(c.key, 'mg'), c.value);
            });
            return returnValue;
        };
    }
    if (!String.prototype.format) {
        String.prototype.format = function (col) {
            col = typeof col === 'object' ? col : Array.prototype.slice.call(arguments);
    
            return this.replace(/\{([^}]+)\}/gm, 
                function () {
                    return col[arguments[1]];    
                }
            );        
        };
    }
    if (!String.prototype.endJongsung) {
        String.prototype.endJongsung = function() {
            // str의 마지막글자의 받침이 있는지 검사하여. 있으면  true
            if (this == null) {
                return false;
            }
            if (this.length < 1) {
                return false;
            }
            var chr = this.substring(this.length - 1);
            var ascii = chr.charCodeAt();
            if (!((ascii >= 44032) && (ascii <= 55203))) {
                return false;
            }
            if ((ascii - 44032) % 588 % 28 == 0) {
                return false;
            } else {
                return true;
            }
        };
    }
    if (!String.prototype.encodeIfNumber) {
        String.prototype.encodeIfNumber = function() {
            // 숫자형식의 스트링을 암호화(이진수+각각을아스키문자로변환+리버스)
            if (isNaN(this)) {
                return this;
            }
            var encode = [];
            var array = parseInt(this, 10).toString(2).split("");
            var len = array.length;
            for (var i = 0; i < len; i++) {
                encode.push(String.fromCharCode(parseInt(array[i], 10) + 1 + i));
            }
            return encode.reverse().join(String.fromCharCode(1));
        };
    }
})(jQuery);

// collection reverse 
jQuery.fn.reverse = [].reverse;





/* 추가작업 */

$(function(){
	function menuS(){
		var thisN;
		$(".sitemap").click(function(){
			thisN = $(".fullSiteMap").css("display");
			if (thisN == "none"){
				$(".fullSiteMap:not(.static)").slideDown();
			}else{
				$(".fullSiteMap:not(.static)").hide();
			}
		});
	}
	menuS();
});