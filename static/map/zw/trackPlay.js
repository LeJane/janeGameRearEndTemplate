(function($,window){
    var nowDate = new Date();
    var nowYear;//年
    var monthIndex;//月
    var nowMonth;
    var afterMonth;
    var startTime;
    var endTime;
    var logoWidth;
    var btnIconWidth;
    var windowWidth;
    var newwidth;

    var windowHeight;
    var headerHeight;//顶部的高度
    var panelHead;//标题栏高度
    var citySelHght;//输入框高度
    var realTimeCanAreaHeight;//时间选择区域
    var trLength;
    var calHeight;
    var zTreeHeight;
    var titleHeight;
    var demoHeight;
    var mapHeight;
    var operMenuHeight;
    var newOperHeight;

    //地图拖动改变大小
    var els;
    var oldMapHeight;
    var myTabHeight;
    var wHeight;
    var tableHeight;

    var isTrafficDisplay = true;
    var isMapThreeDFlag = true;
    var tableSet = [];
    var tableSetStop = [];
    var tableSetCopy = [];
    var alarmTableSet = [];
    var alarmTableSetCopy = [];
    var alarmIndex = 1;
    var tableIndex = 1;
    var stoptableIndex = 1;
    var advance_retreat = false;//前进/后退标识(标识位true时需要重新组装table，用后重置)
    var nextIndexs = 1;
    var btnFlag = false;
    var listIndex;
    var speed = 500;
    var selIndex = 0;
    var trIndex = 0;
    var flagBackGo = false;
    var speedM = [];
    var timeM = [];
    var mileageM = [];
    var mileageMax = 0;
    var speedMax = 0;
    var timeMax = 0;
    var goDamoIndex = 0;
    var clickEventListener;
    var clickEventListener2;
    var marker,lineArr = [],paths;
   /* var markerMovingControl;*/
    var longtitudestop = [];
    var latitudestop = [];
    var timestop = [];
    var startTimestop = [];
    var endTimestop = [];
    var infoWindow2 = new AMap.InfoWindow({offset: new AMap.Pixel(0, -10),closeWhenClickMap:true});
    var flagBack = false;
    var lmapHeight;
    var open = 1;
    var carLng;
    var carLat;
    var stopLng;
    var stopLat;
    var timeArray = [];
    var stopArray = [];
    var flagOne = true;
    var flagTwo = true;
    var dragFlag = true;
    var ScrollBar;
    var ProgressBar;
    var sWidth;
    var buildings;
    var satellLayer;
    var realTimeTraffic
    
    var markerMovingControl;
    var markerStopFlag = false;
    //var msgState = false;//判断行驶地理编码是否完成
    var msgArray = []//存行驶地理信息
    //var stopMsgState = false;//判断停车地理编码是否完成
    var stopMsgArray = []//存停车地理信息
    var runValue_num;
    var stopValue_num;
    trackPlayback = {
        //初始化
        init: function(){
            $(window).resize(function(){
                var resizeWidth = $(window).width();
                if(resizeWidth < 1200){
                    $("body").css("overflow","auto");
                }else{
                    $("body").css("overflow","hidden");
                }
            });

            //nowMonth = nowDate.getFullYear() + "-" + parseInt(nowDate.getMonth() + 1) ;
            nowMonth = nowDate.getFullYear() + "-" + (parseInt(nowDate.getMonth() + 1) < 10 ? "0" + parseInt(nowDate.getMonth() + 1):parseInt(nowDate.getMonth() + 1)) + "-01"
            afterMonth = nowDate.getFullYear() + "-" + (parseInt(nowDate.getMonth() + 2) < 10? "0" + parseInt(nowDate.getMonth() + 2):parseInt(nowDate.getMonth() + 2)) + "-01";

            startTime = nowDate.getFullYear()
                + "-"
                + (parseInt(nowDate.getMonth() + 1) < 10 ? "0"
                + parseInt(nowDate.getMonth() + 1) : parseInt(nowDate
                        .getMonth() + 1))
                + "-"
                + (nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate())
                + " " + "00:00:00";
            endTime = nowDate.getFullYear()
                + "-"
                + (parseInt(nowDate.getMonth() + 1) < 10 ? "0"
                + parseInt(nowDate.getMonth() + 1) : parseInt(nowDate
                        .getMonth() + 1))
                + "-"
                + (nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate())
                + " " + ("23") + ":" + ("59") + ":" + ("59");

            $("#startTime").val(startTime);
            $("#endTime").val(endTime);

            logoWidth = $("#header .brand").width();
            btnIconWidth = $("#header .toggle-navigation").width();
            windowWidth = $(window).width();
            newwidth = (logoWidth + btnIconWidth + 40 + 2) / windowWidth * 100;
            // $("#content-left").css({
                // "width" : newwidth + "%"
            // });
            $("#content-right").css({
                "width" : 100 - newwidth + "%"
            });
            $(".sidebar").attr("class", "sidebar sidebar-toggle");
            $(".main-content-wrapper").attr("class","main-content-wrapper main-content-toggle-left");

            windowHeight = $(window).height();
            headerHeight = $("#header").height();//顶部的高度
            panelHead = $(".panel-heading").height() + 20;//标题栏高度
            citySelHght = $("#citySel").parent().height();//输入框高度
            realTimeCanAreaHeight = $(".realTimeCanArea").height() + 13;//时间选择区域
            //日历高亮
            $('.calendar3').calendar();
            trLength = $(".calendar3 tbody tr").length;
            if(trLength == 5){
                calHeight = 295;
            }else if(trLength == 4){
                calHeight = 350;
            }

            zTreeHeight = windowHeight - headerHeight - panelHead - calHeight - citySelHght - realTimeCanAreaHeight;
            $("#treeDemo").css("height",zTreeHeight + "px");
            if(windowHeight<=667){
                $("#treeDemo").css("height",110 + "px");
            }

            titleHeight = $(".panHeadHeight").height() + 30;
            demoHeight = $("#Demo").height();
            mapHeight = initialMapH = windowHeight - headerHeight - titleHeight - demoHeight - 20;
            $("#operationMenu").css("height",windowHeight-headerHeight + "px");
            $("#MapContainer").css({
                "height" : mapHeight + "px"
            });
            operMenuHeight = $("#operationMenu").height();
            newOperHeight = windowHeight - headerHeight;
            $("#operationMenu").css({
                "height":newOperHeight+"px"
            });

            oldMapHeight = $("#MapContainer").height();
            myTabHeight = $("#myTab").height();
            wHeight = $(window).height();

            map = new AMap.Map("MapContainer", {
                resizeEnable: true,
                scrollWheel: true,
                zoom: 18
            });
            //实例化3D楼块图层
            buildings = new AMap.Buildings();
            // 在map中添加3D楼块图层
            buildings.setMap(map);
            map.getCity(function (result) {
                var html = '' + result.province + '<span class="caret"></span>';
                $("#placeChoose").html(html);
            });
            AMap.plugin(['AMap.ToolBar','AMap.Scale'],function(){
                map.addControl(new AMap.ToolBar({
                    "direction" : false,
                }));
                map.addControl(new AMap.Scale());
            });
            //卫星地图
            satellLayer = new AMap.TileLayer.Satellite();
            satellLayer.setMap(map);
            satellLayer.hide();
            //实时路况
            realTimeTraffic = new AMap.TileLayer.Traffic();
            realTimeTraffic.setMap(map);
            realTimeTraffic.hide();

            //页面区域定位
            $(".amap-logo").attr("href", "javascript:void(0)").attr("target", "");
            MarkerMovingControl = function (map, marker, path) {
                this._map = map;
                this._marker = marker;
                this._path = path;
                this._currentIndex = 0;
                marker.setMap(map);
                marker.setPosition(path[0]);
            }
            /**
             * 移动marker，会从当前位置开始向前移动
             */
            MarkerMovingControl.prototype.move = function () {
                if (!this._listenToStepend) {
                    this._listenToStepend = AMap.event.addListener(this, 'stepend', function () {
                        this.step();
                    }, this);
                }
                this.step();
            };
            /**
             * 停止移动marker，由于控件会记录当前位置，所以相当于暂停
             */
            MarkerMovingControl.prototype.stop = function () {
                this._marker.stopMove();
            };
            /**
             * 重新开始，会把marker移动到路径的起点然后开始移动
             */
            MarkerMovingControl.prototype.restart = function () {
                /*$("#allMileage").text(0 + "km");
                $("#allTime").text(0);
                $("#maxSpeend").text(0 + "km/h");*/
                this._marker.setPosition(this._path[0]);
                this._currentIndex = 0;
                this.stop();
            };
            MarkerMovingControl.prototype.retreat = function () {
                if (nextIndexs < 2) {
                    this._marker.setPosition(this._path[nextIndexs - 1]);
                    this._currentIndex = nextIndexs - 1;
                    this.move();
                } else {
                    this._marker.setPosition(this._path[nextIndexs - 2]);
                    this._currentIndex = nextIndexs - 2;
                    if(open == 0){
                        this.move();
                    }else if(open == 1){
                        this.move();
                        this.stop();
                    }
                }
            };
            MarkerMovingControl.prototype.FF = function () {
                var allLengths = this._path.length;
                if(nextIndexs< allLengths){
                    this._marker.setPosition(this._path[nextIndexs]);
                    this._currentIndex = nextIndexs;
                    if(open == 0){
                        this.move();
                    }else if(open == 1){
                        this.move();
                        this.stop();
                    }
                }
            };
            MarkerMovingControl.prototype.skip = function () {
                this._marker.setPosition(this._path[listIndex]);
                this._currentIndex = listIndex;
                if(open == 0){
                    this.move();
                }else if(open == 1){
                    this.move();
                    this.stop();
                }
                nextIndexs = listIndex;
            };
            /**
             * 向前移动一步
             */
            MarkerMovingControl.prototype.step = function () {
                //列表高亮 end
                var allLengths = this._path.length;
                //平均走一步多少份
                var averageNum = (100/allLengths)*selIndex;
                ProgressBar.SetValue(averageNum);
                var nextIndex = this._currentIndex + 1;
                if (nextIndex <= this._path.length) {
                    if (!this._listenToMoveend) {
                        this._listenToMoveend = AMap.event.addListener(this._marker, 'moveend', function () {
                            this._currentIndex++;
                            AMap.event.trigger(this, 'stepend');
                        }, this);
                    }
                    nextIndexs = nextIndex;
                    if(goDamoIndex != nextIndex){
                        goDamoIndex = nextIndex;
                        $("#gpsTable tbody tr").removeClass("tableSelected");
                        if(btnFlag){
                            trIndex = trIndex - 1;
                            btnFlag = false;
                        };
                        if(flagBack){
                            trIndex--;
                            selIndex--;
                            if(trIndex < 1){
                                trIndex = 0;
                            };
                            if(selIndex < 1){
                                selIndex = 1;
                            };
                            var tableTrHeight = ($("#gpsTable tbody tr:first-child").height()) * trIndex;
                            $("#gpsTable tbody tr:nth-child(" + selIndex + ")").addClass("tableSelected");
                            $("#GPSData .dataTables_scrollBody").scrollTop(tableTrHeight);
                            flagBack = false;
                        }else{
                            selIndex++;
                            $("#gpsTable tbody tr:nth-child(" + selIndex + ")").addClass("tableSelected");
                            if (selIndex >= 5) {
                                trIndex++;
                                var tableTrHeight = ($("#gpsTable tbody tr:first-child").height()) * trIndex;
                                $("#GPSData .dataTables_scrollBody").scrollTop(tableTrHeight);
                            };
                        }
                    }
                    if(this._path[nextIndex] != undefined){
                        this._marker.moveTo(this._path[nextIndex], speed);
                    }
                }
                //行驶时长
                if(mileageM[nextIndexs-1] >0){
                mileageMax = (mileageM[nextIndexs-1] - mileageM[0]).toFixed(2);
                $("#allMileage").text(mileageMax + "km");}
                //行驶时间
                //var sta_str = (timeM[0]).replace(/-/g,"/"); //开始时间
                var sta_str = timeM[0];
                //var end_str = (timeM[nextIndexs]).replace(/-/g,"/"); //结束时间
                var end_str = timeM[nextIndexs-1];
                //var end_date = new Date(end_str);//将字符串转化为时间
                var end_date = (new Date(end_str.replace(/-/g, "/"))).getTime();
                //var sta_date = new Date(sta_str);
                var sra_date = (new Date(sta_str.replace(/-/g, "/"))).getTime();
                var num = (end_date-sra_date);
                var theTime = parseInt(num/1000);// 秒
                var theTime1 = 0;// 分
                var theTime2 = 0;// 小时
                if(theTime > 60) {
                    theTime1 = parseInt(theTime/60);
                    theTime = parseInt(theTime%60);
                        if(theTime1 > 60) {
                        theTime2 = parseInt(theTime1/60);
                        theTime1 = parseInt(theTime1%60);
                        }
                };
                    var result = ""+parseInt(theTime)+"秒";
                    if(theTime1 > 0) {
                    result = ""+parseInt(theTime1)+"分"+result;
                    };
                    if(theTime2 > 0) {
                    result = ""+parseInt(theTime2)+"小时"+result;
                    };
                timeMax = result;
                $("#allTime").text(timeMax);
                //最大速度
                var newary=speedM.slice(0, nextIndexs);
               /*speedMax = newary.max();*/
                speedMax = Math.max.apply(null, newary);
                $("#maxSpeend").text(speedMax + "km/h");
                //判断当前点是否在矩形内
                if(open == 0){
                     var southwest = map.getBounds().getSouthWest();
                     var northeast = map.getBounds().getNorthEast();
                     var mcenter = map.getCenter();                  //获取中心坐标
                     var pixel2 = map.lnglatTocontainer(mcenter);//根据坐标获得中心点像素
                     var mcx = pixel2.getX();                    //获取中心坐标经度像素
                     var mcy = pixel2.getY();                    //获取中心坐标纬度像素
                     var southwestx = mcx+(mcx*0.8);
                     var southwesty = mcy*0.2;
                     var northeastx = mcx*0.2;
                     var northeasty = mcy+(mcy*0.8);
                     var ll = map.containTolnglat(new AMap.Pixel(southwestx, southwesty));
                     var lll = map.containTolnglat(new AMap.Pixel(northeastx, northeasty));
                     paths =new AMap.Bounds(
                           lll,//东北角坐标
                            ll //西南角坐标
                        );
                        if(paths.contains(lineArr[nextIndexs - 1]) != true){
                             map.panTo(lineArr[nextIndexs - 1]);
                        }   
                }
            };
            clickEventListener = map.on('zoomend', function() {
                if(open == 0){
                    var southwest = map.getBounds().getSouthWest();
                    var northeast = map.getBounds().getNorthEast();
                    var mcenter = map.getCenter();                  //获取中心坐标
                    var pixel2 = map.lnglatTocontainer(mcenter);//根据坐标获得中心点像素
                    var mcx = pixel2.getX();                    //获取中心坐标经度像素
                    var mcy = pixel2.getY();                    //获取中心坐标纬度像素
                    var southwestx = mcx+(mcx*0.8);
                    var southwesty = mcy*0.2;
                    var northeastx = mcx*0.2;
                    var northeasty = mcy+(mcy*0.8);
                    var ll = map.containTolnglat(new AMap.Pixel(southwestx, southwesty));
                    var lll = map.containTolnglat(new AMap.Pixel(northeastx, northeasty));
                    paths =new AMap.Bounds(
                            lll,//东北角坐标
                            ll //西南角坐标
                       );
                    if(paths.contains(lineArr[nextIndexs - 1]) != true){
                         map.panTo(lineArr[nextIndexs - 1]);
                    }   
                }
            });
            clickEventListener2 = map.on('dragend', function() {
                if(open == 0){
                    var southwest = map.getBounds().getSouthWest();
                    var northeast = map.getBounds().getNorthEast();
                    var mcenter = map.getCenter();                  //获取中心坐标
                    var pixel2 = map.lnglatTocontainer(mcenter);//根据坐标获得中心点像素
                    var mcx = pixel2.getX();                    //获取中心坐标经度像素
                    var mcy = pixel2.getY();                    //获取中心坐标纬度像素
                    var southwestx = mcx+(mcx*0.8);
                    var southwesty = mcy*0.2;
                    var northeastx = mcx*0.2;
                    var northeasty = mcy+(mcy*0.8);
                    var ll = map.containTolnglat(new AMap.Pixel(southwestx, southwesty));
                    var lll = map.containTolnglat(new AMap.Pixel(northeastx, northeasty));
                    paths =new AMap.Bounds(
                            lll,//东北角坐标
                            ll //西南角坐标
                       );
                    if(paths.contains(lineArr[nextIndexs - 1]) != true){
                         map.panTo(lineArr[nextIndexs - 1]);
                    }   
                } 
            });
            lmapHeight = $("#MapContainer").height();
            Math.formatFloat = function (f, digit) {
                var m = Math.pow(10, digit);
                return parseInt(f * m, 10) / m;
            };
            //监控对象车辆树
            var setting = {
                async: {
                    url: "/clbs/m/functionconfig/fence/bindfence/vehicelTree",
                    type: "post",
                    enable: true,
                    autoParam: ["id"],
                    dataType: "json",
                    otherParam: {"type": "single"},
                    dataFilter: trackPlayback.ajaxDataFilter
                },
                check: {
                    enable: true,
                    chkStyle: "radio"
                },
                view: {
                    dblClickExpand: false
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                    beforeCheck: trackPlayback.zTreeBeforeCheck,
                    onCheck: trackPlayback.onCheck,
                    beforeClick: trackPlayback.zTreeBeforeClick,
                    onAsyncSuccess: trackPlayback.zTreeOnAsyncSuccess,
                    onClick: trackPlayback.zTreeOnClick
                }
            };
            $.fn.zTree.init($("#treeDemo"), setting, null);

            ScrollBar = {
                value: 50,
                maxValue: 40000,
                step: 1,
                Initialize: function () {
                    if (this.value > this.maxValue) {
                        layer.msg("给定当前值大于了最大值！", {move: false});   
                        return;
                    }
                    this.GetValue();
                    var InitTrack = 500/(this.maxValue - 50)*$("#scrollBar").width();
                    $("#scroll_Track").css("width", InitTrack + 2 + "px");
                    $("#scroll_Thumb").css("margin-left", InitTrack + "px");
                    this.Value();
                },
                Value: function () {
                    if(flagOne){
                        speed = 500;
                        flagOne = false;
                    };
                    var valite = false;
                    var currentValue;
                    $("#scroll_Thumb").mousedown(function () {
                        valite = true;
                        $(document.body).mousemove(function (event) {
                            dragFlag = false;
                            if (valite == false) return;
                            currentValue = Math.round(event.clientX) - $("#Demo").offset().left;
                            if(currentValue <= 0){
                                currentValue = 0;
                                ScrollBar.value = 50;
                            };
                            $("#scroll_Thumb").css("margin-left", currentValue + "px");
                            $("#scroll_Track").css("width", currentValue + 2 + "px");
                            if ((currentValue + 15) >= $("#scrollBar").width()) {
                                $("#scroll_Thumb").css("margin-left", $("#scrollBar").width() - 10 + "px");
                                $("#scroll_Track").css("width", $("#scrollBar").width() + 2 + "px");
                                ScrollBar.value = ScrollBar.maxValue;
                            } else if (currentValue <= 0) {
                                $("#scroll_Thumb").css("margin-left", "0px");
                                $("#scroll_Track").css("width", "0px");
                            } else {
                                ScrollBar.value = Math.round(39950 * (currentValue / $("#scrollBar").width()));
                            }
                        });
                    });
                    $(document.body).mouseup(function () {
                        if(flagTwo || dragFlag){
                            speed = 500;
                            flagTwo = false;
                        }else{
                            speed = ScrollBar.value;
                        };
                        valite = false;
                    });
                },
                GetValue: function () {
                    this.currentX = 0
                }
            };
            ProgressBar = {
                maxValue: 100,
                value: 0,
                SetValue: function (aValue) {
                    this.value = aValue;
                    if (this.value >= this.maxValue) this.value = this.maxValue;
                    if (this.value <= 0) this.value = 0;
                    var mWidth = this.value / this.maxValue * $("#progressBar").width() + "px";
                    $("#progressBar_Track").css("width", mWidth);
                }
            };
            sWidth = $(window).width();
            //监听浏览器窗口大小变化
            if(sWidth < 1200){
                $("body").css("overflow","auto");
                if(sWidth <= 414){
                    $(".sidebar").removeClass("sidebar-toggle");
                    $(".main-content-wrapper").removeClass("main-content-toggle-left");
                }
            }else{
                $("body").css("overflow","hidden");
            }
            $("[data-toggle='tooltip']").tooltip();
        }, 
        mouseMove: function(e){
            if(els - e.clientY > 0){
                var y = els - e.clientY;
                var newHeight = mapHeight - y;
                if(newHeight <= 0){
                    newHeight = 0;
                }
                $("#MapContainer").css({
                    "height" : newHeight + "px"
                });
                if(newHeight == 0){
                    return false;
                };
                $(".trackPlaybackTable .dataTables_scrollBody").css({
                    "height" : (tableHeight + y) + "px"
                });
            }else{
                var dy = e.clientY - els;
                var newoffsetTop = $("#myTab").offset().top;
                var scrollBodyHeight = $(".trackPlaybackTable .dataTables_scrollBody").height();
                if(scrollBodyHeight == 0){
                    return false;
                }else{
                    if(newoffsetTop <= (wHeight - myTabHeight)){
                        var newHeight = mapHeight + dy;
                        $("#MapContainer").css({
                            "height" : newHeight + "px"
                        });
                        $(".trackPlaybackTable .dataTables_scrollBody").css({
                            "height" : (tableHeight - dy) + "px"
                        });
                    }
                }
            }
            e.stopPropagation();
        },
        mouseUp: function(){
            $(document).unbind("mousemove", trackPlayback.mouseMove).unbind("mouseup", trackPlayback.mouseUp);
        }, 
        //显示隐藏导航按钮同时绑定宽度
        toggleBtn: function(){
            if ($(".sidebar").hasClass("sidebar-toggle")) {
                if ($("#content-left").is(":hidden")) {
                    $("#content-right").css("width", "100%");
                } else {
                    /*$("#content-right").css("width", "75%");
                    $("#content-left").css("width", "25%");*/
                	$("#content-right").css("width", 100-newwidth + "%");
                    $("#content-left").css("width", newwidth + "%");
                }
            } else {
                if ($("#content-left").is(":hidden")) {
                    $("#content-right").css("width", "100%");
                } else {
                    $("#content-right").css("width", 100-newwidth + "%");
                    $("#content-left").css("width", newwidth + "%");
                };
            }
        },     
        //页面(地图，卫星，实时路况)点击事件
        mapBtnActive: function(){
            $("#realTimeBtn .mapBtn").removeClass("map-active");
            $(this).addClass("map-active");
        },
        //实时路况切换
        realTimeRC: function(){
            if(isTrafficDisplay){
                realTimeTraffic.show();
                $("#realTimeRC").addClass("map-active");
                isTrafficDisplay = false;
            } else {
                realTimeTraffic.hide();
                $("#realTimeRC").removeClass("map-active");
                isTrafficDisplay = true;
            }
        },
        //卫星地图及3D地图切换
        satelliteMapSwitching: function(){
            if(isMapThreeDFlag){
                $("#setMap").addClass("map-active");
                satellLayer.show();
                buildings.setMap(null);
                isMapThreeDFlag = false;
            } else {
                $("#setMap").removeClass("map-active");
                buildings.setMap(map);
                satellLayer.hide();
                isMapThreeDFlag = true;
            }
        },
        trackMap: function(){
            if (lineArr.length > 1) {
                marker = new AMap.Marker({
                    map: map,
                    position: lineArr[0],//基点位置
                    icon: "../../resources/img/vehicle.png", //marker图标，直接传递地址url
                    //icon:"http://webapi.amap.com/images/car.png",
                    offset: new AMap.Pixel(-26, -13), //相对于基点的位置
                    zIndex: 99999,
                    autoRotation: true
                });
                var polyline = new AMap.Polyline({
                    map: map,
                    path: lineArr,
                    strokeColor: "#3366ff", //线颜色
                    strokeOpacity: 0.9, //线透明度
                    strokeWeight: 6, //线宽
                    strokeStyle: "solid", //线样式
                    showDir :true
                    //strokeDasharray: [10, 5] //补充线样式
                });
                /*var passedPolyline = new AMap.Polyline({
                    map: map,
                    // path: lineArr,
                    strokeColor: "#F00",  //线颜色
                    // strokeOpacity: 1,     //线透明度
                    strokeWeight: 3,      //线宽
                    // strokeStyle: "solid"  //线样式
                });
                marker.on('moving',function(e){
                    passedPolyline.setPath(e.passedPath);
                })*/
                markerMovingControl = new MarkerMovingControl(map, marker, lineArr);
            //创建移动控件
            new AMap.Marker({
                map: map,
                position: lineArr[0],
                offset: new AMap.Pixel(-16, -43), //相对于基点的位置
                icon: new AMap.Icon({
                    size: new AMap.Size(40, 40),  //图标大小
                    image: "../../resources/img/start.png",
                    imageOffset: new AMap.Pixel(0, 0)
                })
            });
            new AMap.Marker({
                map: map,
                position: lineArr[lineArr.length-1],
                offset: new AMap.Pixel(-16, -43), //相对于基点的位置
                icon: new AMap.Icon({
                    size: new AMap.Size(40, 40),  //图标大小
                    image: "../../resources/img/end.png",
                    imageOffset: new AMap.Pixel(0, 0)
                })
            });
            var infoWindow;
            AMap.event.addListener(marker, 'click', function() {
                var arr = [];
                arr.push("GPS时间：" + tableSet[nextIndexs - 1][2]);
                arr.push("在线状态：" + tableSet[nextIndexs - 1][4]);
                arr.push("ACC状态：" + tableSet[nextIndexs - 1][5]);
                arr.push("速度(km/h)："+ tableSet[nextIndexs - 1][6]);
                arr.push("方向：" + tableSet[nextIndexs - 1][7]);
               // arr.push("地理位置:" + tableSet[nextIndexs - 1][12]);
                arr.push('<a type="button" id="addFence" onclick="trackPlayback.showAddFencePage()" style="cursor:pointer;display:block;margin: 8px 0px 0px 0px;" data-toggle="modal" data-target="#commonWin">轨迹生成路线</a>');
                content = arr;
                infoWindow = new AMap.InfoWindow({content: content.join("<br/>"),offset: new AMap.Pixel(-20, -13),closeWhenClickMap:true});
                infoWindow.open(map, marker.getPosition());
            });
            }
            var infoWindow2;
            for(var i = 0; i<timestop.length;i++){
                marker2 = new AMap.Marker({
                    position: [longtitudestop[i], latitudestop[i]],
                    map: map,
                    offset: new AMap.Pixel(-16, -13), //相对于基点的位置
                    icon: new AMap.Icon({
                        size: new AMap.Size(40, 40),  //图标大小
                        image: "../../resources/img/stop.png",
                        imageOffset: new AMap.Pixel(0, 0)
                    })
                });
                var theTime = parseInt(timestop[i]/1000);// 秒
                var theTime1 = 0;// 分
                var theTime2 = 0;// 小时
                if(theTime > 60) {
                    theTime1 = parseInt(theTime/60);
                    theTime = parseInt(theTime%60);
                        if(theTime1 > 60) {
                        theTime2 = parseInt(theTime1/60);
                        theTime1 = parseInt(theTime1%60);
                        }
                }
                    var result = ""+parseInt(theTime)+"秒";
                    if(theTime1 > 0) {
                    result = ""+parseInt(theTime1)+"分"+result;
                    }
                    if(theTime2 > 0) {
                    result = ""+parseInt(theTime2)+"小时"+result;
                    }
                var arrstop = [];
                arrstop.push("停车点:" + i);
                arrstop.push("停车时间:" + result);
                arrstop.push("开始时间:" + startTimestop[i]);
                arrstop.push("结束时间:"+ endTimestop[i]);              
            marker2.content = arrstop.join("<br/>");
            marker2.on('click', trackPlayback.markerClick);
            marker2.setMap(map);
            }
            map.setFitView();
        },
        markerStop: function(index){
            if(markerStopFlag){
                markerStops.setMap(null);
            };
            markerStops = new AMap.Marker({
                position: [(longtitudeStop2[index - 1]),(latitudeStop2[index - 1])],
                //position: [(longtitudeStop2[index - 1]/1000000),(latitudeStop2[index - 1]/1000000)],
                draggable: true,
                cursor: 'move',
                icon: new AMap.Icon({
                    size: new AMap.Size(40, 40),  //图标大小
                    image: "../../resources/img/stop.png",
                    imageOffset: new AMap.Pixel(0, 0)
                })
            });
            markerStops.setMap(map);
            markerStops.setAnimation('AMAP_ANIMATION_BOUNCE');
            markerStopFlag = true; 
        },
        markerClick: function(e){
            infoWindow2.setContent(e.target.content);
            infoWindow2.open(map, e.target.getPosition());
        },
        showAddFencePage: function(){
            setTimeout(function(){$("#addFencePage").modal("show");},200);
        },
        // 编写事件响应函数
        startAnimation: function(){
            goDamoIndex = 0;
            $("#playIcon").attr("class", "resultIcon playIcon");
            //clears();
            selIndex = 0;
            trIndex = 0;
            $("#GPSData .dataTables_scrollBody").scrollTop(0);
            $("#gpsTable tbody tr").removeClass("tableSelected");
            $("#gpsTable tbody tr:nth-child(1)").addClass("tableSelected");
            //重置播放按钮
            $("#playIcon").attr({"data-toggle" : "tooltip","data-placement" : "top","data-original-title" : "播放"});
            markerMovingControl.restart();
        },
        /*
         * 前进
        */
        FFAnimation: function(){
            advance_retreat = true;
            markerMovingControl.FF();
        },
        /*
         * 后退
        */
        retreatAnimation: function(){
            flagBack = true;
            advance_retreat = true;
            markerMovingControl.retreat();
        },
        /*
         * 播放和停止
        */
        clears: function(){
            marker,lineArr = [],paths;
            markerMovingControl;
            longtitudestop = [];
            latitudestop = [];
            timestop = [];
            startTimestop = [];
            endTimestop = [];
            latitudeStop2 = [];
            longtitudeStop2 = [];
            selIndex = 0;
            trIndex = 0;
            listIndex = 0;
            flagBackGo = false;
            nextIndexs = 1;
            open = 1;
            flagBack = false;
            tableSet = [];
            tableSetStop = [];
            tableSetCopy = [];
            alarmTableSet = [];
            alarmTableSetCopy = [];
            alarmIndex = 1;
            tableIndex = 1;
            stoptableIndex = 1;
            advance_retreat = false;
            speedM = [];
            timeM = [];
            mileageM = [];
            mileageMax = 0;
            speedMax = 0;
            timeMax = 0;
        },
        //查询
        query:function(){
            stopDataFlag = true;
            //timeArray
            var hasData = false;
            var carID = $("#citySel").val();
            if(carID == "" || carID == undefined){
                layer.msg("请选择车牌号！", {move: false});
                return false;
            };
            var sTime = parseInt($("#startTime").val().substring(0,10).replace(/\-/g,""));
            var eTime = parseInt($("#endTime").val().substring(0,10).replace(/\-/g,""));
            for(var i = 0; i < timeArray.length; i++){
                if(parseInt(timeArray[i][0]) >= sTime && parseInt(timeArray[i][0]) <= eTime) {
                    hasData = true;
                    playState = true;
                }
            };
            if(!hasData){
                layer.msg("该时间段无数据！", {move: false});
                hasData = false;
                playState = false;
                return false;
            };
            trackPlayback.clears();
            layer.load(2);  
            map.clearMap();
            trackPlayback.getHistory();
            trackPlayback.trackMap();
            //trackPlayback.startAnimation();
        },
        continueAnimation: function(){
            if ($("#playIcon").hasClass("playIcon")) {
                if(playState){
                     $("#playIcon").attr("class","resultIcon suspendedIcon");
                     markerMovingControl.move();
                     open = 0;
                     $("#playIcon").removeAttr("data-original-title data-placement data-toggle");
                     $("#playIcon").attr({"data-toggle" : "tooltip","data-placement" : "top","data-original-title" : "暂停"});
                }else{
                    layer.msg("请先查询数据！", {move: false});
                };
            } else {
                $("#playIcon").attr("class", "resultIcon playIcon");
                $("#playIcon").removeAttr("data-original-title data-placement data-toggle");
                $("#playIcon").attr({"data-toggle" : "tooltip","data-placement" : "top","data-original-title" : "播放"});
                markerMovingControl.stop();
                open = 1;
            }
        },
        UnixToDate: function(unixTime, isFull, timeZone) {
            if (typeof (timeZone) == 'number') {
                unixTime = parseInt(unixTime) + parseInt(timeZone) * 60 * 60;
            }
            var time = new Date(unixTime * 1000);
            var ymdhis = "";
            ymdhis += time.getUTCFullYear() + "-";
            ymdhis += (time.getMonth() + 1) + "-";
            ymdhis += time.getDate();
            if (isFull === true) {
                ymdhis += " " + time.getHours() + ":";
                ymdhis += time.getMinutes() + ":";
                ymdhis += time.getSeconds();
            }
            return ymdhis;
        },
        getHistory: function(){
            var vehicleId = $("#savePid").attr("value");
            var startTime = $("#startTime").val();
            var endTime = $("#endTime").val();
            $.ajax({
                type: "POST",
                url: "/clbs/v/monitoring/getHistoryData",
                data: {
                    "vehicleId": vehicleId,
                    "startTime": startTime,
                    "endTime": endTime
                },
                dataType: "json",
                async: true,
                beforeSend: function () {
                    layer.load(2);
                },
                success: function (data) {
                	msgArray = [];
                	stopMsgArray = [];
                	/*msgState = false;
                	stopMsgState = false;*/
                    layer.closeAll('loading'); 
                    tableIndex = 1;
                    stoptableIndex = 1;
                    alarmIndex = 1;
                    if (data.success) {
                        alarmTableSet = [];
                        tableSet = [];
                        //tableSetStop = [];
                        alarmTableSetCopy = [];
                        tableSetCopy = [];
                        var latitude;
                        var longtitude;
                        var positionals = $.parseJSON(data.msg);
                        var stop = positionals.stops;
                        for(var j = 0;j<stop.length;j++){
                            if(stop[j].stopTime>300000 && stop[j].positional.latitude != 0 && stop[j].positional.latitude != undefined){
                                 var positional = stop[j].positional;//停车点
                                /* latitude = positional.latitude/1000000;
                                 longtitude = positional.longtitude/1000000;*/
                                latitude = positional.latitude;
                                longtitude = positional.longtitude;
                                 timestop.push(stop[j].stopTime);//停车时间
                                 longtitudestop.push(longtitude);
                                 latitudestop.push(latitude);
                                 startTimestop.push(stop[j].startTime);
                                 endTimestop.push(stop[j].endTime);
                            } 
                        }
                        var msg = positionals.resultful;
                        var len = msg.length;
                        var runStateLength = 0;
                        //runValue_num = len;//行驶数据长度赋值给变量
                        if (parseInt(len) > 0) {
                            $("#addFence").attr("disabled", false);
                        } else {
                            $("#addFence").attr("disabled", true);
                        }
                        var position;
                        var set;
                        var setstop;
                        var acc;
                        var lineStatus;
                        var listSpeed;
                        var angle;
                        var direction = '';
                        var latitude2 = 0;
                        var longtitude2 = 0;
                        var alarmSet;
                        var groups = positionals.groups;
                        var msg_lng_lat = [];//存地理经纬度
                        index_lng_lat = 0;
                        for (var i = 0; i < len; i++) {
                            position = msg[i];
                            acc = position.status;
                            if(acc.length == 32){
                                acc = acc.substring(18,19);
                            }else{
                                acc = position.status & 1;
                            }
                            listSpeed = position.speed / 10;
                            latitude = position.latitude;//纬度
                            longtitude = position.longtitude;//经度
                            var timeTwo = trackPlayback.UnixToDate(position.vtime,true);
                            index_lng_lat++;
                            if (listSpeed != 0) {
                                if (latitude != 0 && longtitude != 0) {
                                    if (latitude != 0 && longtitude != 0) {
                                       // longtitude /= 1000000;
                                        //latitude /= 1000000;
                                        var pasla = Math.abs(parseFloat(latitude2)- parseFloat(latitude));
                                        var paslo = Math.abs(parseFloat(longtitude2) - parseFloat(longtitude));
                                        if (pasla<0.000095 && paslo < 0.000095) {
                                            latitude = (parseFloat(latitude) + 0.00015)+"";
                                            longtitude = (parseFloat(longtitude) + 0.00015) +"";
                                           // latitude += 0.0001;
                                            // longtitude += 0.0001;
                                            //longtitude = Math.formatFloat(longtitude, 6);
                                            latitude2 = latitude;
                                            longtitude2 = longtitude;
                                        } else {
                                            latitude2 = latitude;
                                            longtitude2 = longtitude;
                                        };
                                        
                                        //添加
                                        lineArr.push([longtitude, latitude]);
                                        speedM.push(parseInt(position.speed)/10);                        
                                        timeM.push(timeTwo);
                                        if(position.gpsMile >= 0){
                                             mileageM.push(parseInt(position.gpsMile)/10);  
                                        }else{
                                            mileageM.push("0");
                                        }
                                       
                                    }
                                    lineStatus = '在线行驶';
                                } else {
                                    if (latitude == 0 && longtitude == 0) {
                                        lineStatus = '未定位';
                                    } else {
                                        lineStatus = '在线停车';
                                    }
                                }
                                angle = position.angle;
                                direction = '';
                                if ((0 <= angle && 22.5 >= angle) || (337.5 < angle && angle <= 360)) {
                                    direction = '北';
                                } else if (22.5 < angle && 67.5 >= angle) {
                                    direction = '东北';
                                } else if (67.5 < angle && 112.5 >= angle) {
                                    direction = '东';
                                } else if (112.5 < angle && 157.5 >= angle) {
                                    direction = '东南';
                                } else if (157.5 < angle && 202.5 >= angle) {
                                    direction = '南';
                                } else if (202.5 < angle && 247.5 >= angle) {
                                    direction = '西南';
                                } else if (247.5 < angle && 292.5 >= angle) {
                                    direction = '西';
                                } else if (292.5 < angle && 337.5 >= angle) {
                                    direction = '西北';
                                } else {
                                    direction = '未知数据';
                                }
                                var alarmSign = position.alarm;
                                if (alarmSign != 0) {
                                    var alarmStr = '';
                                    if ((alarmSign & 0x01) != 0) {
                                        alarmStr += "紧急报警,";
                                    }
                                    if ((alarmSign & 0x02) != 0) {
                                        alarmStr += "超速报警,";
                                    }
                                    if ((alarmSign & 0x04) != 0) {
                                        alarmStr += "疲劳驾驶,";
                                    }
                                    if ((alarmSign & 0x08) != 0) {
                                        alarmStr += "危险预警,";
                                    }
                                    if ((alarmSign & 0x10) != 0) {
                                        alarmStr += "GNSS模块发生故障,";
                                    }
                                    if ((alarmSign & 0x20) != 0) {
                                        alarmStr += "GNSS天线未接或被剪断,";
                                    }
                                    if ((alarmSign & 0x40) != 0) {
                                        alarmStr += "GNSS天线短路,";
                                    }
                                    if ((alarmSign & 0x80) != 0) {
                                        alarmStr += "终端主电源欠压,";
                                    }
                                    if ((alarmSign & 0x100) != 0) {
                                        alarmStr += "终端主电源掉电,";
                                    }
                                    if ((alarmSign & 0x200) != 0) {
                                        alarmStr += "终端LCD或显示器故障,";
                                    }
                                    if ((alarmSign & 0x400) != 0) {
                                        alarmStr += "TTS模块故障,";
                                    }
                                    if ((alarmSign & 0x800) != 0) {
                                        alarmStr += "摄像头故障,";
                                    }
                                    if ((alarmSign & 0x1000) != 0) {
                                        alarmStr += "道路运输证IC卡模块故障,";
                                    }
                                    if ((alarmSign & 0x2000) != 0) {
                                        alarmStr += "超速预警,";
                                    }
                                    if ((alarmSign & 0x4000) != 0) {
                                        alarmStr += "疲劳驾驶预警,";
                                    }
                                    if ((alarmSign & 0x40000) != 0) {
                                        alarmStr += "当天累计驾驶超时,";
                                    }
                                    if ((alarmSign & 0x80000) != 0) {
                                        alarmStr += "超时停车,";
                                    }
                                    if ((alarmSign & 0x100000) != 0) {
                                        alarmStr += "进出区域,";
                                    }
                                    if ((alarmSign & 0x200000) != 0) {
                                        alarmStr += "进出路线,";
                                    }
                                    if ((alarmSign & 0x400000) != 0) {
                                        alarmStr += "路段行驶时间不足/过长,";
                                    }
                                    if ((alarmSign & 0x800000) != 0) {
                                        alarmStr += "路线偏离报警,";
                                    }
                                    if ((alarmSign & 0x1000000) != 0) {
                                        alarmStr += "车辆VSS故障,";
                                    }
                                    if ((alarmSign & 0x2000000) != 0) {
                                        alarmStr += "车辆油量异常,";
                                    }
                                    if ((alarmSign & 0x4000000) != 0) {
                                        alarmStr += "车辆被盗,";
                                    }
                                    if ((alarmSign & 0x8000000) != 0) {
                                        alarmStr += "车辆非法点火,";
                                    }
                                    if ((alarmSign & 0x10000000) != 0) {
                                        alarmStr += "车辆非法位移,";
                                    }
                                    if ((alarmSign & 0x20000000) != 0) {
                                        alarmStr += "碰撞预警,";
                                    }
                                    if ((alarmSign & 0x40000000) != 0) {
                                        alarmStr += "侧翻预警,";
                                    }
                                    if ((alarmSign & 0x80000000) != 0) {
                                        alarmStr += "非法开门报警,";
                                    }
                                    if (alarmStr != '') {
                                        alarmStr = alarmStr.substring(0, alarmStr.length - 1);
                                    }
                                    alarmSet = [alarmIndex, ""];
                                    alarmIndex++;
                                    alarmTableSet.push(alarmSet);
                                } else {
                                    alarmTableSet.push(undefined);
                                }
                                var timeOte = trackPlayback.formatDate(timeTwo,"yyyy-MM-dd HH:mm:ss");
                                set = [0, position.plateNumber, timeOte, groups == undefined ? '未分组' : groups, lineStatus, acc == 0 ? "关" : "开", listSpeed.toFixed(2), direction, position.gpsMile >0 ? (position.gpsMile/10).toFixed(1) : "0",
                                    (position.satelliteNumber==undefined ? '0' : position.satelliteNumber),"加载中..."];
                                if (lineStatus == '在线行驶') {
                                    set[0] = tableIndex++;
                                    runStateLength++;
                                    msg_lng_lat.push([longtitude,latitude]);
                                    tableSet.push(set);
                                }
                            }
                            if(index_lng_lat == len){
                            	runValue_num = runStateLength;
                            };
                            if(msg_lng_lat.length == 20 || index_lng_lat == len){
                            	backAddressMsg1(msg_lng_lat,trackPlayback.goBackMsg);
                            	msg_lng_lat = [];
                            };
                        }
                        $("#allMileage").text((mileageM[mileageM.length-1] - mileageM[0]).toFixed(2) + "km");
                        //行驶时间
                        var sta_str = timeM[0];
                        var end_str = timeM[timeM.length-1];
                        var end_date = (new Date(end_str.replace(/-/g, "/"))).getTime();
                        var sra_date = (new Date(sta_str.replace(/-/g, "/"))).getTime();
                        var num = (end_date-sra_date);
                        var theTime = parseInt(num/1000);// 秒
                        var theTime1 = 0;// 分
                        var theTime2 = 0;// 小时
                        if(theTime > 60) {
                            theTime1 = parseInt(theTime/60);
                            theTime = parseInt(theTime%60);
                                if(theTime1 > 60) {
                                theTime2 = parseInt(theTime1/60);
                                theTime1 = parseInt(theTime1%60);
                                }
                        };
                        var result = ""+parseInt(theTime)+"秒";
                        if(theTime1 > 0) {
                        result = ""+parseInt(theTime1)+"分"+result;
                        };
                        if(theTime2 > 0) {
                        result = ""+parseInt(theTime2)+"小时"+result;
                        };
                        timeMax = result;
                        $("#allTime").text(timeMax);
                        $("#maxSpeend").text(Math.max.apply(Math, speedM).toFixed(2) + "km/h");
                        var msgstop = positionals.stop;
                        var lenstop = msgstop.length;
                        tableSetstop = [];
                        var stop_lng_lat = [];
                        var stopIndex = 0;
                        stopValue_num = lenstop;
                        for(var i = 0;i<lenstop;i++){
                            var msgstops = msgstop[i];
                            var stopStatus;
                            var stopacc = msgstops.status & 1;
                            latitudeStop2.push(msgstops.latitude);
                            longtitudeStop2.push(msgstops.longtitude);
                             if (msgstops.latitude == 0 && msgstops.longtitude == 0) {
                                 stopStatus = '未定位';
                             } else {
                                 stopStatus = '在线停车';
                             }
                             stopangle = msgstops.angle;
                             stopdirection = '';
                             if ((0 <= stopangle && 22.5 >= stopangle) || (337.5 < stopangle && stopangle <= 360)) {
                                 stopdirection = '北';
                             } else if (22.5 < stopangle && 67.5 >= stopangle) {
                                 stopdirection = '东北';
                             } else if (67.5 < stopangle && 112.5 >= stopangle) {
                                 stopdirection = '东';
                             } else if (112.5 < stopangle && 157.5 >= stopangle) {
                                 stopdirection = '东南';
                             } else if (157.5 < stopangle && 202.5 >= stopangle) {
                                 stopdirection = '南';
                             } else if (202.5 < stopangle && 247.5 >= stopangle) {
                                 stopdirection = '西南';
                             } else if (247.5 < stopangle && 292.5 >= stopangle) {
                                 stopdirection = '西';
                             } else if (292.5 < stopangle && 337.5 >= stopangle) {
                                 stopdirection = '西北';
                             } else {
                                 stopdirection = '未知数据';
                             }
                             stopsatelliteNumber = position.satelliteNumber;
                             if(msgstops.satelliteNumber == undefined || msgstops.satelliteNumber == 0){
                                 stopsatelliteNumber = 0;
                             }
                            var timeTee = trackPlayback.UnixToDate(msgstops.vtime,true);
                            var timeTte = trackPlayback.formatDate(timeTee,"yyyy-MM-dd HH:mm:ss");
                            setstop = [0, msgstops.plateNumber, timeTte, groups == undefined ? '未分组' : groups, stopStatus, stopacc == 0 ? "关" : "开", stopdirection,  msgstops.gpsMile >0 ?  (msgstops.gpsMile/10).toFixed(1) : "0",
                                    stopsatelliteNumber, '加载中...'];
                            setstop[0] = stoptableIndex++;
                            stopIndex++;
                            if(msgstop[i].longtitude != "0.0" && msgstop[i].latitude != "0.0"){
                            	stop_lng_lat.push([msgstop[i].longtitude,msgstop[i].latitude]);
                            }else{
                            	stop_lng_lat.push(["124.411991","29.043817"]);
                            };
                            /*if(stopIndex == lenstop){
                            	stopMsgState = true;
                            };*/
                            if(stop_lng_lat.length == 20 || stopIndex == lenstop){
                            	backAddressMsg1(stop_lng_lat,trackPlayback.goBackStopMag);
                            	stop_lng_lat = [];
                            }
                            tableSetstop.push(setstop);
                        }
                        trackPlayback.getTable('#gpsTable', tableSet);
                        trackPlayback.getTable('#gpsTable2', tableSetstop);
                    }
                    //计算高度赋值
                    $("#MapContainer").css({
                        "height" : (lmapHeight-200) + "px"
                    });
                    //表头宽度设置
                    var tabWidth = $("#myTab").width();
                    var tabPercent = ((tabWidth - 17)/tabWidth)*100;
                    $(".dataTables_scrollHead").css("width",tabPercent + "%");
                    //列表拖动
                    $("#dragDIV").mousedown(function(e){
                        tableHeight = $(".trackPlaybackTable .dataTables_scrollBody").height();
                        mapHeight = $("#MapContainer").height();
                        els = e.clientY;
                        $(document).bind("mousemove", trackPlayback.mouseMove).bind("mouseup", trackPlayback.mouseUp);
                        e.stopPropagation();
                    })
                    //表点击操作得到经纬度
                    $("#gpsTable tbody tr").bind("click",function(){
                        carLng = $(this).children("td:nth-child(11)").text();
                        carLat = $(this).children("td:nth-child(12)").text();
                        var nowIndex = parseInt($(this).children("td:nth-child(1)").text());
                        selIndex = nowIndex - 1;
                        listIndex = nowIndex - 1;
                        if(nowIndex >= 4){
                            trIndex = nowIndex - 4;
                        }else{
                            trIndex = 0; 
                        }
                        btnFlag = true;
                        markerMovingControl.skip();
                    });
                    $("#playCarListIcon").show();
                    //伸缩
                    var oldMHeight;
                    var oldTHeight;
                    $("#scalingBtn").unbind().bind("click",function(){
                        if($(this).hasClass("fa-chevron-down")){
                            oldMHeight = $("#MapContainer").height();
                            oldTHeight = $(".trackPlaybackTable .dataTables_scrollBody").height();
                            $(this).attr("class","fa  fa-chevron-up")
                            var mapHeight = windowHeight - headerHeight - titleHeight - demoHeight - 20;
                            $("#MapContainer").css({
                                "height" : mapHeight + "px"
                            });
                            $(".trackPlaybackTable .dataTables_scrollBody").css({
                                "height":"0px"
                            });
                        }else{
                            $(this).attr("class","fa  fa-chevron-down");
                            $("#MapContainer").css({
                                "height" : oldMHeight + "px"
                            });
                            $(".trackPlaybackTable .dataTables_scrollBody").css({
                                "height": oldTHeight + "px"
                            });
                        }
                    });
                    trackPlayback.trackMap();
                    trackPlayback.startAnimation();
                }
            });
        },
        //返回行驶地址信息
        goBackMsg: function(GeocoderResult){
        	for(var i = 0, msgLength = GeocoderResult.regeocodes.length; i < msgLength;i++){
        		msgArray.push(GeocoderResult.regeocodes[i].formattedAddress);
        	};
        	var index = 30;
        	if(msgArray.length == runValue_num){
        		var $gpsTableTd = $("#gpsTable tbody");
        		for(var j = 0, length = 30; j < length; j++){
        			$gpsTableTd.children("tr:nth-child("+ (j+1) +")").children("td:nth-child(11)").text(msgArray[j]);
        		};
        		var runValue = setInterval(function(){
        			if(index < msgArray.length){
            	    	for(var s = index; s < index + 10; s++){
            	    		$gpsTableTd.children("tr:nth-child("+ (s+1) +")").children("td:nth-child(11)").text(msgArray[s]);
                	    };
                	    index = index + 10;
    				}else{
    					clearInterval(runValue);
    				}   
        		},200)
        	}
        },
        //返回停止地址信息
        goBackStopMag:function(GeocoderResult){
        	for(var i = 0, msgLength = GeocoderResult.regeocodes.length; i < msgLength;i++){
        		if(GeocoderResult.regeocodes[i].formattedAddress != ""){
        			stopMsgArray.push(GeocoderResult.regeocodes[i].formattedAddress);
        		}else{
        			stopMsgArray.push("未定位");
        		}
        	}
        	var indexStop = 30;
        	if(stopValue_num == stopMsgArray.length){
        		var $gpsTableOneTd = $("#gpsTable2 tbody");
        		for(var j = 0, length = 30; j < length; j++){
        			$gpsTableOneTd.children("tr:nth-child("+ (j+1) +")").children("td:nth-child(10)").text(stopMsgArray[j]);
        		}
        		var stopValue = setInterval(function(){
        			if(indexStop < stopMsgArray.length){
            	    	for(var s = indexStop; s < indexStop + 10; s++){
            	    		$gpsTableOneTd.children("tr:nth-child("+ (s+1) +")").children("td:nth-child(10)").text(stopMsgArray[s]);
                	    };
                	    indexStop = indexStop + 10;
    				} else{
    					clearInterval(stopValue);
    				}   
        		},200);
        	}
        },
        formatDate:function(date, format) {
        /*if (!date) return;
        if (!format) format = "yyyy-MM-dd";
        switch(typeof date) {
            case "string":
                date = new Date(date.replace(/-/, "/"));
                break;
            case "number":
                date = new Date(date);
                break;
        }
        if (!date instanceof Date) return;
        var dict = {
            "yyyy": date.getFullYear(),
            "M": date.getMonth() + 1,
            "d": date.getDate(),
            "H": date.getHours(),
            "m": date.getMinutes(),
            "s": date.getSeconds(),
            "MM": ("" + (date.getMonth() + 101)).substr(1),
            "dd": ("" + (date.getDate() + 100)).substr(1),
            "HH": ("" + (date.getHours() + 100)).substr(1),
            "mm": ("" + (date.getMinutes() + 100)).substr(1),
            "ss": ("" + (date.getSeconds() + 100)).substr(1)
        };
        return format.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function() {
            return dict[arguments[0]];
        });*/
        if (!date) return;
        var dateSo = date.split(" ");
        var dateSMM = (dateSo[0].split("-"))[1] < 10 ? "0" + (dateSo[0].split("-"))[1] : (dateSo[0].split("-"))[1];
        var dateSdd = (dateSo[0].split("-"))[2] < 10 ? "0" + (dateSo[0].split("-"))[2] : (dateSo[0].split("-"))[2];
        var dateSHH = (dateSo[1].split(":"))[0] < 10 ? "0" + (dateSo[1].split(":"))[0] : (dateSo[1].split(":"))[0];
        var dateSmm = (dateSo[1].split(":"))[1] < 10 ? "0" + (dateSo[1].split(":"))[1] : (dateSo[1].split(":"))[1];
        var dateSss = (dateSo[1].split(":"))[2] < 10 ? "0" + (dateSo[1].split(":"))[2] : (dateSo[1].split(":"))[2];
            return (dateSo[0].split("-"))[0] + "-" + dateSMM + "-" + dateSdd + " " + dateSHH + ":" + dateSmm + ":" + dateSss
    },
    getActiveDate: function(vehicleId,nowMonth,afterMonth){
        	var dataTime = nowMonth.split("-")[0] + nowMonth.split("-")[1];
            $.ajax({
                type: "POST",
                url: "/clbs/v/monitoring/getActiveDate",
                data: {
                    "vehicleId": vehicleId,
                    "nowMonth": nowMonth,
                    "nextMonth": afterMonth
                },
                dataType: "json",
                async: true,
                beforeSend: function () {
                    layer.load(2);
                },
                success: function (data) {
                    layer.closeAll('loading'); 
                    timeArray = [];
                    stopArray = [];
                    if (data.success) {
                        //车的详细信息
                        var msg = $.parseJSON(data.msg);
                        var activeDate = msg.date;
                        var mileage = msg.dailyMile;
                        for(var i = 0; i < activeDate.length; i++){
                        	var time = dataTime + (parseInt(activeDate[i] + 1) < 10 ? "0" + parseInt(activeDate[i] + 1) : parseInt(activeDate[i] + 1));
                            timeArray.push([time,time,(mileage[i]/10).toFixed(1)]);
                        }
                    }
                    $('.calendar3').html("");
                    $('.calendar3').calendar({
                        highlightRange: timeArray,
                        stopHighlightRange: stopArray/*[[20161105,20161105]]*/
                    });
                    $('.calendar3 tbody td').each(function(){
                        if($(this).hasClass("widget-disabled")){
                            $(this).removeClass("widget-highlight").removeClass("widget-stopHighlight");
                            $(this).children("span").children("span.mileageList").text("-");
                        }
                    })
                    isFlag = false;
                }
            });
        },
        getTable:function(table, data){
            table = $(table).DataTable({
                "destroy": true,
                "dom": 'itprl',// 自定义显示项
                "scrollX": true,
                "scrollY": 198,
                "data": data,
                "lengthChange": false,// 是否允许用户自定义显示数量
                "bPaginate": false, // 翻页功能
                "bFilter": false, // 列筛序功能
                "searching": false,// 本地搜索
                "ordering": false, // 排序功能
                "Info": false,// 页脚信息
                "autoWidth": false,// 自动宽度
                "stripeClasses":[],
                "oLanguage": {// 国际语言转化
                    "oAria": {
                        "sSortAscending": " - click/return to sort ascending",
                        "sSortDescending": " - click/return to sort descending"
                    },
                    "sLengthMenu": "显示 _MENU_ 记录",
                    "sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录。",
                    "sZeroRecords": "没有查到您要找的数据，请再次确认一下您的查询条件吧",
                    "sEmptyTable": "未有相关数据",
                    "sLoadingRecords": "正在加载数据-请等待...",
                    "sInfoEmpty": "当前显示0到0条，共0条记录",
                    "sInfoFiltered": "（数据库中共为 _MAX_ 条记录）",
                    "sProcessing": "<img src='../resources/user_share/row_details/select2-spinner.gif'/> 正在加载数据...",
                    "sSearch": "模糊查询：",
                    "sUrl": "",
                    "oPaginate": {
                        "sFirst": "首页",
                        "sPrevious": " 上一页 ",
                        "sNext": " 下一页 ",
                        "sLast": " 尾页 "
                    }
                },
                "order": [
                    [0, null]
                ],// 第一列排序图标改为默认

            });
            table.on('order.dt search.dt', function () {
                table.column(0, {
                    search: 'applied',
                    order: 'applied'
                }).nodes().each(function (cell, i) {
                    cell.innerHTML = i + 1;
                });
            }).draw();
        },
        tableStopData: function(){
        	setTimeout(function(){
        		$("#stopData .dataTables_scrollBody").scrollTop(0);
        	},200);
            //表头宽度设置
            if(stopDataFlag){
                setTimeout(function(){
                    /*trackPlayback.getTable('#gpsTable2', tableSetstop);
                    var tabWidth = $("#myTab").width();
                    var tabPercent = ((tabWidth - 17)/tabWidth)*100;
                    $(".dataTables_scrollHead").css("width",tabPercent + "%");*/
                    //停车数据点击获取数据
                    $("#gpsTable2 tbody tr").bind("click",function(){
                        $("#gpsTable2 tbody tr").removeClass("tableSelected");
                        $(this).addClass("tableSelected");
                        var stopIndex = parseInt($(this).children("td:nth-child(1)").text());
                        trackPlayback.markerStop(stopIndex);
                    });
                },200);
                stopDataFlag = false;;
            }
        },
        ajaxDataFilter: function(treeId, parentNode, responseData){
            if (responseData) {
              for(var i =0; i < responseData.length; i++) {
                  if(responseData[i].iconSkin != "assignmentSkin")
                  responseData[i].open = true;
              }
            }
            return responseData;
        },
        zTreeBeforeClick: function(){
            return true;
        },
        zTreeOnClick: function(event, treeId, treeNode){
        	nowMonth = nowDate.getFullYear() + "-" + (parseInt(nowDate.getMonth() + 1) < 10 ? "0" + parseInt(nowDate.getMonth() + 1):parseInt(nowDate.getMonth() + 1)) + "-01";
            afterMonth = nowDate.getFullYear() + "-" + (parseInt(nowDate.getMonth() + 2) < 10? "0" + parseInt(nowDate.getMonth() + 2):parseInt(nowDate.getMonth() + 2)) + "-01";
            if(treeNode.iconSkin == "vehicleSkin"){
                var id = treeNode.id;
                $("#savePid").attr("value", id);
                var name = treeNode.name;
                $("#citySel").val(name);
                var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
                var nodes = treeObj.getCheckedNodes(true);
                for (var i=0, l=nodes.length; i < l; i++) {
                    treeObj.checkNode(nodes[i], false, true);
                }
                treeObj.selectNode(treeNode,false,true);
                treeObj.checkNode(treeNode, true, true);
                trackPlayback.getActiveDate(id,nowMonth,afterMonth);
            }
        },
        zTreeBeforeCheck: function(treeId, treeNode){
            var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
            var nodes = treeObj.getCheckedNodes(true);
            for(var i = 0; i < nodes.length; i++){
                treeObj.checkNode(nodes[i], false, true);
            }
        },
        zTreeOnAsyncSuccess: function(event, treeId, treeNode, msg){
            var vUuid = $('#vid').val();
            if(vUuid != ""){
                var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
                var allNode = treeObj.getNodes();
                var node = treeObj.getNodesByParam("id",vUuid, null);
                treeObj.checkNode(node[0], true, true);
                var cityObj = $("#citySel");
                cityObj.val(node[0].name);
                //var nowMonthNew = nowMonth + "-" + 1;
                //var afterMonthNew = afterMonth + "-" + 1;
                trackPlayback.getActiveDate(vUuid,nowMonth,afterMonth);
            }
        },
        onCheck: function(e, treeId, treeNode){
            nowMonth = nowDate.getFullYear() + "-" + (parseInt(nowDate.getMonth() + 1) < 10 ? "0" + parseInt(nowDate.getMonth() + 1):parseInt(nowDate.getMonth() + 1)) + "-01";
            afterMonth = nowDate.getFullYear() + "-" + (parseInt(nowDate.getMonth() + 2) < 10? "0" + parseInt(nowDate.getMonth() + 2):parseInt(nowDate.getMonth() + 2)) + "-01";
            var zTree = $.fn.zTree.getZTreeObj("treeDemo"), nodes = zTree
                .getCheckedNodes(true), v = "";
            var carPid = nodes[0].id;
            zTree.selectNode(treeNode,false,true);
            $("#savePid").attr("value", carPid);
            v = nodes[0].name;
            var cityObj = $("#citySel");
            cityObj.val(v);
            $("#menuContent").hide();
            trackPlayback.getActiveDate(carPid,nowMonth,afterMonth);
        },
        showMenu: function(){
            var cityObj = $("#citySel");
            $("#menuContent").css({
                left: 15 + "px",
                top: cityObj.outerHeight() + "px"
            }).slideDown("fast");

            $("body").bind("mousedown", trackPlayback.onBodyDown);
        },
        hideMenu: function(){
            $("#menuContent").fadeOut("fast");
            $("body").unbind("mousedown", trackPlayback.onBodyDown);
        },
        onBodyDown: function(event){
            if (!(event.target.id == "menuBtn" || event.target.id == "citySel"
                || event.target.id == "menuContent" || $(event.target).parents(
                    "#menuContent").length > 0)) {
                trackPlayback.hideMenu();
            }
        },
        goHidden: function(){
            $("#content-left").hide();
            $("#content-right").attr("class", "col-md-12 content-right");
            $("#content-right").css("width","100%");
            $("#goShow").show();
            //点击隐藏轨迹回放查询
           $("#MapContainer").css({
                "height" : (initialMapH - /*50*/5) +  "px"
            });
           $(".trackPlaybackTable .dataTables_scrollBody").css({
                "height": 0 + "px"
            });
        },
        goShow: function(){
            if($(".dataTables_scrollBody").length == 0){
                $("#MapContainer").css({
                    "height" : initialMapH +  "px"
                });
                $(".trackPlaybackTable .dataTables_scrollBody").css({
                    "height": 0 + "px"
                });
            }else{
                $("#MapContainer").css({
                    "height" : (initialMapH - 200) +  "px"
                });
                $(".trackPlaybackTable .dataTables_scrollBody").css({
                    "height": 151 + "px"
                });
            }
            $("#content-left").show();
            $("#content-right").attr("class", "col-md-9 content-right");
            if ($(".sidebar").hasClass("sidebar-toggle")) {
                $("#content-right").css({
                    "width":100-newwidth + "%"
                });
                $("#content-left").css({
                    "width":newwidth + "%"
                });
            }else{
                $("#content-right").css({
                    "width":"75%"
                });
                $("#content-left").css({
                    "width":"25%"
                });
            }
            $("#goShow").hide();
        },
        getHistory1: function(){
            var pointSeqs = ""; // 点序号
            var longitudes = ""; // 所有的经度
            var latitudes = ""; // 所有的纬度
            
            var vehicleId = $("#savePid").val();
            var startTime = $("#startTime").val();
            var endTime = $("#endTime").val();
            $.ajax({
                type: "POST",
                url: "/clbs/v/monitoring/getHistoryData",
                data: {
                    "vehicleId": vehicleId,
                    "startTime": startTime,
                    "endTime": endTime
                },
                dataType: "json",
                async: false,
                success: function (data) {
                    if (data.success) {
                        var positionals = $.parseJSON(data.msg);
                        var msg = positionals.resultful;
                        var len = msg.length;
                        var position;
                        var latitude;
                        var longtitude;
                        var m = 0;
                        for (var i = 0; i < len; i++) {
                            position = msg[i];
                            latitude = position.latitude;//纬度
                            longtitude = position.longtitude;//经度
                            
                            pointSeqs += (m++) + ",";
                            // longitudes += Math.formatFloat(longtitude/1000000, 6) + ",";
                            // latitudes += Math.formatFloat(latitude/1000000, 6) + ",";
                            longitudes += Math.formatFloat(longtitude, 6) + ",";
                            latitudes += Math.formatFloat(latitude, 6) + ",";
                        }
                        if (pointSeqs.length > 0) {
                            pointSeqs = pointSeqs.substr(0, pointSeqs.length - 1);
                        }
                        if (longitudes.length > 0) {
                            longitudes = longitudes.substr(0, longitudes.length - 1);
                        }
                        if (latitudes.length > 0) {
                            latitudes = latitudes.substr(0, latitudes.length - 1);
                        }
                        $("#pointSeqs").val(pointSeqs);
                        $("#longitudes").val(longitudes);
                        $("#latitudes").val(latitudes);
                    }
                }
            });
        },
        //轨迹
        doSubmits1: function(){
            if(trackPlayback.validate_line()){
                $("#addFenceBtn").attr("disabled", true);
                trackPlayback.getHistory1();
                var pointSeqs = $("#pointSeqs").val();
                var longitudes = $("#longitudes").val();
                var latitudes = $("#latitudes").val();
                if (pointSeqs == "" || longitudes == "" || latitudes == "") {
                    layer.msg("未找到历史轨迹数据！");
                    //$(".cancle").click();
                    return;
                }
                $("#addLineForm").ajaxSubmit(function() {
                    layer.msg("保存成功");
                    $(".cancle").click();
                    $("#addFenceBtn").attr("disabled", false);
                });
            }
        }, 
        //线路添加时验证
        validate_line: function(){
            return  $("#addLineForm").validate({
                rules : {
                    name : {
                        required : true,
                        maxlength : 20
                    },
                    width : {
                        required : true, 
                        maxlength : 10
                    }, 
                    description : {
                        maxlength : 100
                    }
                },
                messages : {
                    name : {
                        required : "不能为空", 
                        maxlength : "长度不超过20"
                    },
                    width : {
                        required : "不能为空", 
                        maxlength : "长度不超过10"
                    }, 
                    description : {
                        maxlength : "长度不超过100"
                    }
                }
            }).form();  
        },
        hideDialog: function(){
            $(".modal-backdrop").hide();
            $("#commonWin").hide();
            trackPlayback.clearErrorMsg();
            trackPlayback.clearLine();
        },
        // 清除错误信息 
        clearErrorMsg : function () {
        	$("label.error").hide();
        	$(".error").removeClass("error");
        },
        // 清空线路
        clearLine : function () {
        	$("#addOrUpdateLineFlag").val("0");
        	$("#lineId").val("");
        	$("#lineName1").val("");
        	$("#lineWidth1").val("");
        	$("#lineDescription1").val("");
            $("#pointSeqs").val("");
            $("#longitudes").val("");
            $("#latitudes").val("");
        }
    }
    $(function(){
    	var map;
    	var playState = false;
    	var stopDataFlag = true;
    	isFlag = false;
        trackPlayback.init();
        //设置最大值
        ScrollBar.maxValue = 40000;
        //初始化
        ScrollBar.Initialize();
        //设置最大值
        ProgressBar.maxValue = 100;
        $("#toggle-left").on("click",trackPlayback.toggleBtn);
        $("#realTimeBtn .mapBtn").on("click",trackPlayback.mapBtnActive);
        $("#realTimeRC").on("click",trackPlayback.realTimeRC);
        $("#query").on("click",trackPlayback.query);
        $("#tableStopData").on("click",trackPlayback.tableStopData);
        $("#citySel").bind('input oninput', function() {
              search_ztree('treeDemo','citySel','vehicle') 
        });
        //IE9
        if(navigator.appName=="Microsoft Internet Explorer" && navigator.appVersion.split(";")[1].replace(/[ ]/g,"")=="MSIE9.0") {
            var search;
            $("#citySel").bind("focus",function(){
                search = setInterval(function(){
                    search_ztree('treeDemo', 'citySel','vehicle');
                },500);
            }).bind("blur",function(){
                clearInterval(search);
            });
        }
        //IE9 end
        $("#goRealTime").mouseover(function(){
            $(this).css({
                "color": "#6dcff6"
            }).children("a").css("color","#6dcff6");
        }).mouseout(function(){
            $(this).css({
                "color" : "#767676"
            }).children("a").css("color","#767676");
        });
        $("#goHidden").on("click",trackPlayback.goHidden);
        $("#goShow").on("click",trackPlayback.goShow);
        $("#setMap").on("click",trackPlayback.satelliteMapSwitching);
        $("#retreatAnimation").on("click",trackPlayback.retreatAnimation);
        $("#playIcon").on("click",trackPlayback.continueAnimation);
        $("#startAnimation").on("click",trackPlayback.startAnimation);
        $("#FFAnimation").on("click",trackPlayback.FFAnimation);
        $("#addFenceBtn").on("click",trackPlayback.doSubmits1);
        $("#hideDialog").on("click",trackPlayback.hideDialog);
    });
})($,window)