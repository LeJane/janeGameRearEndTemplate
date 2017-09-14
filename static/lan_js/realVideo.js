  var MonitorFourWindow = {
        MonitorWindow: new Array(4),
        init: function () {
            var videoPanel = document.getElementById("VideoPanel");
            for (var i = 0; i < MonitorFourWindow.MonitorWindow.length; i++) {
                MonitorFourWindow.MonitorWindow[i] = new MonitorWindowClass();
                videoPanel.appendChild(MonitorFourWindow.MonitorWindow[i].init(i));
            }
            MonitorFourWindow.MonitorWindow[0].resizeTo(10, 10, 250, 250);
            MonitorFourWindow.MonitorWindow[1].resizeTo(270, 10, 250, 250);
            MonitorFourWindow.MonitorWindow[2].resizeTo(10, 280, 250, 250);
            MonitorFourWindow.MonitorWindow[3].resizeTo(270, 280, 250, 250);

        },
        byte: function (terminalNo) {
            var index = document.getElementById("sldd").value;
            if (index == 0) {
                MonitorFourWindow.MonitorWindow[0].byte();
                MonitorFourWindow.MonitorWindow[1].byte();
                MonitorFourWindow.MonitorWindow[2].byte();
                MonitorFourWindow.MonitorWindow[3].byte();
            } else {
                MonitorFourWindow.MonitorWindow[index - 1].byte();
            }
        },
        invite: function (terminalNo) {
        	if (!!window.ActiveXObject || "ActiveXObject" in window) {
					  
			}else{  
					layer.alert("请使用IE打开");
				return false;  
			}
            var index = document.getElementById("sldd").value;
            if (index == 0) {
                MonitorFourWindow.MonitorWindow[0].invite( terminalNo,1 );
                MonitorFourWindow.MonitorWindow[1].invite(terminalNo ,2 );
                MonitorFourWindow.MonitorWindow[2].invite(terminalNo ,3);
                MonitorFourWindow.MonitorWindow[3].invite( terminalNo ,4);
            } else {
            	<!-- debugger; -->
                MonitorFourWindow.MonitorWindow[index - 1].invite( terminalNo ,index);
            }

        }

    };

    function MonitorWindowClass(parameters) {
        var MonitorWindow = {
            windowObject: null, //窗口HTML元素容器
            mediaObject: null, //控件对象
            videoStatus: 1,
            windowIndex: 0,
            WindowWidth: 100,
            magnify: false,
            windowLeft: 0,
            windowTop: 0,
            windowH: 0,
            windowW: 0,
            getWindowHtml: function (classid, index) {
				<!-- debugger; -->
               var strWindowHtml = "" +
                        "    <div >" + //视频窗口
                        "      <object onclick=\"alert('wqer')\"   id=\"CamAX_" + index + "\" classid=\"clsid:" + classid + "\" border=2 > <param name='wmode' value='Opaque'></object>" +
                        "      <iframe src='javascript:false' style='position:absolute; visibility:inherit; top:0px; left:0px; height:100%; width:100%; z-index:-1; filter=&quot progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)&quot '> </iframe>" +
                        "    </div>" +
                        "    <div align=left >" + //视频窗口状态栏
                        "    <div id='plateNoText' class='statu_span' style='float:left; '>" + index + "</div>" +
                        "<a onclick=\"MonitorFourWindow.MonitorWindow[" + index + "].maximizedWindow();\" style=\"cursor: pointer;margin-left:10px;color:blue\">放大</a>" +
                        "<a onclick=\"MonitorFourWindow.MonitorWindow[" + index + "].restoredWindow();\" style=\"cursor: pointer;margin-left:10px;color:blue\">缩小</a>" +
                    "    <div id='statu' class='statu_span' style='float:left; ' title=" + "空闲" + "   >" + "空闲" + "</div>" +
                    "    <div id='Stream' class='statu_span' style='float:right; '></div>" +
                    "    </div>" + "";
                    return strWindowHtml;

            },
            IEVersion: function () {
                var v = 3, div = document.createElement('div'), all = div.getElementsByTagName('i');
                while (div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->', all[0]);
                return v > 4 ? v : false;

            },
            init: function (index) {
                MonitorWindow.windowIndex = index;
                var box = document.createElement("div");
                box.style.position = 'absolute';
                box.innerHTML = MonitorWindow.getWindowHtml("B5CDA5F0-7677-4326-9A9B-D33BBAAA0102", MonitorWindow.windowIndex);
                MonitorWindow.windowObject = box;
                MonitorWindow.mediaObject = MonitorWindow.windowObject.getElementsByTagName("object")[0];
				console.log(MonitorWindow.mediaObject);
                //  alert(this.IEVersion());
                if (navigator.appName == "Microsoft Internet Explorer") {
                    if (navigator.platform == 'Win64') {//其它IE版本如果是64位，提示不支持             
                        if (confirm('检测到浏览器可能存在兼容问题，系统将自动关闭后重新打开,是否继续？')) {
                            var objShell = null;
                            try {
                                objShell = new ActiveXObject("WScript.Shell");
                                var navurl = "120.76.119.224:83";
                                var iePath = ":\\Program Files (x86)\\Internet Explorer\\IEXPLORE.EXE " + navurl;
                                //尝试在如下盘符查找，没找到则提示          
								var panfu = ['C','D','E','F','G','H','I'],isFind = false; 
                                for (var i = 0; i < panfu.length; i++) {
                                    try {
                                        objShell.Exec(panfu[i] + iePath);
                                        isFind = true;
                                        break;
                                    } catch (ex) { }
                                }
                                objShell = null;
                                if (!isFind) {
                                    alert('无法在系统中找到32位IE的安装路径：Program Files (x86)\\Internet Explorer');
                                } else {
                                    window.open('', '_self', '');
                                    window.parent.close();
                                }
                            } catch (e) {
                                alert('请先将本站加入信任站点。');
                                document.execCommand("Stop");
                            }
                        } else {
                            document.execCommand("Stop");
                        }
                    }
                }





                if (MonitorWindow.mediaObject.attachEvent) {
				
				
                    MonitorWindow.mediaObject.attachEvent("onfocus", function (e) {
					
					
                        if (!e) e = window.event;
                        elm = e.srcElement;
                        MonitorWindow.selectWindow()

                    });
					
                    MonitorWindow.mediaObject.attachEvent("SIC_Notify", function ( iChannel, itype, ivalue) {
					
                        MonitorWindow.dispatchEventSC(i, itype, ivalue);
                    }); 

                } else {
                    MonitorWindow.mediaObject.addEventListener("onfocus", function (e) {
					
                        if (!e) e = window.event;
                        elm = e.srcElement;
                        MonitorWindow.selectWindow()

                    });
                    MonitorWindow.mediaObject.addEventListener("SIC_Notify", function ( iChannel, itype, ivalue) {
					
                        MonitorWindow.dispatchEventSC(i, itype, ivalue);
                    }); 
                };
				
			
				


                return MonitorWindow.windowObject;
            },
            pageX: function (elem) {
                return elem.offsetParent ? elem.offsetLeft + MonitorWindow.pageX(elem.offsetParent) : elem.offsetLeft;
            },

            //窗口重定位及大小设置
            resizeTo: function (left, top, w, h) {
                var videoPanel = document.getElementById("VideoPanel");


                var offsetLeft = MonitorWindow.pageX(videoPanel);
                MonitorWindow.windowLeft = left;
                MonitorWindow.windowTop = top;
                MonitorWindow.windowH = h;
                MonitorWindow.windowW = w;
                MonitorWindow.restoredWindow();

            },
            maximizedWindow: function () {
                for (var i = 0; i < MonitorFourWindow.MonitorWindow.length; i++) {
                    if (MonitorFourWindow.MonitorWindow[i].windowIndex == MonitorWindow.windowIndex) {
                        MonitorFourWindow.MonitorWindow[i].show();
                    } else {
                        MonitorFourWindow.MonitorWindow[i].hide();
                    }
                }
				 
				 var Wid=$("#RealVideo").width();
				 var Heig=$("#RealVideo").height();
				 Heig=parseInt(Heig-40);
				
				 MonitorWindow.windowObject.style.cssText = "position:'absolute'; width:"+Wid+"px; height:"+Heig+"px;Left :0px; Top:0px;";
				 MonitorWindow.windowObject.style.position = "absolute";
				 MonitorWindow.mediaObject.style.cssText = "position:'absolute';width:"+Wid+"px; height:"+Heig+"px;Left :0px; Top:0px;";
            },
            restoredWindow: function () {
                for (var i = 0; i < MonitorFourWindow.MonitorWindow.length; i++) {
                    MonitorFourWindow.MonitorWindow[i].show();
                }


                MonitorWindow.windowObject.style.cssText = "position:'absolute'; width:" + MonitorWindow.windowW + "px; height:" + MonitorWindow.windowH + "px;Left :" + MonitorWindow.windowLeft + "px; Top:" + MonitorWindow.windowTop + "px;";
                MonitorWindow.windowObject.style.position = "absolute";
                MonitorWindow.mediaObject.style.cssText = "position:'absolute';width:" + MonitorWindow.windowW + "px; height:" + MonitorWindow.windowH + "px;Left :" + MonitorWindow.windowLeft + "px; Top:" + MonitorWindow.windowTop + "px;";

            },
            selectWindow: function () {
			
                for (var i = 0; i < MonitorFourWindow.MonitorWindow.length; i++) {
                    if (MonitorFourWindow.MonitorWindow[i].mediaObject == MonitorWindow.mediaObject) {
                        MonitorFourWindow.MonitorWindow[i].mediaObject.style.borderColor = "#ff0000";
                        document.getElementById("sldd").value = i + 1;
						
						
                    } else {
                        MonitorFourWindow.MonitorWindow[i].mediaObject.style.bgColor = "#fff";

                    }
                }
			
            },
            dispatchEventSC: function (index, type, value) {
			
                switch (type) {
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                        //等待处理invite响应
                        if (value == 0) {
                            var targetag = MonitorWindow.windowObject.getElementsByTagName("div")[3];
                            targetag.innerText = "呼叫成功";
                            MonitorWindow.videoStatus = 2;
                        }
                        break;
                    case 10:
                        //等待处理bye响应
                        if (value == 0) {
                            var targetag = MonitorWindow.windowObject.getElementsByTagName("div")[3];
                            targetag.innerText = "挂断";
                            MonitorWindow.videoStatus = 1;
                            targetag = MonitorWindow.windowObject.getElementsByTagName("div")[4];
                            targetag.innerText = "";
                        }
                        break;

                    case 13:
                        var targetag = MonitorWindow.windowObject.getElementsByTagName("div")[4];
                        targetag.innerText = (value / 128).toFixed(2) + 'Kbps';
                        break;
                    default:
					alert();
                        break;
                }
            },
            invite: function (terminalNo,i) {
            
				if(i ==null  || i=="undefined" || !i){
					i=0;
				}
                    MonitorWindow.mediaObject.SIC_Invite('120.76.119.224', terminalNo,-1, 8851,i,0,1,'0');

             
            },

            byte: function () {
                MonitorWindow.mediaObject.SIC_HangUpALL();
            },
            show: function () {//显示此窗口
                MonitorWindow.windowObject.style.display = "block";
                MonitorWindow.mediaObject.style.display = "block";

            },
            hide: function () {//隐藏此窗口
                MonitorWindow.windowObject.style.display = "none";
                MonitorWindow.mediaObject.style.display = "none";
            }


        };
        return MonitorWindow;
    }

    //debugger;
    MonitorFourWindow;
    setTimeout(function () {
        MonitorFourWindow.init();
    }, 1000);