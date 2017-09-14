(function(window,$){
    var buildings,satellLayer,realTimeTraffic,map,isTrafficDisplay = true,logoWidth,btnIconWidth,windowWidth,newwidth,els,oldMapHeight,myTabHeight,wHeight,
    tableHeight,mapHeight,newMapHeight,winHeight,headerHeight,dbclickCheckedId,oldDbclickCheckedId;
	var licensePlateInformation;
	var groupIconSkin; 
	var markerListT = [];
	var markerRealTimeT;
	var zoom = 18;
	var requestStrS;
	var cheakNodec=[];
	var realTimeSet = [];
	var alarmSet = [];
	var neverOline=[];
	var searchID = 0;
	var flagM=false;
	var flagR=false;
	var flagN=false;
	var flagA=false;
	var flagS=false;
	var flagO=false;
	var flagNO=false;
	var flagT=false;
	var lineVid=[];
    var zTreeIdJson = {};
    var cheakdiyuealls=[];
    var second=0;
	//地图
    var lineAr = [];
    var lineAs = [];
    var lineAa = [];
    var lineAm = [];
    var lineOs=[];
    var changeMiss=[];
	var diyueall = [];
	var params = [];
	var lineV = [];
	var cluster;
	var fixedPoint = null;//记录双击的全局变量
	var fixedPointPosition = null;
	var flog = true; //第一个点的开关
	var mapVehicleTimeW;
	var mapVehicleTimeQ;
	var markerMap;
	var mapflog;
	var mapVehicleNum;
	var infoWindow;
    //页面增加车辆刷新车样式
    var vnodesIdS;
    var vnoderIdS;
    var vnodeaIdS;
    var vnodelmIdS;
    var vnodespIdS;
    var vnodemIdS;
	var paths = null;
	//实时监控数据加载
	var uptFlag = true;
	var isMapThreeDFlag = true;
	var flagState = false; //table是否能拖动
	var clientX;
	var offsetLeft;
	var scrollWidth;
	var videoHeight;
	var dataTableInit = true;
	var isSame = true;
	var tableIndex = 1;
	var tableListLength = 0;
	var carName;//双击存车名字
	var dengerIndex = 1;//警报条数
	var dengerIsSame = true;
	var dbClickHeighlight = false;
	//ID和类名变量
	var $myTab = $("#myTab");
	var $MapContainer = $("#MapContainer");
	var $panDefLeft = $("#panDefLeft");
	var $contentLeft = $("#content-left");
	var $contentRight = $("#content-right");
	var $sidebar = $(".sidebar");
	var $mainContentWrapper = $(".main-content-wrapper");
	var $thetree = $("#thetree");
	var $realTimeRC = $("#realTimeRC");
	var $goShow = $("#goShow");
	var $showMiss = $("#showMiss");
	var $showRun = $("#showRun");
	var $showStop = $("#showStop");
	var $showAlarm = $("#showAlarm");
	var $missW = $("#missW");
	var $overSpeed = $("#overSpeed");
	var $chooseRun = $("#chooseRun");
	var $chooseNot = $("#chooseNot");
	var $chooseAlam = $("#chooseAlam");
	var $chooseStop = $("#chooseStop");
	var $chooseOverSeep = $("#chooseOverSeep");
	var $online = $("#online");
	var $chooseMiss = $("#chooseMiss");
	var $scrollBar = $("#scrollBar");
	var $mapPaddCon = $(".mapPaddCon");
	var $realTimeVideoReal = $(".realTimeVideoReal");
	var $realTimeStateTableList = $("#realTimeStateTable");
	var $alarmTable = $("#alarmTable");
	var $showAlarmWinMark = $("#showAlarmWinMark");
	var $alarmFlashesSpan = $(".alarmFlashes span");
	var $alarmSoundSpan = $(".alarmSound span");
	var $alarmMsgBox = $("#alarmMsgBox");
	var $alarmSoundFont = $(".alarmSound font");
	var $alarmFlashesFont = $(".alarmFlashes font");
	var $alarmMsgAutoOff = $("#alarmMsgAutoOff");
	var $realTimeState;
	var scrollIndex;
	var alarmNum = 0;
	
	var setting;
	var ztreeStyleDbclick
	
    realTimeMonitoring = {
        init: function(){
            //创建地图
            map = new AMap.Map("MapContainer", {
                resizeEnable: true,
                zoom: 18
            });
            //实例化3D楼块图层
            buildings = new AMap.Buildings();
            // 在map中添加3D楼块图层
            buildings.setMap(map);
            //地图标尺
            var mapScale = AMap.plugin(['AMap.ToolBar','AMap.Scale'],function(){
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
            //实时监控页面高度自适应
            winHeight = $(window).height();
            headerHeight = $("#header").height();
            var tabHeight = $myTab.height();
            var tabContHeight = $("#myTabContent").height();
            //计算后地图高度
            newMapHeight = winHeight - headerHeight - tabHeight - tabContHeight + 34;
            $MapContainer.css({
                "height": newMapHeight + 'px'
            });
            //计算后操作树高度
            var newContLeftH = winHeight - headerHeight;
            $panDefLeft.css({
                "height": newContLeftH + 'px'
            });
            //计算顶部logo相关padding
            logoWidth = $("#header .brand").width();
            btnIconWidth = $("#header .toggle-navigation").width();
            windowWidth = $(window).width();
            newwidth = (logoWidth + btnIconWidth + 46) / windowWidth * 100;
            //左右自适应宽度
            $contentLeft.css({
                "width": newwidth + "%"
            });
            $contentRight.css({
                "width": 100 - newwidth + "%"
            });
            //加载时隐藏left同时计算宽度
            $sidebar.attr("class", "sidebar sidebar-toggle");
            $mainContentWrapper.attr("class","main-content-wrapper main-content-toggle-left");
            //操作树高度自适应
            var identH = $("#IdentificationInfo").height();
            var newTreeH = (winHeight - headerHeight - identH) * 0.85;
            $thetree.css({
                "height" : newTreeH + "px" 
            });
            //视频区域自适应
            var mainContentHeight = $contentLeft.height();
            var adjustHeight = $(".adjust-area").height();
            videoHeight = (mainContentHeight - adjustHeight - 65)/2;
            $(".videoArea").css("height", videoHeight + "px");
            //地图拖动改变大小
            oldMapHeight = $MapContainer.height();
            myTabHeight = $myTab.height();
            wHeight = $(window).height();
            //当范围缩小时触发该方法
            var clickEventListener = map.on('zoomend',realTimeMonitoring.clickEventListener);
            //当拖拽结束时触发该方法
            var clickEventListener2 = map.on('dragend',realTimeMonitoring.clickEventListener2);
            //组织树
            setting = {
                async: {
                    url: "/clbs/m/functionconfig/fence/bindfence/vehicelTree",
                    type: "post",
                    enable: true,
                    autoParam: ["id"],
                    dataType: "json",
                    dataFilter: realTimeMonitoring.ajaxDataFilter
                },
                view: {
                    dblClickExpand: false,
                    nameIsHTML: true,
                    fontCss: setFontCss_ztree
                },
                check: {
                    enable: true,
                    chkStyle: "checkbox"
                },
                data: {
                    simpleData: {
                        enable: true
                    },
                    key: {
                        title: "name"
                    }
                },
                callback: {
                    onClick:realTimeMonitoring.onClickV,
                    onDblClick: realTimeMonitoring.onDbClickV,
                    beforeClick: realTimeMonitoring.zTreeBeforeClick,
                    // beforeCheck: realTimeMonitoring.beforeChecks,
                    onCheck: realTimeMonitoring.onCheckVehicle,
                    onAsyncSuccess: realTimeMonitoring.zTreeOnAsyncSuccess,
                    onExpand: realTimeMonitoring.zTreeOnExpand,
                    onNodeCreated: realTimeMonitoring.zTreeOnNodeCreated,
                }
            };
            setTimeout(function () {
            	$.fn.zTree.init($("#treeDemo"), setting);
            }, 500);

            Array.prototype.isHas = function (a) {
                if (this.length === 0) {
                    return false
                }
                ;
                for (var i = 0; i < this.length; i++) {
                    if (this[i] === a) {
                        return true
                    }
                }
            };

            //数组功能扩展
            Array.prototype.each = function(fn){
                fn = fn || Function.K;
                var a = [];
                var args = Array.prototype.slice.call(arguments, 1);
                for(var i = 0; i < this.length; i++){
                    var res = fn.apply(this,[this[i],i].concat(args));
                    if(res != null) a.push(res);
                }
                return a;
            };
            //数组是否包含指定元素
            Array.prototype.contains = function(suArr){
                for(var i = 0; i < this.length; i ++){
                    if(this[i] == suArr){
                        return true;
                    }
                }
                return false;
            }
            //两个数组的交集
            Array.intersect = function(a, b){
                return a.each(function(o){return b.contains(o) ? o : null});
            };
            //两个数组的差集
            Array.minus = function(a, b){
                return a.each(function(o){return b.contains(o) ? null : o});
            };

            /**
             *删除数组指定下标或指定对象
             */
            Array.prototype.remove = function (obj) {
                for (var i = 0; i < this.length; i++) {
                    var temp = this[i];
                    if (!isNaN(obj)) {
                        temp = i;
                    }
                    if (temp == obj) {
                        for (var j = i; j < this.length; j++) {
                            this[j] = this[j + 1];
                        }
                        this.length = this.length - 1;
                    }
                }
            };
            setTimeout(function () {
	            $.ajax({
	                type: 'POST',
	                url: '/clbs/m/basicinfo/monitoring/vehicle/subscribeVehicleList',
	                dataType: 'json',
	                async: false,
	                success: function (data) {
	                    webSocket.init('/clbs/vehicle');
	                    if (data != null && data.length > 0) {
	                        for (var i = 0; i < data.length; i++) {
	                            var obj = new Object();
	                            obj.vehicleID = data[i].id;
	                            diyueall.push(data[i].id);
	                            params.push(obj)
	                        }
	                    }
                      var  udiyueall=realTimeMonitoring.unique(diyueall)
	                    //订阅所有车辆 
	                    requestStrS = {
	                        "desc": {
	                            "MsgId": 40964,
	                            "UserName": $("#userName").text()
	                        },
	                        "data": params
	                    };
                        webSocket.subscribe('/user/'+ $("#userName").text() + '/cachestatus', realTimeMonitoring.updataRealTree,"/app/vehicle/subscribecachestatus", requestStrS);
	                    $("#tall").text("(" + udiyueall.length + ")");
	                },
	                error: function () {
	                    layer.msg("系统出现未知错误，请联系管理员", {move: false});  
	                }
	            });
            }, 500);
            //页面区域定位
            $(".amap-logo").attr("href", "javascript:void(0)").attr("target", "");
            //监听浏览器窗口大小变化
            var sWidth = $(window).width();
            if(sWidth < 1200){
                $("body").css("overflow","auto");
                $("#content-left,#panDefLeft").css("height","auto");
                $panDefLeft.css("margin-bottom","0px");
                if(sWidth <= 414){
                    $sidebar.removeClass("sidebar-toggle");
                    $mainContentWrapper.removeClass("main-content-toggle-left");
                }
            }else{
                $("body").css("overflow","hidden");
            };

            mapVehicleTimeW = new realTimeMonitoring.mapVehicle();
            mapVehicleTimeQ = new realTimeMonitoring.mapVehicle();
            markerMap = new realTimeMonitoring.mapVehicle();
            mapflog = new realTimeMonitoring.mapVehicle();
            mapVehicleNum = new realTimeMonitoring.mapVehicle();
            infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -10),closeWhenClickMap:true});
        },
        //实时路况点击
        realTimeRC:function(){
            if(isTrafficDisplay){
                realTimeTraffic.show();
                $realTimeRC.addClass("map-active");
                isTrafficDisplay = false;
            } else {
                realTimeTraffic.hide();
                $realTimeRC.removeClass("map-active");
                isTrafficDisplay = true;
            }
        },
        //卫星地图及3D地图切换
        satelliteMapSwitching: function(){
            if(isMapThreeDFlag){
                $("#defaultMap").addClass("map-active");
                satellLayer.show();
                buildings.setMap(null);
                isMapThreeDFlag = false;
            } else {
                $("#defaultMap").removeClass("map-active");
                buildings.setMap(map);
                satellLayer.hide();
                isMapThreeDFlag = true;
            }
        },
        //右边菜单显示隐藏切换
        toggleLeft: function(){
            if ($sidebar.hasClass("sidebar-toggle")) {
                if ($contentLeft.is(":hidden")) {
                    $contentRight.css("width", "100%");
                } else {
                    $contentRight.css("width", "80%");
                    $contentLeft.css("width", "20%");
                }
            } else {
                if ($contentLeft.is(":hidden")) {
                    $contentRight.css("width", "100%");
                } else {
                    $contentRight.css("width", 100 - newwidth + "%");
                    $contentLeft.css("width", newwidth + "%");
                }
            }
        },
        //左侧操作树点击隐藏
        goHidden:function(){
            $contentLeft.hide();
            $contentRight.attr("class", "col-md-12 content-right");
            $contentRight.css("width","100%");
            $goShow.show();
        },
        //左侧操作树点击显示
        goShow:function(){
            $contentLeft.show();
            $contentRight.attr("class", "col-md-9 content-right");
            if ($sidebar.hasClass("sidebar-toggle")) {
                $contentRight.css({
                    "width":100-newwidth + "%"
                });
                $contentLeft.css({
                    "width":newwidth + "%"
                });
            }else{
                $contentRight.css({
                    "width":"75%"
                });
                $contentLeft.css({
                    "width":"25%"
                });
            }
            $goShow.hide();
        },
        //鼠标按住拖动事件
        mouseMove:function(e){
            if (els - e.clientY > 0) {
              var y = els - e.clientY;
              var newHeight = mapHeight - y;
              if (newHeight <= 0) {
                  newHeight = 0;
              }
              $MapContainer.css({
                  "height": newHeight + "px"
              });
              if (newHeight == 0) {
                  return false;
              }
	      $("#realTimeStateTable-div").css({
	            "height": (tableHeight + y) + "px"
	      });
          } else {
              var dy = e.clientY - els;
              var newoffsetTop = $myTab.offset().top;
              var scrollBodyHeight = $("#realTimeState .dataTables_scrollBody").height();
              if (scrollBodyHeight == 0) {
                  return false;
              }
              if (newoffsetTop <= (wHeight - myTabHeight)) {
                  var newHeight = mapHeight + dy;
                  $MapContainer.css({
                      "height": newHeight + "px"
                  });
		$("#realTimeStateTable-div").css({
                      "height": (tableHeight - dy) + "px"
                  });
              }
          }
          e.stopPropagation();
        },
        mouseUp:function(){
            $(document).unbind("mousemove", realTimeMonitoring.mouseMove).unbind("mouseup", realTimeMonitoring.mouseUp);
        },
        completeEventHandler:function(vehicle){//1
            if(vehicle[11] == 0 && vehicle[12] == 0){
                return;
            };
            coordinateNew = [];
            var x = vehicle[11];
            var y = vehicle[12];
            coordinateNew.push(y);
            coordinateNew.push(x);
            content = [];
            content.push("时间：" + vehicle[10]);
            content.push("车牌号：" + vehicle[0]);
            content.push("车辆类型：" + vehicle[1]);
            content.push("所属分组：" + vehicle[2]);
            content.push("终端号：" + vehicle[3]);
            content.push("SIM卡号：" + vehicle[4]);
            content.push("当日里程：" + (vehicle[5]).toFixed(1) + "公里");
            content.push("总里程：" + vehicle[6] + "公里");
            content.push("行驶速度：" + vehicle[7]);
            content.push("ACC状态：" + vehicle[8]);
            content.push("行驶状态：" + vehicle[9]);
            content.push('<a id="jumpTo" onClick="window.realTimeMonitoring.jumpToTrackPlayer(\'' + vehicle[13] + '\')">轨迹</a>');
            var mapVehicleTimeT = [];
            var oldPosition = [];
            if (mapVehicleTimeQ != undefined){
            	if (mapVehicleTimeQ.containsKey(vehicle[13]) == true) {
                    mapVehicleTimeQ.remove(vehicle[13]);
                  }
            }
             mapVehicleTimeT = [];
             mapVehicleTimeT.push(coordinateNew);
             mapVehicleTimeT.push(content);
             mapVehicleTimeT.push(vehicle[13]);
             mapVehicleTimeQ.put(vehicle[13], mapVehicleTimeT);
            if(flog == true){//2
               var markerList = [];
              flog = false;//关闭第一个点进入入口
               markerRealTime = new AMap.Marker({
                position: coordinateNew,
                icon: "../../resources/img/vehicle.png",
                offset: new AMap.Pixel(-26, -13), //相对于基点的位置
                autoRotation: true,//自动调节图片角度
                map: map
                 });
               markerRealTime.extData =  vehicle[13];
               markerRealTime.content = content.join("<br/>");
               markerRealTime.on('click', realTimeMonitoring.markerClick);
               map.setZoomAndCenter(18, coordinateNew);//将这个点设置为中心点和缩放级别
               markerList.push(markerRealTime);//点
               markerList.push(coordinateNew);//坐标
               markerList.push(content);//详情
               markerList.push(vehicle[5]);//里程
              var timeOld = (new Date(vehicle[10])).getTime();//获得时间（毫秒）
               markerList.push(timeOld);//时间
               markerMap.put(vehicle[13],markerList);
               realTimeMonitoring.LimitedSize(6);//第一个点限制范围
            }else{
               if(paths.contains(coordinateNew) == true && map.getZoom() >= 11){//3
               var isExistVehicle = false;//判断是否是第一个点
               lineArr = [];
               if(markerMap.containsKey(vehicle[13]) == false){//判断最新点集合里面是否包含该车
                   oldPosition = coordinateNew;
               }else{
                   oldPositionlng = (markerMap.get(vehicle[13]))[0].getPosition().lng;
                   oldPositionlat = (markerMap.get(vehicle[13]))[0].getPosition().lat;
                   oldPosition.push(oldPositionlng);
                   oldPosition.push(oldPositionlat);
               }; 
               if(markerMap.containsKey(vehicle[13]) == true){//6
                    isExistVehicle = true;
                    markerInside = (markerMap.get(vehicle[13]))[0];
                 if(mapflog.containsKey(vehicle[13]) == false){//判断是否是第一个点 7
                    mapflog.put(vehicle[13] , "1");
                    markerInside.content = content.join("<br/>");
                    markerInside.setPosition(oldPosition);
                    markerInside.on('click', realTimeMonitoring.markerClick);
                    lineArr.push(oldPosition);
                    lineArr.push(coordinateNew);
                    var polyline = new AMap.Polyline({
                      map: map,
                      path: lineArr,
                      strokeColor: "#00A",  //线颜色
                      strokeOpacity: 0,     //线透明度
                      strokeWeight: 3,      //线宽
                      strokeStyle: "solid"  //线样式
                      });
                    var mileageMarker = vehicle[5] - (markerMap.get(vehicle[13]))[3];//当前点里程减去上个点的里程，得到里程差
                    var timeOldA = (new Date(vehicle[10])).getTime();//获取当前点时间
                    var timeOldB = timeOldA - (markerMap.get(vehicle[13]))[4];
                    var timeMarker = timeOldB/1000/60/60; //获取时间差，并将毫秒换算成小时
                    var SpeedMarker = parseInt(mileageMarker/timeMarker);//获得平均速度并取整
                     if(SpeedMarker > 0){
                      if(mileageMarker > 6 || timeOldB > 300000){
                          markerInside.moveAlong(lineArr, 10000);
                        }else{
                          markerInside.moveAlong(lineArr, SpeedMarker);
                        }
                      }else{
                          markerInside.moveAlong(lineArr, 100);
                      }
                    AMap.event.addListener(markerInside,"moving",function(){
                       if(fixedPoint != null && fixedPoint == markerInside.extData){
                              realTimeMonitoring.LimitedSizeTwo();
                              var msg = markerInside.getPosition();
                             if(pathsTwo.contains(msg) == false){
                                 map.setZoomAndCenter(map.getZoom(), msg);
                                if(map.getZoom() == 18){
                                  realTimeMonitoring.LimitedSize(6);
                              }else if(map.getZoom() == 17){
                                  realTimeMonitoring.LimitedSize(5);
                              }else if(map.getZoom() == 16){
                                  realTimeMonitoring.LimitedSize(4);
                              }else if(map.getZoom() == 15){
                                  realTimeMonitoring.LimitedSize(3);
                              }else if(map.getZoom() == 14){
                                  realTimeMonitoring.LimitedSize(2);
                              }else if(map.getZoom() <= 13 && map.getZoom() >= 6){
                                  realTimeMonitoring.LimitedSize(1);
                              };
                                 realTimeMonitoring.LimitedSizeTwo();
                                 realTimeMonitoring.vehicleMovement();
                             };
                           };
                    });
                    markerMap.remove(vehicle[13]);
                    var markerList = [];
                    markerList.push(markerInside);
                    markerList.push(markerInside.getPosition());
                    markerList.push(content);
                    markerList.push(vehicle[5]);//里程
                    markerList.push(timeOldA);
                    markerMap.put(vehicle[13], markerList);
                    AMap.event.addListener(markerInside,"moveend",function(){
                    realTimeMonitoring.ListeningMovement(markerInside.extData);
                    });
                 }else{//7
                    var posa = markerInside.getPosition().lat; //当前的坐标
                    var posn = markerInside.getPosition().lng;
                    var oldn = oldPosition[0];//当前的坐标
                    var olda = oldPosition[1];
                    if (posa == olda && posn == oldn){//8
                     markerInside.content = content.join("<br/>");
                     markerInside.setPosition(oldPosition); // 更新点标记位置
                     markerInside.on('click', realTimeMonitoring.markerClick);
                     lineArr.push(oldPosition);
                     lineArr.push(coordinateNew);
                     var polyline = new AMap.Polyline({
                        map: map,
                        path: lineArr,
                        strokeColor: "#00A",  //线颜色
                        strokeOpacity: 0,     //线透明度
                        strokeWeight: 3,      //线宽
                        strokeStyle: "solid"  //线样式
                      });
                      var mileageMarker = vehicle[5] - (markerMap.get(vehicle[13]))[3];//当前点里程减去上个点的里程，得到里程差
                    var timeOldA = (new Date(vehicle[10])).getTime();//获取当前点时间
                    var timeOldB = timeOldA - (markerMap.get(vehicle[13]))[4];
                    var timeMarker = timeOldB/1000/60/60; //获取时间差，并将毫秒换算成小时
                    var SpeedMarker = parseInt(mileageMarker/timeMarker);//获得平均速度并取整
                     if(SpeedMarker > 0){
                      if(mileageMarker > 6 || timeOldB > 300000){
                          markerInside.moveAlong(lineArr, 10000);
                        }else{
                          markerInside.moveAlong(lineArr, SpeedMarker);
                        }
                      }else{
                          markerInside.moveAlong(lineArr, 100);
                      }
                    AMap.event.addListener(markerInside,"moving",function(){
                       if(fixedPoint != null && fixedPoint == markerInside.extData){
                              realTimeMonitoring.LimitedSizeTwo();
                              var msg = markerInside.getPosition();
                             if(pathsTwo.contains(msg) == false){
                                 map.setZoomAndCenter(map.getZoom(), msg);
                                if(map.getZoom() == 18){
                                  realTimeMonitoring.LimitedSize(6);
                              }else if(map.getZoom() == 17){
                                  realTimeMonitoring.LimitedSize(5);
                              }else if(map.getZoom() == 16){
                                  realTimeMonitoring.LimitedSize(4);
                              }else if(map.getZoom() == 15){
                                  realTimeMonitoring.LimitedSize(3);
                              }else if(map.getZoom() == 14){
                                  realTimeMonitoring.LimitedSize(2);
                              }else if(map.getZoom() <= 13 && map.getZoom() >= 6){
                                  realTimeMonitoring.LimitedSize(1);
                              };
                                 realTimeMonitoring.LimitedSizeTwo();
                                 realTimeMonitoring.vehicleMovement();
                             };
                           };
                    });
                    markerMap.remove(vehicle[13]);
                    var markerList = [];
                    markerList.push(markerInside);
                    markerList.push(markerInside.getPosition());
                    markerList.push(content);
                    markerList.push(vehicle[5]);//里程
                    markerList.push(timeOldA);
                    markerMap.put(vehicle[13], markerList);
                    AMap.event.addListener(markerInside,"moveend",function(){
                    realTimeMonitoring.ListeningMovement(markerInside.extData);
                    });
                  }else{//8
                    lineArr.push(oldPosition);
                    lineArr.push(coordinateNew);
                    var VehicleNum = [];
                    VehicleNum.push(oldPosition);//车辆坐标
                    VehicleNum.push(lineArr);//线的坐标
                    VehicleNum.push(content);//详情
                    var mileageMarker = vehicle[5] - (markerMap.get(vehicle[13]))[3];//当前点里程减去上个点的里程，得到里程差
                    var timeOldA = (new Date(vehicle[10])).getTime();//获取当前点时间
                    var timeOldB = timeOldA - (markerMap.get(vehicle[13]))[4];
                    var timeMarker = timeOldB/1000/60/60; //获取时间差，并将毫秒换算成小时
                    var SpeedMarker = parseInt(mileageMarker/timeMarker);//获得平均速度并取整
                    if(SpeedMarker > 0){
                        if(mileageMarker > 6 || timeOldB > 300000){
                            VehicleNum.push(10000);//速度
                        }else{
                            VehicleNum.push(SpeedMarker);//速度
                        }
                    }else{
                            VehicleNum.push(100);//速度
                        }
                    var VehicleNums = [];
                     if(mapVehicleNum.containsKey(vehicle[13]) == true){
                        var numa = mapVehicleNum.get(vehicle[13]);//取出值
                        numa.push(VehicleNum);//将新的值放进去
                        mapVehicleNum.remove(vehicle[13]);//删除map中的键值对
                        mapVehicleNum.put(vehicle[13] , numa);//将新的键值对放进去
                    }else{
                        VehicleNums.push(VehicleNum);
                        mapVehicleNum.put(vehicle[13] , VehicleNums);
                      }
                    markerMap.remove(vehicle[13]);
                    var markerList = [];
                    markerList.push(markerInside);
                    markerList.push(markerInside.getPosition());
                    markerList.push(content);
                    markerList.push(vehicle[5]);//里程
                    markerList.push(timeOldA);
                    markerMap.put(vehicle[13], markerList);
                  }//8
                 }//7
               }//6
               if(isExistVehicle == false){//4
                 markerRealTime = new AMap.Marker({
                     position: oldPosition,
                     icon: "../../resources/img/vehicle.png",
                     offset: new AMap.Pixel(-26, -13), //相对于基点的位置
                     autoRotation: true,
                     map: map
                 });
                 markerRealTime.extData =  vehicle[13];
                 markerRealTime.content = content.join("<br/>");
                 markerRealTime.on('click', realTimeMonitoring.markerClick);
                 markerList = [];
                 markerList.push(markerRealTime);//点
                 markerList.push(coordinateNew);//坐标
                 markerList.push(content);//详情
                 markerList.push(vehicle[5]);//里程
                 var timeOld = (new Date(vehicle[10])).getTime();//获得时间（毫秒）
                 markerList.push(timeOld);//时间
                 markerMap.put(vehicle[13],markerList);
               }//4
             }else{//3
               if(markerMap.containsKey(vehicle[13]) == true){
                 markerInside = (markerMap.get(vehicle[13]))[0];
                 markerMap.remove(vehicle[13]);
                 markerInside.setMap(null);
                 mapflog.remove(vehicle[13]);
                 mapVehicleNum.remove(vehicle[13]);
               }
               if (mapVehicleTimeW.containsKey(vehicle[13]) == true) {
               mapVehicleTimeW.remove(vehicle[13]);
               }
               mapVehicleTimeT = [];
               mapVehicleTimeT.push(coordinateNew);
               mapVehicleTimeT.push(content);
               mapVehicleTimeT.push(vehicle[13]);
               mapVehicleTimeW.put(vehicle[13],mapVehicleTimeT);
             }//3
            }//2
           },//1
           ListeningMovement: function(plate){
             var markerInside = markerMap.get(plate);
             var leng = mapVehicleNum.get(plate);
             if(mapVehicleNum.containsKey(plate) == true && leng.length != 0){
                lineArr = [];
                var realtA = leng[0];
                var realtB = realtA[0];//车的坐标
                var realtC = realtA[1];//线的坐标
                var realtD = realtA[2];//详情
                var realtE = realtA[3];//速度
                markerInside[0].content = realtD.join("<br/>");
                markerInside[0].setPosition(realtB); // 更新点标记位置
                markerInside[0].on('click', realTimeMonitoring.markerClick);
                var polyline = new AMap.Polyline({
                    map: map,
                    path: realtC,
                    strokeColor: "#00A",  //线颜色
                    strokeOpacity: 0,     //线透明度
                    strokeWeight: 3,      //线宽
                    strokeStyle: "solid"  //线样式
                });
             setTimeout(function () {
                markerInside[0].moveAlong(realtC, realtE);
                 }, 100);
                    /**
                     *  监听拖拽地图（若车辆离开当前区域）
                     */
                AMap.event.addListener(markerInside[0],"moving",function(){
                    if(fixedPoint != null && fixedPoint == markerInside[0].extData){
                        realTimeMonitoring.LimitedSizeTwo();
                        var msg = markerInside[0].getPosition();
                        if(pathsTwo.contains(msg) == false){
                            map.setZoomAndCenter(map.getZoom(), msg);
                            if(map.getZoom() == 18){
                                realTimeMonitoring.LimitedSize(6);
                            }else if(map.getZoom() == 17){
                                realTimeMonitoring.LimitedSize(5);
                            }else if(map.getZoom() == 16){
                                realTimeMonitoring.LimitedSize(4);
                            }else if(map.getZoom() == 15){
                                realTimeMonitoring.LimitedSize(3);
                            }else if(map.getZoom() == 14){
                                realTimeMonitoring.LimitedSize(2);
                            }else if(map.getZoom() <= 13 && map.getZoom() >= 6){
                                realTimeMonitoring.LimitedSize(1);
                            };
                            realTimeMonitoring.LimitedSizeTwo();
                            realTimeMonitoring.vehicleMovement();
                        };
                    };
                });
                AMap.event.addListener(markerInside[0],"moveend",function(){
                  realTimeMonitoring.ListeningMovement(markerInside[0].extData);
                });
                leng.remove(0);
                mapVehicleNum.remove(plate);
                mapVehicleNum.put(plate , leng);
                //break;
              };
            },
            LimitedSizeTwo: function(){
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
              pathsTwo =new AMap.Bounds(
                  lll,//东北角坐标
                    ll //西南角坐标
              );
          },
             LimitedSize:function(size){
                 paths = null;
              var southwest = map.getBounds().getSouthWest();//获取西南角坐标
              var northeast = map.getBounds().getNorthEast();//获取东北角坐标
              var possa = southwest.lat;//纬度（小）
              var possn = southwest.lng;
              var posna = northeast.lat;
              var posnn = northeast.lng;
              var psa = possa - ((posna - possa)*size);
              var psn = possn - ((posnn - possn)*size);
              var pna = posna + ((posna - possa)*size);
              var pnn = posnn + ((posnn - possn)*size);
              paths =new AMap.Bounds(
                  [psn,psa], //西南角坐标
                  [pnn,pna]//东北角坐标
              );
          },
             //当范围缩小时触发该方法
             clickEventListener: function(){
                if(map.getZoom() == 18){
                    if(zoom < 11){
                        map.setCenter(fixedPointPosition);
                    }
                    realTimeMonitoring.LimitedSize(6);
                }else if(map.getZoom() == 17){
                    realTimeMonitoring.LimitedSize(5);
                }else if(map.getZoom() == 16){
                    realTimeMonitoring.LimitedSize(4);
                }else if(map.getZoom() == 15){
                    realTimeMonitoring.LimitedSize(3);
                }else if(map.getZoom() == 14){
                    realTimeMonitoring.LimitedSize(2);
                }else if(map.getZoom() <= 13 && map.getZoom() >= 6){
                    realTimeMonitoring.LimitedSize(1);
                };
                 markerListT = [];
                 if (cluster) {
                     cluster.setMap(null);
                   };
                 if (map.getZoom() >= 11) {
                     if(zoom < 11){
                         map.clearMap();//清空地图覆盖物
                         cluster.setMap(null);
                         realTimeMonitoring.vehicleMovement();
                    }else{
                        realTimeMonitoring.vehicleMovement();
                    };
                 }else{
                  var markerList = markerMap.values();
                  var j = markerList.length-1;
                  for (var i = j; i >= 0; i--) {
                      var markerInside = markerList[i];
                      var mapVehiclesNew = [];
                      if (mapVehicleTimeW.containsKey(markerInside[0].extData) == true) {
                          mapVehicleTimeW.remove(markerInside[0].extData);
                      }
                          mapVehiclesNew.push(markerInside[0].getPosition());
                          mapVehiclesNew.push(markerInside[2]);
                          mapVehiclesNew.push(markerInside[0].extData);
                          mapVehicleTimeW.put(markerInside[0].extData, mapVehiclesNew);
                          markerMap.remove(markerInside[0].extData);
                          //markerList.setMap(null);
                          //markerMapNew.remove(markerInside[0].extData);
                          mapflog.remove(markerInside[0].extData);
                          mapVehicleNum.remove(markerInside[0].extData);
                        };
                     realTimeMonitoring.addCluster();//点聚合
                 }
                 zoom = map.getZoom();
            },
            //当拖拽结束时触发该方法
            clickEventListener2: function(){

                if(map.getZoom() == 18){
                    realTimeMonitoring.LimitedSize(6);
                }else if(map.getZoom() == 17){
                    realTimeMonitoring.LimitedSize(5);
                }else if(map.getZoom() == 16){
                    realTimeMonitoring.LimitedSize(4);
                }else if(map.getZoom() == 15){
                    realTimeMonitoring.LimitedSize(3);
                }else if(map.getZoom() == 14){
                    realTimeMonitoring.LimitedSize(2);
                }else if(map.getZoom() <= 13 && map.getZoom() >= 6){
                    realTimeMonitoring.LimitedSize(1);
                };
                markerListT = [];
                if (cluster) {
                    cluster.setMap(null);
                    }
                if (map.getZoom() >= 11) {
                    if(zoom < 11){
                         map.clearMap();//清空地图覆盖物
                         realTimeMonitoring.vehicleMovement();
                    }else{
                        realTimeMonitoring.vehicleMovement();
                    };
                 }else{
                 realTimeMonitoring.addCluster();//点聚合
                 }
                zoom = map.getZoom();
            },
            vehicleMovement:function(){
                var mapVehicles = mapVehicleTimeW.values();
                var mapVehicleList = markerMap.values();
                var j = mapVehicles.length-1;
                for(var i = j; i >= 0; i--){
                  var vehicleleg = mapVehicles[i];
                      vehicleBans = vehicleleg[2];
                      coordinateNew = vehicleleg[0];
                      content = vehicleleg[1];
                  if(paths.contains(coordinateNew) == true){
                      markerRealTime = new AMap.Marker({
                      position: coordinateNew,
                      icon: "../../resources/img/vehicle.png",
                      offset: new AMap.Pixel(-26, -13), //相对于基点的位置
                      autoRotation: true,
                      map: map
                      });
                      markerRealTime.extData =  vehicleBans;
                      markerRealTime.content = content.join("<br/>");
                      markerRealTime.on('click', realTimeMonitoring.markerClick);
                      markerList = [];
                      markerList.push(markerRealTime);
                      markerList.push(markerRealTime.getPosition());
                      markerList.push(content);
                      markerList.push(0);
                      markerList.push(0);
                      markerMap.put(markerRealTime.extData , markerList);
                      mapVehicleTimeW.remove(markerRealTime.extData);//根据下标删除该元素
                      };
                  };
                  var g = mapVehicleList.length-1;
                  for (var i = g; i >= 0; i--) {
                      var markerInside = mapVehicleList[i];
                    if(paths.contains(markerInside[0].getPosition()) == false) {
                       var mapVehiclesNew = [];
                       mapVehiclesNew.push(markerInside[0].getPosition());
                       mapVehiclesNew.push(markerInside[2]);
                       mapVehiclesNew.push(markerInside[0].extData);
                       markerInside[0].setMap(null);
                       markerMap.remove(markerInside[0].extData);
                       mapflog.remove(markerInside[0].extData);
                       mapVehicleNum.remove(markerInside[0].extData);
                       mapVehicleTimeW.put(markerInside[0].extData , mapVehiclesNew);
                     };
                  };
            },
           vehicleReplacement:function(){
                  var mapVehicles = mapVehicleTimeQ.values();
                  var j = mapVehicles.length;
                  for(var i = 0; i < j; i++){
                    var vehicleleg = mapVehicles[i];
                    vehicleBans = vehicleleg[2];
                    coordinateNew = vehicleleg[0];
                    content = vehicleleg[1];
                    if(paths.contains(coordinateNew) == true || map.getZoom() <= 5){
                        markerRealTimeT = new AMap.Marker({
                          position: coordinateNew,
                          icon: "../../resources/img/1.png",
                          offset: new AMap.Pixel(-26, -13), //相对于基点的位置
                          autoRotation: true,
                          map: map
                        });
                        markerRealTimeT.extData =  vehicleBans;
                        markerRealTimeT.content = content.join("<br/>");
                        markerRealTimeT.on('click', realTimeMonitoring.markerClick);
                        markerListT.push(markerRealTimeT);
                    };
                  };
                },
            addCluster: function(){
                realTimeMonitoring.vehicleReplacement();
                map.plugin(["AMap.MarkerClusterer"], function() {
                    map.clearMap();//清空地图覆盖物
                    cluster = new AMap.MarkerClusterer(map, markerListT);
                });
            },
             //车辆标注点击
            markerClick: function(e){
                infoWindow.setContent(e.target.content);
                infoWindow.open(map, e.target.getPosition());
            },
            //表格
            centerMarkerBands: function(numberPlate){
                var sof = false;
                if(map.getZoom() <= 11){
                    sof = true;
                }
                var flogCentet = false;
                var mapVehicles = mapVehicleTimeW.values();
                var mapVehicleList = markerMap.values();
                var j = mapVehicles.length;
                for(var i = 0; i < j ; i++){
                    var vehicleleg = mapVehicles[i];
                    vehicleBans = vehicleleg[2];
                    coordinateNew = vehicleleg[0];
                    content = vehicleleg[1];
                    StringContent = content[1];
                    if (StringContent.indexOf(numberPlate) != -1) {
                        map.setCenter(coordinateNew);
                        map.setZoom(18);

                       // map.setZoomAndCenter(18, coordinateNew);
                        fixedPoint = vehicleBans;//这个用于存储车辆ID
                        fixedPointPosition = coordinateNew;
                        realTimeMonitoring.LimitedSize(6);
                        flogCentet = true;
                    };
                };
                if (flogCentet == false) {
                	var g = mapVehicleList.length-1
                    for (var i = g; i >= 0; i--) {
                        var markerInside = mapVehicleList[i][0];
                        var bansVs = markerInside.content;
                        if (bansVs.indexOf(numberPlate) != -1) {
                            //map.setZoomAndCenter(18, markerInside.getPosition());
                            map.setCenter(markerInside.getPosition());
                            map.setZoom(18);
                            fixedPoint = markerInside.extData;//这个用于存储车辆ID
                            realTimeMonitoring.LimitedSize(6);
                        };
                    };
                };
                if(sof == false){
                 realTimeMonitoring.vehicleMovement();
               }
            },
            //双击车辆，车辆居中
            centerMarker: function(nodes,sub){
                var sof = false;
                 if(map.getZoom() <= 11){
                    sof = true;
                 }
                var flogCentet = false;
                var mapVehicles = mapVehicleTimeW.values();
                var mapVehicleList = markerMap.values();
                var j = mapVehicles.length;
                for(var i = 0; i < j ; i++){
                    var vehicleleg = mapVehicles[i];
                    vehicleBans = vehicleleg[2];
                    coordinateNew = vehicleleg[0];
                    content = vehicleleg[1];
                    if (vehicleBans == nodes[0].id) {
                        //map.setZoomAndCenter(18, coordinateNew);
                        map.setCenter(coordinateNew);
                        map.setZoom(18);
                        if(sub === 1){
                            fixedPoint = null;
                            fixedPointPosition = coordinateNew;
                        }else if(sub === 2){
                            fixedPoint = vehicleBans;//这个用于存储车辆ID
                            fixedPointPosition = coordinateNew;
                        }
                        realTimeMonitoring.LimitedSize(6);
                        flogCentet = true;
                    };
                };
                if (flogCentet == false) {
                	var g = mapVehicleList.length-1;
                    for (var i = g; i >= 0; i--) {
                        var markerInside = mapVehicleList[i][0];
                        if (markerInside.extData == nodes[0].id) {
                            map.setZoomAndCenter(18, markerInside.getPosition());
                            if(sub === 1){
                                fixedPoint = null;
                            }else if(sub === 2){
                                fixedPoint = markerInside.extData;//这个用于存储车辆ID
                            }
                            realTimeMonitoring.LimitedSize(6);
                        };
                    };
                };
                if(sof == false){
                     realTimeMonitoring.vehicleMovement();
                }
            },
            centerMarkerNo: function(){
                fixedPoint == null;
            },
            //取消点
            clearMarker: function(param){
                var mapVehicles = mapVehicleTimeW.values();
                var mapVehicleList = markerMap.values();
                var mapVehiclesQ = mapVehicleTimeQ.values();
                var c = mapVehicleList.length-1;
                var jV = param.length;
                for (var i = c; i >= 0; i--) {
                     var markerInside = mapVehicleList[i][0];
                     for(var j = 0; j < jV; j++){
                         if(markerInside.extData==param[j].vehicleID){
                             markerInside.setMap(null);
                             markerMap.remove(markerInside.extData);
                         }
                     }
                }
                var g = mapVehicles.length-1;
                for (var i = g; i >= 0; i--){
                     var vehicleleg = mapVehicles[i];
                     vehicleBans = vehicleleg[2];
                     coordinateNew = vehicleleg[0];
                     content = vehicleleg[1];
                     for(var j = 0; j < jV; j++){
                         if(vehicleBans == param[j].vehicleID){
                             mapVehicleTimeW.remove(vehicleBans);
                         };
                   };
                }
                var h = mapVehiclesQ.length-1;
                for(var i = h; i >= 0; i--){
                   var vehicleleg = mapVehiclesQ[i];
                   vehicleBans = vehicleleg[2];
                   coordinateNew = vehicleleg[0];
                   content = vehicleleg[1];
                   for(var j = 0; j < jV; j++){
                       if(vehicleBans == param[j].vehicleID){
                           mapVehicleTimeQ.remove(vehicleBans);
                       };
                 };
                };
                if(markerListT.length >0){
                var k = markerListT.length-1;
                   for (var i = k; i >= 0; i--) {
                       var markerInside = markerListT[i];
                       for(var j = 0; j < jV; j++){
                           if(markerInside.extData==param[j].vehicleID){
                               markerInside.setMap(null);
                               markerListT.remove(i);
                           };
                       };
                   };
                };
                map.clearInfoWindow();
            },
        jumpToTrackPlayer: function(sid){
            var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
            var nodes = treeObj.getCheckedNodes(true);
            var uuids = [];
            var pids = [];
            for(var j = 0;j<nodes.length;j++){
                var vObj = {};
                vObj.id=nodes[j].id;
                vObj.pid=nodes[j].pId;
                uuids.push(vObj);
            }
            var uuidStr = JSON.stringify(uuids);
            sessionStorage.setItem('uuid',uuidStr);
            window.open("/clbs/v/monitoring/trackPlayback?vid=" + sid + "");
        },
        //关闭信息窗体
        closeInfoWindow: function(){
             map.clearInfoWindow();
        },
        //组织树预处理函数
        ajaxDataFilter: function(treeId, parentNode, responseData){
            var jumpId = $("#jumpId").val();
            if(jumpId =="trackPlayer"){
              var uuids = sessionStorage.getItem("uuid");
              if(uuids!=""){
                  var uuidStr = jQuery.parseJSON(uuids);
                  if(uuidStr!=null){
                      for(var i=0;i<uuidStr.length;i++){
                          var obj = uuidStr[i];
                          var id = obj.id;
                          var pid = obj.pid;
                          for(var j=0;j<responseData.length;j++){
                            if(responseData[j].id==id&&responseData[j].pId==pid||(responseData[j].id=='ou=organization'&&responseData[j].pId=="")){
                                responseData[j].checked = true;
                            }  
                          }
                      } 
                  }
              }
              sessionStorage.setItem("uuid","");
            }
            if (responseData) {
                for (var i = 0; i < responseData.length; i++) {
                    responseData[i].open = true;
                }
            }
            return responseData;
        },
        zTreeOnNodeCreated:function (event, treeId, treeNode) {
            var id = treeNode.id.toString();
            var list=[];
            if(zTreeIdJson[id] ==null){
                list = [treeNode.tId];
                zTreeIdJson[id] = list;
            }else {
                zTreeIdJson[id].push(treeNode.tId)
            }
        },
        //车辆树加载成功事件
        zTreeOnAsyncSuccess: function(event, treeId, treeNode, msg){
            var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
            var nodes =  treeObj.getCheckedNodes(true);
            var jumpId = $("#jumpId").val();
            if(jumpId =="trackPlayer"){
                var cheakdiyueall = [];
                for (var i = 0; i < nodes.length; i++) {
                    if (nodes[i].type === "vehicle") {
                        cheakdiyueall.push(nodes[i].id)
                    }
                }
                var param = [];
                cheakdiyuealls = realTimeMonitoring.unique(cheakdiyueall);
                for (var j = 0; j < cheakdiyuealls.length; j++) {
                    var obj = new Object();
                    obj.vehicleID = cheakdiyuealls[j];
                    param.push(obj)
                }
                var requestStrS = {
                    "desc": {
                        "MsgId": 40964,
                        "UserName": $("#userName").text()
                    },
                    "data": param
                };
                webSocket.subscribe('/user/'+ $("#userName").text() + '/location', realTimeMonitoring.updataRealTree,"/app/vehicle/location", requestStrS);
            }
        },
        //模糊查询
        searchNeverOnline: function(treeId, searchConditionId){
            //<2>.得到模糊匹配搜索条件的节点数组集合
            var highlightNodes = new Array();
            if (searchConditionId != "") {
                var treeObj = $.fn.zTree.getZTreeObj(treeId);
                highlightNodes = treeObj.getNodesByParamFuzzy("id", searchConditionId, null);
                return highlightNodes;
            }
        },
        /**
         * 获取车辆状态
        */
        searchByFlag: function(treeId, searchConditionId, flag, type){
            //<2>.得到模糊匹配搜索条件的节点数组集合
            var highlightNodes = new Array();
            if (searchConditionId != "") {
                var treeObj = $.fn.zTree.getZTreeObj(treeId);
                highlightNodes = treeObj.getNodesByParamFuzzy("id", searchConditionId, null);
            }
            //<3>.高亮显示并展示【指定节点s】
            realTimeMonitoring.highlightAndExpand(treeId, highlightNodes, flag, type);
        },
        highlightAndExpand: function(treeId, highlightNodes, flag, type){
            var treeObj = $.fn.zTree.getZTreeObj(treeId);
            //<3>.把指定节点的样式更新为高亮显示，并展开
            if (highlightNodes != null) {
                for (var i = 0; i < highlightNodes.length; i++) {
                        //高亮显示节点的父节点的父节点....直到根节点，并展示
                        realTimeMonitoring.setFontCss(treeId, highlightNodes[i], type);
                        var parentNode = highlightNodes[i].getParentNode();
                        // var parentNodes = realTimeMonitoring.getParentNodes(treeId, parentNode);
                        // treeObj.expandNode(parentNodes, true, false, true);
                        // treeObj.expandNode(parentNode, true, false, true);
                    // treeObj.expandNode(treeObj.getNodes()[0].children[0],true,false,true)
                }
            }
        },
        /**
         * 递归得到指定节点的父节点的父节点....直到根节点
         */
        getParentNodes: function(treeId, node){
            if (node != null) {
                var treeObj = $.fn.zTree.getZTreeObj(treeId);
                var parentNode = node.getParentNode();
                return realTimeMonitoring.getParentNodes(treeId, parentNode);
            } else {
                return node;
            }
        },
        /**
         * 设置树节点字体样式
         */
        setFontCss: function(treeId, treeNode, type){
              var treeObj = $.fn.zTree.getZTreeObj(treeId);
              //在线停车图标
              if (type == 1) {
                  if (lineAndStop.isHas(treeNode.id)) {
                      treeNode.iconSkin = "btnImage iconArea onlineParking";
                      var nodeID = treeNode.tId + "_span";
                      vnodesId.push(nodeID);
                      treeObj.updateNode(treeNode);
                  }
                  if (nmoline.isHas(treeNode.id)) {
                      treeNode.iconSkin = "btnImage iconArea offlineIcon";
                      var nodeID = treeNode.tId + "_span";
                      vnodemId.push(nodeID);
                      treeObj.updateNode(treeNode);
                  }
                  if (lineAndmiss.isHas(treeNode.id)) {
                      treeNode.iconSkin = "btnImage iconArea onlineNotPositioning";
                      var nodeID = treeNode.tId + "_span";
                      vnodelmId.push(nodeID);
                      treeObj.updateNode(treeNode);
                  }
                  if (lineAndRun.isHas(treeNode.id)) {
                      treeNode.iconSkin = "btnImage iconArea onlineDriving";
                      var nodeID = treeNode.tId + "_span";
                      vnoderId.push(nodeID);
                      treeObj.updateNode(treeNode);
                  }

                  if (lineAndAlarm.isHas(treeNode.id)) {
                      treeNode.iconSkin = "btnImage iconArea warning";
                      var nodeID = treeNode.tId + "_span";
                      vnodeaId.push(nodeID);
                      treeObj.updateNode(treeNode);
                  }
                  if (overSpeed.isHas(treeNode.id)) {
                      treeNode.iconSkin = "btnImage iconArea speedLimitWarning";
                      var nodeID = treeNode.tId + "_span";
                      vnodespId.push(nodeID);
                      treeObj.updateNode(treeNode);
                  }
              }

            if (type == 4) {
                if (lineAndStop.isHas(treeNode.id)) {
                    treeNode.iconSkin = "btnImage iconArea onlineParking";
                    var nodeID = treeNode.tId + "_span";
                    // vnodesId.push(nodeID);
                    // vnodesIdS=nodeID;
                    treeObj.updateNode(treeNode);
                    $("#" + nodeID).css('color', '#c80002');
                }else
                if (lineAndmiss.isHas(treeNode.id)) {
                    treeNode.iconSkin = "btnImage iconArea onlineNotPositioning";
                    var nodeID = treeNode.tId + "_span";
                    // vnodelmIdS=nodeID;
                    treeObj.updateNode(treeNode);
                    $("#" + nodeID).css('color', '#754801');
                }else
                if (lineAndRun.isHas(treeNode.id)) {
                    treeNode.iconSkin = "btnImage iconArea onlineDriving";
                    var nodeID = treeNode.tId + "_span";
                    // vnoderId.push(nodeID);
                    // vnoderIdS=nodeID
                    treeObj.updateNode(treeNode);
                    $("#" + nodeID).css('color', '#78af3a');
                }else
                if (lineAndAlarm.isHas(treeNode.id)) {
                    treeNode.iconSkin = "btnImage iconArea warning";
                    var nodeID = treeNode.tId + "_span";
                    // vnodeaIdS=nodeID;
                    treeObj.updateNode(treeNode);
                    $("#" + nodeID).css('color', '#ffab2d');
                }else
                if (overSpeed.isHas(treeNode.id)) {
                    treeNode.iconSkin = "btnImage iconArea speedLimitWarning";
                    var nodeID = treeNode.tId + "_span";
                    // vnodespIdS=nodeID;
                    treeObj.updateNode(treeNode);
                    $("#" + nodeID).css('color', '#960ba3');
                }else if (nmoline.isHas(treeNode.id)) {
                    treeNode.iconSkin = "btnImage iconArea offlineIcon";
                    var nodeID = treeNode.tId + "_span";
                    // vnodemIdS=nodeID;
                    treeObj.updateNode(treeNode);
                    $("#" + nodeID).css('color', '#b6b6b6');
                }
            }


              if (type == 2) {
                  // treeNode.
                  treeObj.checkNode(treeNode, true, true);
              }
              if (type == 3) {
                  treeObj.checkNode(treeNode, false, true);
              }
        },
        unique: function(arr){
            var result = [], hash = {};
            for (var i = 0, elem; (elem = arr[i]) != null; i++) {
                if (!hash[elem]) {
                    result.push(elem);
                    hash[elem] = true;
                }
            }
            return result;
        },
        //车辆树取消点击事件
        zTreeBeforeClick: function(){
            return true;
        },
        beforeChecks: function(){
            if(realTimeMonitoring.cheackIs()){
                return true;
            }else {
                layer.msg("操作过于频繁,请稍等片刻(￣▽￣)")
                return false;
            }
        },
        //单击事件
        onClickV: function(e, treeId, treeNode){
	          var zTree = $.fn.zTree.getZTreeObj("treeDemo");
	          if(treeNode.iconSkin != "assignmentSkin" && treeNode.iconSkin != "groupSkin"){
	              zTree.selectNode(treeNode,false,true);
	          }
	          var nodes = zTree.getSelectedNodes(true);
	          var nodeName = treeNode.name;
	          realTimeMonitoring.centerMarkerNo();
	          realTimeMonitoring.centerMarker(nodes,1);
	      	  $("#"+dbclickCheckedId).parent().removeAttr("class","curSelectedNode_dbClick");		//单击时取消双击Style
	      	  $("#"+ztreeStyleDbclick).children("a").removeAttr("class","curSelectedNode_dbClick");
	      	  realTimeMonitoring.tableHighlight(nodeName);
        },
        //双击事件
        onDbClickV: function(e, treeId, treeNode){
        	dbClickHeighlight = true;
            var zTree = $.fn.zTree.getZTreeObj("treeDemo");     
            if(treeNode.iconSkin != "assignmentSkin" && treeNode.iconSkin != "groupSkin"){
                zTree.selectNode(treeNode,false,true);
            }
            licensePlateInformation = treeNode.name;
            realTimeMonitoring.tableHighlight(licensePlateInformation);
            groupIconSkin = treeNode.iconSkin;
            var nodes = zTree.getSelectedNodes(true);
            if (nodes[0].checked == false) {
                cheakdiyuealls.push(nodes[0].id)
                realTimeMonitoring.getChannel(nodes, map);
                realTimeMonitoring.searchByFlag("treeDemo", nodes[0].id, null, 2)
            }
            zTree.checkNode(nodes[0], true, true);
            //得到当前双击车辆的外层id信息
            dbclickCheckedId = e.target.id;
            if(treeNode.iconSkin != "assignmentSkin" && treeNode.iconSkin != "groupSkin"){
                $("#"+dbclickCheckedId).parent().attr("class","curSelectedNode_dbClick");
            }
            //双击下一辆车取消上一辆
            if(oldDbclickCheckedId != ""){
            	$("#"+oldDbclickCheckedId).parent().removeAttr("class");
            }
            oldDbclickCheckedId = dbclickCheckedId; 
            //处理双击订阅同一辆车
            if(oldDbclickCheckedId = dbclickCheckedId){
                $("#"+dbclickCheckedId).parent().attr("class","curSelectedNode_dbClick");
            }
            //创建车辆对象参数信息(用于实时视频)
           	var vehicleInfo= new Object();
           	vehicleInfo.vid=treeNode.id;
           	vehicleInfo.brand=treeNode.name;
           	vehicleInfo.deviceNumber=treeNode.deviceNumber;    
           	vehicleInfo.isVideo=treeNode.isVideo;
           	realTimeVideo.setVehicleInfo(vehicleInfo);           	
            if(nodes[0].type=="assignment"||nodes[0].type=="group"){
                var changedNodes = zTree.getChangeCheckedNodes()
                var cheakdiyueall = [];
                var param = [];
                for (var i=0, l=changedNodes.length; i<l; i++) {
                    changedNodes[i].checkedOld = changedNodes[i].checked;
                    if (changedNodes[i].type === "vehicle") {
                        cheakdiyueall.push(changedNodes[i].id);
                    }
                }
                 cheakdiyuealls = realTimeMonitoring.unique(cheakdiyueall);
                for (var j = 0; j < cheakdiyuealls.length; j++) {
                    var obj = new Object();
                    obj.vehicleID = cheakdiyuealls[j];
                    param.push(obj)
                }
                var requestStrS = {
                    "desc": {
                        "MsgId": 40964,
                        "UserName": $("#userName").text()
                    },
                    "data": param
                };
                cancelList=[];
                webSocket.subscribe("/user/" + $("#userName").text() + "/location", realTimeMonitoring.updataRealTime,"/app/vehicle/location", requestStrS);
            }
            nodes[0].checkedOld= nodes[0].checked;
            setTimeout(function () {
                realTimeMonitoring.centerMarker(nodes,2);
            },500);
            realTimeMonitoring.realTimeDatatAdapt();
            if (treeNode.checked){
            	//双击订阅显示报警车辆信息
                if(treeNode.iconSkin=="button btnImage iconArea warning" || treeNode.iconSkin=="btnImage iconArea speedLimitWarning"){
                    realTimeMonitoring.showAlarmWindow();
                }
            }
        },
        //组织树勾选
        onCheckVehicle: function(e, treeId, treeNode){
            var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
                nodes = zTree.getCheckedNodes(true);
            var changedNodes = zTree.getChangeCheckedNodes();
            for (var i=0, l=changedNodes.length; i<l; i++) {
                changedNodes[i].checkedOld = changedNodes[i].checked;
            }
            var cheakdiyueall = [];
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].type === "vehicle") {
                    cheakdiyueall.push(nodes[i].id)
                    var list=zTreeIdJson[nodes[i].id];
                    if(list.length>1) {
                        $.each(list, function (index, value) {
                            var treeNoded = zTree.getNodeByTId(value);
                            treeNoded.checkedOld = true;
                        })
                    }
                }
            }
            var param = [];
            cheakdiyuealls = realTimeMonitoring.unique(cheakdiyueall);
            if(cheakdiyuealls.length<=400){
                var cCheacked= Array.minus(cheakdiyuealls,cheakNodec)
                cheakNodec=cheakdiyuealls;
                for (var j = 0; j < cCheacked.length; j++) {
                    var obj = new Object();
                    obj.vehicleID = cCheacked[j];
                    param.push(obj)
                }
                var requestStrS = {
                    "desc": {
                        "MsgId": 40964,
                        "UserName": $("#userName").text()
                    },
                    "data": param
                };
                var offlineVids = [];
                if (treeNode.checked) {//订阅
                    cancelList=[];
                    webSocket.subscribe("/user/" + $("#userName").text() + "/location", realTimeMonitoring.updataRealTime,"/app/vehicle/location", requestStrS);
                    realTimeMonitoring.searchByFlag("treeDemo", treeNode.id, null, 2);
                    realTimeMonitoring.realTimeDatatAdapt();
                    //勾选订阅显示报警车辆信息
                    var zTreeSubscription = $.fn.zTree.getZTreeObj("treeDemo");
                    var subscriptionGroup = zTreeSubscription.getCheckedNodes(true);
                    for(var i=0;i<subscriptionGroup.length;i++){
                        if(subscriptionGroup[i].iconSkin=="button btnImage iconArea warning" || subscriptionGroup[i].iconSkin=="btnImage iconArea speedLimitWarning"){
                            realTimeMonitoring.showAlarmWindow();
                        }
                    }
                } else {//取消订阅
                    cheakNodec=[];
                    param = [];
                    var plateNumbers = [];
                    realTimeMonitoring.getCancelNodes(changedNodes, param, plateNumbers);
                    param = realTimeMonitoring.removeDuplicates(param);
                    plateNumbers = realTimeMonitoring.removeDuplicates(plateNumbers);
                    cancelList = plateNumbers;
                    $realTimeStateTableList.children("tbody").children("tr").each(function(){
                        for(var i = 0,removeLength = cancelList.length; i < removeLength; i++){
                            if($(this).children("td:nth-child(2)").text() == cancelList[i]){
                                $(this).remove();
                            }
                        }
                    });
                    //if
                    //$alarmTable
                    $alarmTable.children("tbody").children("tr").each(function(){
                        for(var i = 0,removeLength = cancelList.length; i < removeLength; i++){
                            if($(this).children("td:nth-child(2)").text() == cancelList[i]){
                                $(this).remove();
                                dengerIndex--;
                            }
                        }
                    });
                    alarmNum = $alarmTable.children("tbody").children("tr").length;
                    $("#showAlarmNum").text(alarmNum);
                    var trLength = $realTimeStateTableList.children("tbody").children("tr").length;
                    tableIndex = trLength + 1;
                    tableListLength = trLength;
                    if(trLength <= 5){
                        $MapContainer.css('height',(newMapHeight-(41*trLength+43 + 17))+'px');
                    }
                    var cancelStrS = {
                        "desc": {
                            "MsgId": 40964,
                            "UserName": $("#userName").text()
                        },
                        "data": param
                    };
                    webSocket.unsubscribealarm("/app/vehicle/unsubscribelocation", cancelStrS);
                    setTimeout(function () {
                        realTimeMonitoring.deleteRowByRealTime('#realTimeStateTable', realTimeSet, plateNumbers);
                        realTimeMonitoring.deleteRowByAlarm('#alarmTable', alarmSet, plateNumbers);
                    },200);
                    realTimeMonitoring.searchByFlag("treeDemo", treeNode.id, null, 3);
                    realTimeMonitoring.clearMarker(param);
                    //取消订阅之后取消单击和双击背景
                    $("#"+oldDbclickCheckedId).parent().removeAttr("class");
                    $(".ztree li a").removeAttr("class","curSelectedNode");
                    //取消订阅时判断当前取消车辆信息
                    if(treeNode.iconSkin=="button btnImage iconArea warning" || treeNode.iconSkin=="btnImage iconArea speedLimitWarning"){
                        realTimeMonitoring.alarmToolMinimize();
                    }
                }
            }else {
                layer.alert("我们的监控上限是400辆,您刚刚订阅了"+cheakdiyuealls.length+"辆,请重新订阅！")
            }
        },
        /**
         *  取消订阅时，删除table数据
         * @param tablename 表名
         * @param list  需要删除的车数据
         * @returns
         * add by wangying
         */
        deleteTableForUnsub: function(tablename,list){
            $("#"+tablename+" tr").each(function () {
                var tr = this;
                var brand = $(tr).children("td").eq(1).html();
                if (brand !=null && brand != "" && list.indexOf(brand) >= 0) {
                    $(tr).remove();
                }
            })
        },
        updateFirstTable: function(data){
            setTimeout(function () {
                for (var i = 0, n = data.length; i < n; i++) {
                    vehicle = [0, data[i], '', '', '', '未上线', '', '', '', '','','','', ''];
                    realTimeMonitoring.updateRow('#realTimeStateTable', realTimeSet, vehicle);
                }
            },0);
        },
        removeDuplicates: function(arr){
            var result = [];
            for (var i = 0, n = arr.length; i < n; i++) {
                if (!result.isHas(arr[i])) {
                    result.push(arr[i]);
                }
            }
            return result;
        },
        getCancelNodes:function(changedNodes, param, plateNumbers){
            for (var i = 0; i < changedNodes.length; i++) {
                if(changedNodes[i].type == 'vehicle'){
                    var obj = new Object();
                    obj.vehicleID = changedNodes[i].id;
                    plateNumbers.push(changedNodes[i].name);
                    param.push(obj);
                }
            }
        },
        getChannel: function(fenceNode, showMap){
            if (fenceNode == null || fenceNode.length == 0||fenceNode[0].type!=='vehicle') {
            } else {
                cancelList=[];
                var requestStr = {
                    "desc": {
                        "MsgId": 40964,
                        "UserName": $("#userName").text()
                    },
                    "data": [{
                        "vehicleID": fenceNode[0].id
                    }]
                }
                webSocket.subscribe("/user/" + $("#userName").text() + "/location", realTimeMonitoring.updataRealTime,"/app/vehicle/location", requestStr);
            }
        },
        updataRealTime: function(msg){
            var data = $.parseJSON(msg.body)
             if(data.desc!=="neverOnline"){
                 if (data.desc.msgID === 512 || data.desc.msgID === 12384||data.desc.msgID === 4163) {
                     if(cheakdiyuealls.isHas(data.data.msgBody.vehicleId)){
                         realTimeMonitoring.updateTable(data);
                     }
                 }
             }else {
                 var brand = realTimeMonitoring.searchNeverOnline("treeDemo", data.vid)[0].name;
                 if (!cancelList.isHas(brand)) {
                     vehicle = [0, brand, '未上线', '', '', '', '', '', '', '', '', '', '', ''];
                     if ($realTimeStateTableList.children("tbody").children("tr").length == 0) {
                         var html = "<tr><td>" + tableIndex + "</td><td>" + brand + "</td><td>" + "未上线" + "</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>";
                         $realTimeStateTableList.children("tbody").append(html);
                         tableIndex++;
                         tableListLength++;
                     } else {
                         var creatIsFlag = true;
                         $realTimeStateTableList.children("tbody").children("tr").each(function () {
                             if ($(this).children("td:nth-child(2)").text() == brand) {
                                 creatIsFlag = false;
                             }
                         });
                         if (creatIsFlag) {
                             var html = "<tr><td>" + tableIndex + "</td><td>" + brand + "</td><td>" + "未上线" + "</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>";
                             $realTimeStateTableList.children("tbody").append(html);
                             tableIndex++;
                             tableListLength++;
                         }
                     }
                     if (dbClickHeighlight) {
                         realTimeMonitoring.tableHighlight(brand);
                     }
                     if (tableListLength <= 5) {
                         $MapContainer.css('height', (newMapHeight - (41 * tableListLength + 43 + 17)) + 'px');
                     }
                     if (tableListLength <= 5 && isSame == true) {
                         if (tableListLength == 5) {
                             $("#realTimeStateTable-div,#realTimeCall").css({
                                 "height": "266px",
                                 "overflow-y": "auto",
                                 "overflow-x": "auto"
                             })
                         }
                         $MapContainer.css('height', (newMapHeight - (41 * tableListLength + 43 + 17)) + 'px');
                     }
                     realTimeMonitoring.dataTableDbclick();
                 }
             }
        },
        updataRealTree: function(msg){
            var zTree = $.fn.zTree.getZTreeObj("treeDemo");
            vnodesId =[];
            vnodemId=[];
            vnodelmId = [];
            vnoderId = [];
            vnodeaId = [];
            vnodespId=[];
            var data = $.parseJSON(msg.body)
            if (data.desc.msgID == 39321) {
                var position = data.data;
                for (var i = 0; i < position.length; i++) {
                    if(position[i].vehicleStatus != 3){
                        lineV.push(position[i].vehicleId);
                    }
                    lineVid = realTimeMonitoring.unique(lineV);
                    if(position[i].vehicleStatus == 4 ) {
                        lineAs.push(position[i].vehicleId);
                        // lineAndStop = unique(lineAs)
                    } else if (position[i].vehicleStatus == 10) {
                        lineAr.push(position[i].vehicleId);
                        // lineAndRun = unique(lineAr);
                    } else if (position[i].vehicleStatus == 5) {
                        lineAa.push(position[i].vehicleId);
                        // lineAndAlarm = unique(lineAa);
                    } else if (position[i].vehicleStatus == 2) {
                        lineAm.push(position[i].vehicleId);
                        // lineAndmiss = unique(lineAm);
                    } else if (position[i].vehicleStatus == 3) {
                        changeMiss.push(position[i].vehicleId)
                    }else if(position[i].vehicleStatus == 9){
                        lineOs.push(position[i].vehicleId)
                    }
                }
                missVid=realTimeMonitoring.unique(changeMiss);
                lineAndStop = realTimeMonitoring.unique(lineAs);
                lineAndRun = realTimeMonitoring.unique(lineAr);
                lineAndAlarm = realTimeMonitoring.unique(lineAa);
                lineAndmiss = realTimeMonitoring.unique(lineAm);
                overSpeed=realTimeMonitoring.unique(lineOs);
                if(lineVid!=null){
                    nmoline=Array.minus(diyueall,lineVid);
                }else {
                    nmoline=diyueall;
                }
                neverOline=Array.minus(nmoline,missVid);
                var attrs;
                if (lineAndStop.length != 0) {
                    var len =lineAndStop.length;
                    for (var i = 0; i < len; i++) {
                        clineAndStop=lineAndStop[i];
                        var list=zTreeIdJson[clineAndStop];
                        if(list!=null){
                            $.each(list,function (index,value) {
                                var treeNode= zTree.getNodeByTId(value);
                                treeNode.iconSkin="btnImage iconArea onlineParking"
                                zTree.updateNode(treeNode);
                                $("#"+value+"_span")[0].style.color="#c80002";
                            })
                        }
                    }
                }
                if (lineAndmiss.length != 0) {
                    var len =lineAndmiss.length;
                    for (var i = 0; i < len; i++) {
                        clineAndmiss=lineAndmiss[i];
                        var list=zTreeIdJson[clineAndmiss];
                        if(list!=null) {
                            $.each(list, function (index, value) {
                                var treeNode = zTree.getNodeByTId(value);
                                treeNode.iconSkin = "button btnImage iconArea onlineNotPositioning"
                                zTree.updateNode(treeNode);
                                $("#" + value + "_span")[0].style.color = "#754801";
                            })
                        }
                    }
                }
                if (lineAndRun.length != 0) {
                    var len =lineAndRun.length;
                    for (var i = 0; i < len; i++) {
                        clineAndRun=lineAndRun[i];
                        var list=zTreeIdJson[clineAndRun];
                        if(list!=null) {
                            $.each(list, function (index, value) {
                                var treeNode = zTree.getNodeByTId(value);
                                treeNode.iconSkin = "button btnImage iconArea onlineDriving"
                                zTree.updateNode(treeNode);
                                $("#" + value + "_span")[0].style.color = "#78af3a";
                            })
                        }
                    }
                }
                if (lineAndAlarm.length != 0) {
                    var len =lineAndAlarm.length;
                    for (var i = 0; i < len; i++) {
                        clineAndAlarm=lineAndAlarm[i];
                        var list=zTreeIdJson[clineAndAlarm];
                        if(list!=null) {
                            $.each(list, function (index, value) {
                                var treeNode = zTree.getNodeByTId(value);
                                treeNode.iconSkin = "button btnImage iconArea warning"
                                zTree.updateNode(treeNode);
                                $("#" + value + "_span")[0].style.color = "#ffab2d";
                            })
                        }
                    }

                }
                if (overSpeed.length != 0) {
                    var len =overSpeed.length;
                    for (var i = 0; i < len; i++) {
                        coverSpeed=overSpeed[i];
                        var list=zTreeIdJson[coverSpeed];
                        if(list!=null) {
                            $.each(list, function (index, value) {
                                var treeNode = zTree.getNodeByTId(value);
                                treeNode.iconSkin = "btnImage iconArea speedLimitWarning"
                                zTree.updateNode(treeNode);
                                $("#" + value + "_span")[0].style.color = "#960ba3";
                            })
                        }
                    }

                }
                var Vjiaoji=Array.intersect(lineVid,diyueall);
                var vmiss=params.length-Vjiaoji.length
                // var vmiss=Array.intersect(missVid,diyueall);//不要删
                $("#tline").text("(" + Vjiaoji.length + ")");
                $("#tmiss").text("(" + vmiss + ")")
            }else if(data.desc.msgID == 34952){
                var upPosition = data.data;
                if(upPosition[0].vehicleStatus == 4 ) {
                    // lineAs.push(upPosition[0].vehicleId);
                    // lineAndStop = realTimeMonitoring.unique(lineAs)
                    lineAndStop.push(upPosition[0].vehicleId);
                    if(nmoline.isHas(upPosition[0].vehicleId)){
                        nmoline.remove(upPosition[0].vehicleId)
                    }
                    realTimeMonitoring.searchByFlag("treeDemo", upPosition[0].vehicleId, null, 4);
                } else if (upPosition[0].vehicleStatus == 10) {
                    // lineAr.push(upPosition[0].vehicleId);
                    // lineAndRun = realTimeMonitoring.unique(lineAr);
                    lineAndRun.push(upPosition[0].vehicleId);
                    if(nmoline.isHas(upPosition[0].vehicleId)){
                        nmoline.remove(upPosition[0].vehicleId)
                    }
                    realTimeMonitoring.searchByFlag("treeDemo", upPosition[0].vehicleId, null, 4);
                } else if (upPosition[0].vehicleStatus == 5) {
                    // lineAa.push(upPosition[0].vehicleId);
                    // lineAndAlarm = realTimeMonitoring.unique(lineAa);
                    lineAndAlarm.push(upPosition[0].vehicleId);
                    if(nmoline.isHas(upPosition[0].vehicleId)){
                        nmoline.remove(upPosition[0].vehicleId)
                    }
                    realTimeMonitoring.searchByFlag("treeDemo", upPosition[0].vehicleId, null, 4);
                } else if (upPosition[0].vehicleStatus == 2) {
                    // lineAm.push(upPosition[0].vehicleId);
                    // lineAndmiss = realTimeMonitoring.unique(lineAm);
                    lineAndmiss.push(upPosition[0].vehicleId);
                    if(nmoline.isHas(upPosition[0].vehicleId)){
                        nmoline.remove(upPosition[0].vehicleId)
                    }
                    realTimeMonitoring.searchByFlag("treeDemo", upPosition[0].vehicleId, null, 4);
                } else if (upPosition[0].vehicleStatus == 3) {
                    changeMiss.push(upPosition[0].vehicleId)
                }else if(upPosition[0].vehicleStatus == 9){
                    // lineOs.push(upPosition[0].vehicleId);
                    // overSpeed=realTimeMonitoring.unique(lineOs);
                    overSpeed.push(upPosition[0].vehicleId);
                    if(nmoline.isHas(upPosition[0].vehicleId)){
                        nmoline.remove(upPosition[0].vehicleId)
                    }
                    realTimeMonitoring.searchByFlag("treeDemo", upPosition[0].vehicleId, null, 4);
                }
                var list=zTreeIdJson[upPosition[0].vehicleId];
                if(list!=null){
                    $.each(list,function (index,value) {
                        zTree.showNode(zTree.getNodeByTId(value))
                    })
                }
                var i=$("#tline").text();
                var j=$("#tmiss").text();
                var iValue = Number(i.substring(1,i.length-1))+1;
                var jValue = Number(j.substring(1,j.length-1))-1;
                $("#tline").text("(" + iValue + ")")
                $("#tmiss").text("(" + jValue + ")");
            }else if(data.desc.msgID == 30583){
                var upPosition = data.data;
                if(upPosition!==null){
                    if(upPosition[0].vehicleStatus == 4 ) {
                        // lineAs.push(upPosition[0].vehicleId);
                        // lineAndStop = realTimeMonitoring.unique(lineAs)
                        lineAndRun.remove(upPosition[0].vehicleId);
                        lineAndAlarm.remove(upPosition[0].vehicleId);
                        lineAndmiss.remove(upPosition[0].vehicleId);
                        overSpeed.remove(upPosition[0].vehicleId);
                        nmoline.remove(upPosition[0].vehicleId);
                        lineAndStop.push(upPosition[0].vehicleId)
                        realTimeMonitoring.searchByFlag("treeDemo", upPosition[0].vehicleId, null, 4);
                    } else if (upPosition[0].vehicleStatus == 10) {
                        // lineAr.push(upPosition[0].vehicleId);
                        // lineAndRun = realTimeMonitoring.unique(lineAr);
                        lineAndStop.remove(upPosition[0].vehicleId);
                        lineAndAlarm.remove(upPosition[0].vehicleId);
                        lineAndmiss.remove(upPosition[0].vehicleId);
                        overSpeed.remove(upPosition[0].vehicleId);
                        nmoline.remove(upPosition[0].vehicleId);
                        lineAndRun.push(upPosition[0].vehicleId)
                        realTimeMonitoring.searchByFlag("treeDemo", upPosition[0].vehicleId, null, 4);
                    } else if (upPosition[0].vehicleStatus == 5) {
                        // lineAa.push(upPosition[0].vehicleId);
                        // lineAndAlarm = realTimeMonitoring.unique(lineAa);
                            lineAndStop.remove(upPosition[0].vehicleId);
                            lineAndRun.remove(upPosition[0].vehicleId);
                            lineAndmiss.remove(upPosition[0].vehicleId);
                            overSpeed.remove(upPosition[0].vehicleId);
                            nmoline.remove(upPosition[0].vehicleId);
                            lineAndAlarm.push(upPosition[0].vehicleId)
                        realTimeMonitoring.searchByFlag("treeDemo", upPosition[0].vehicleId, null, 4);
                    } else if (upPosition[0].vehicleStatus == 2) {
                        // lineAm.push(upPosition[0].vehicleId);
                        // lineAndmiss = realTimeMonitoring.unique(lineAm);
                            lineAndStop.remove(upPosition[0].vehicleId);
                            lineAndRun.remove(upPosition[0].vehicleId);
                            lineAndAlarm.remove(upPosition[0].vehicleId);
                            overSpeed.remove(upPosition[0].vehicleId);
                            nmoline.remove(upPosition[0].vehicleId);
                            lineAndmiss.push(upPosition[0].vehicleId)
                        realTimeMonitoring.searchByFlag("treeDemo", upPosition[0].vehicleId, null, 4);
                    } else if (upPosition[0].vehicleStatus == 3) {
                            lineAndStop.remove(upPosition[0].vehicleId);
                            lineAndRun.remove(upPosition[0].vehicleId);
                            lineAndAlarm.remove(upPosition[0].vehicleId);
                            lineAndmiss.remove(upPosition[0].vehicleId);
                            overSpeed.remove(upPosition[0].vehicleId);
                        nmoline.push(upPosition[0].vehicleId);
                        realTimeMonitoring.searchByFlag("treeDemo", upPosition[0].vehicleId, null, 4);
                        var list=zTreeIdJson[upPosition[0].vehicleId];
                        if(list!=null){
                            $.each(list,function (index,value) {
                                zTree.hideNode(zTree.getNodeByTId(value))
                            })
                        }
                        var i=$("#tline").text();
                        var j=$("#tmiss").text();
                        var iValue = Number(i.substring(1,i.length-1))-1;
                        var jValue = Number(j.substring(1,j.length-1))+1;
                        $("#tline").text("(" + iValue + ")")
                        $("#tmiss").text("(" + jValue + ")");
                    }else if(upPosition[0].vehicleStatus == 9){
                        // lineOs.push(upPosition[0].vehicleId);
                        // overSpeed=realTimeMonitoring.unique(lineOs);
                        // if(lineAndStop.isHas(upPosition[0].vehicleId)){
                            lineAndStop.remove(upPosition[0].vehicleId);
                        // }
                        // if(lineAndRun.isHas(upPosition[0].vehicleId)){
                            lineAndRun.remove(upPosition[0].vehicleId);
                        // }
                        // if(lineAndAlarm.isHas(upPosition[0].vehicleId)){
                            lineAndAlarm.remove(upPosition[0].vehicleId);
                        // }
                        // if(lineAndmiss.isHas(upPosition[0].vehicleId)){
                            lineAndmiss.remove(upPosition[0].vehicleId);
                        // }
                        // if(nmoline.isHas(upPosition[0].vehicleId)){
                            nmoline.remove(upPosition[0].vehicleId);
                        // }
                           overSpeed.push(upPosition[0].vehicleId)
                        realTimeMonitoring.searchByFlag("treeDemo", upPosition[0].vehicleId, null, 4);
                    }
                }
            }
        },
        arrC: function(arr1, arr2){
            var arr3 = [];
            for (var i = 0; i < arr1.length; i++) {
                var flag = true;
                for (var j = 0; j < arr2.length; j++) {
                    if (arr1[i] === arr2[j])
                        flag = false;
                }
                if (flag)
                    arr3.push(arr1[i]);
            }
            return realTimeMonitoring.unique(arr3);
        },
        updateTable: function(position){
            var msgBody = position.data.msgBody;
            var license = msgBody.plateFormAttachInfo.vehicleLicense;
            var vehicleId=msgBody.vehicleId;
            if(cancelList.indexOf(license)>=0){
                return;
            }
            var acc = msgBody.status+"";
            if(acc.length>3 && acc.length != 32){
                 acc = msgBody.status & 1;
            }else if(acc.length == 32){
                acc = (msgBody.status).substring(18,19);
            }else{
                acc = msgBody.status;
            }
            var time = msgBody.gps_time + '';
            if(time.length>13){
                time = time.substring(2,14);
            }
            var gpsAttachInfoLsit = msgBody.gpsAttachInfoLsit;
            var gpsAttachInfo;
            var mileage = 0;
            var oil = 0;
            var drivers = msgBody.plateFormAttachInfo.driverName;
            if(gpsAttachInfoLsit!=null){
                for (var i = 0; i < gpsAttachInfoLsit.length; i++) {
                    gpsAttachInfo = gpsAttachInfoLsit[i];
                    if (gpsAttachInfo.gpsAttachInfoID === 1) {
                        mileage = gpsAttachInfo.mileage;
                        break;
                    }
                }
            }else {
                mileage = msgBody.mileage*10;
            }
            var testInfo = [];//初始标注数据
            testInfo.push(msgBody.plateFormAttachInfo.vehicleLicense);
            testInfo.push(msgBody.plateFormAttachInfo.vehicleTypeName === undefined ? '未设置分类' : msgBody.plateFormAttachInfo.vehicleTypeName);
            testInfo.push(msgBody.plateFormAttachInfo.groupNames === undefined ? '未绑定分组' : msgBody.plateFormAttachInfo.groupNames);
            testInfo.push(position.desc.topic);
            if(position.data.msgHead!=undefined){
                testInfo.push(position.data.msgHead.mobile);
            }else {
                testInfo.push(msgBody.plateFormAttachInfo.phone);
            }
            testInfo.push(msgBody.plateFormAttachInfo.todayDistance=== undefined ? '0' : msgBody.plateFormAttachInfo.todayDistance/10);
            testInfo.push(parseInt(mileage) / 10);
            testInfo.push((msgBody.gps_speed / 10).toFixed(2));
            if((acc+"").length==1){
                testInfo.push(acc == 0 ? "关" : "开");
            }else if(acc=="21"){
                testInfo.push("点火静止");
            }else if(acc=="16"){
                testInfo.push("熄火拖车");
            }else if(acc=="1A"){
                testInfo.push("熄火假拖车");
            }else if(acc=="11"){
                testInfo.push("熄火静止");
            }else if(acc=="12"){
                testInfo.push("熄火移动");
            }else if(acc=="22"){
                testInfo.push("点火移动");
            }else if(acc=="41"){
                testInfo.push("无点火静止");
            }else if(acc=="42"){
                testInfo.push("无点火移动");
            }
            testInfo.push(msgBody.gps_speed == 0 ? "在线停车" : "在线行驶");                        
            var oilExpend = msgBody.oilExpend;
            if(oilExpend!=undefined){
                for (var i = 0; i < oilExpend.length; i++) {
                    oil += oilExpend[i].allExpend;
                }
            }
            var angle = msgBody.gps_direction;
            var direction = realTimeMonitoring.toDirectionStr(angle);
            var latitude;
            var longitude;
            if(msgBody.gps_latitude<1000&&msgBody.gps_longitude<1000){
                latitude = msgBody.gps_latitude.toFixed(6);//纬度
                longitude = msgBody.gps_longitude.toFixed(6);//经度
            }else {
                latitude = msgBody.gps_latitude / 1000000;//纬度
                longitude = msgBody.gps_longitude / 1000000;//经度
            }
            //逆地理编码
            var lnglatXY = [longitude, latitude];
            var geocoder = new AMap.Geocoder({
                radius: 1000,
                extensions: "all",
                batch:false
            });
            testInfo.push(20 + time.substring(0, 2) + "-" + time.substring(2, 4) + "-" + time.substring(4, 6) + " " +
                time.substring(6, 8) + ":" + time.substring(8, 10) + ":" + time.substring(10, 12));
            testInfo.push(latitude);
            testInfo.push(longitude);
            testInfo.push(msgBody.vehicleId);
            var carAddress;
            var carIndex = 1;
            geocoder.getAddress(lnglatXY, function (status, result) {
                if (status === 'complete' && result.info === 'OK') {
                    carAddress = result.regeocode.formattedAddress;
                };
                //逆地理编码 end 
                var timeFormat = 20 + time.substring(0, 2) + "-" + time.substring(2, 4) + "-" + time.substring(4, 6) + " " +
                time.substring(6, 8) + ":" + time.substring(8, 10) + ":" + time.substring(10, 12);
                if(!cancelList.isHas(msgBody.plateFormAttachInfo.vehicleLicense)&&cheakdiyuealls.isHas(vehicleId)) {
                    var vehicle = [0, msgBody.plateFormAttachInfo.vehicleLicense, timeFormat, msgBody.plateFormAttachInfo.groupNames === undefined ? '未绑定分组' : msgBody.plateFormAttachInfo.groupNames, msgBody.plateFormAttachInfo.vehicleTypeName === undefined ? '未设置分类' : msgBody.plateFormAttachInfo.vehicleTypeName, testInfo[8], msgBody.gps_speed === 0 ? "在线停车" : "在线行驶",
                        (msgBody.gps_speed / 10).toFixed(2), direction, msgBody.plateFormAttachInfo.todayDistance === undefined ? '0' : (msgBody.plateFormAttachInfo.todayDistance / 10).toFixed(1), parseInt(mileage) / 10, msgBody.plateFormAttachInfo.todayOilExpand === undefined ? '0' : msgBody.plateFormAttachInfo.todayOilExpand / 100, parseInt(oil) / 100, carAddress === undefined ? "未定位" : carAddress];
                    realTimeMonitoring.updateRow('#realTimeStateTable', realTimeSet, vehicle);

                    if (msgBody.alarm != undefined) {
                        var alarmSign = msgBody.alarm;
                        if (alarmSign !== 0) {
                            var alarmStr = '';
                            alarmStr = realTimeMonitoring.getAlarmSign(alarmSign, alarmStr);
                            var alarm = [0, msgBody.plateFormAttachInfo.vehicleLicense, msgBody.plateFormAttachInfo.groupNames == undefined ? '未绑定分组' : msgBody.plateFormAttachInfo.groupNames, msgBody.plateFormAttachInfo.vehicleTypeName == undefined ? '未设置分类' : msgBody.plateFormAttachInfo.vehicleTypeName, alarmStr, drivers == undefined ? '未绑定从业人员' : drivers, timeFormat, carAddress === undefined ? "未定位" : carAddress, ''];
                            realTimeMonitoring.updateRow('#alarmTable', alarmSet, alarm);
                            var alarmLength = $alarmTable.children("tbody").children("tr").length;
                            alarmNum++;
                            alarmNum = alarmLength;
                            $("#showAlarmNum").text(alarmNum);
                            var alarmVid = msgBody.plateFormAttachInfo.vehicleLicense;
                            var type = alarmStr;
                            var content = msgBody.plateFormAttachInfo.vehicleLicense + " " + timeFormat + " " + alarmStr;
                            //判断报警信息
                            if (alarmNum > 0) {
                                //判断浏览器版本 声音
                                if (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.split(";")[1].replace(/[ ]/g, "") == "MSIE9.0") {
                                    $alarmMsgBox.html('<embed src="../../file/music/alarm.wav"/>');
                                } else {
                                    //判断开关状态
                                    if ($alarmSoundSpan.hasClass("soundOpen")) {
                                        $alarmMsgBox.html('<audio id="alarmMsgAutoOff" src="../../file/music/alarm.wav" autoplay="autoplay"></audio>');
                                    } else {
                                        $alarmMsgBox.html('<audio id="alarmMsgAutoOff" src="../../file/music/alarm.wav"></audio>');
                                    }
                                }
                                //闪烁
                                if ($alarmFlashesSpan.hasClass("flashesOpen")) {
                                    $showAlarmWinMark.css("background-position", "0px -134px");
                                    setTimeout(function () {
                                        $showAlarmWinMark.css("background-position", "0px 0px");
                                    }, 1500)
                                } else {
                                    $showAlarmWinMark.css("background-position", "0px 0px");
                                }
                                realTimeMonitoring.showAlarmWindow();
                            }
                        }
                    }
                }
            });
            realTimeMonitoring.completeEventHandler(testInfo);
        },
        getAlarmSign: function(alarmSign,alarmStr){
            if ((alarmSign & 0x01) !== 0) {
                alarmStr += "紧急报警,";
            }
            if ((alarmSign & 0x02) !== 0) {
                alarmStr += "超速报警,";
            }
            if ((alarmSign & 0x04) !== 0) {
                alarmStr += "疲劳驾驶,";
            }
            if ((alarmSign & 0x08) !== 0) {
                alarmStr += "危险预警,";
            }
            if ((alarmSign & 0x10) !== 0) {
                alarmStr += "GNSS模块发生故障,";
            }
            if ((alarmSign & 0x20) !== 0) {
                alarmStr += "GNSS天线未接或被剪断,";
            }
            if ((alarmSign & 0x40) !== 0) {
                alarmStr += "GNSS天线短路,";
            }
            if ((alarmSign & 0x80) !== 0) {
                alarmStr += "终端主电源欠压,";
            }
            if ((alarmSign & 0x100) !== 0) {
                alarmStr += "终端主电源掉电,";
            }
            if ((alarmSign & 0x200) !== 0) {
                alarmStr += "终端LCD或显示器故障,";
            }
            if ((alarmSign & 0x400) !== 0) {
                alarmStr += "TTS模块故障,";
            }
            if ((alarmSign & 0x800) !== 0) {
                alarmStr += "摄像头故障,";
            }
            if ((alarmSign & 0x1000) !== 0) {
                alarmStr += "道路运输证IC卡模块故障,";
            }
            if ((alarmSign & 0x2000) !== 0) {
                alarmStr += "超速预警,";
            }
            if ((alarmSign & 0x4000) !== 0) {
                alarmStr += "疲劳驾驶预警,";
            }
            if ((alarmSign & 0x40000) !== 0) {
                alarmStr += "当天累计驾驶超时,";
            }
            if ((alarmSign & 0x80000) !== 0) {
                alarmStr += "超时停车,";
            }
            if ((alarmSign & 0x100000) !== 0) {
                alarmStr += "进出区域,";
            }
            if ((alarmSign & 0x200000) !== 0) {
                alarmStr += "进出路线,";
            }
            if ((alarmSign & 0x400000) !== 0) {
                alarmStr += "路段行驶时间不足/过长,";
            }
            if ((alarmSign & 0x800000) !== 0) {
                alarmStr += "路线偏离报警,";
            }
            if ((alarmSign & 0x1000000) !== 0) {
                alarmStr += "车辆VSS故障,";
            }
            if ((alarmSign & 0x2000000) !== 0) {
                alarmStr += "车辆油量异常,";
            }
            if ((alarmSign & 0x4000000) !== 0) {
                alarmStr += "车辆被盗,";
            }
            if ((alarmSign & 0x8000000) !== 0) {
                alarmStr += "车辆非法点火,";
            }
            if ((alarmSign & 0x10000000) !== 0) {
                alarmStr += "车辆非法位移,";
            }
            if ((alarmSign & 0x20000000) !== 0) {
                alarmStr += "碰撞预警,";
            }
            if ((alarmSign & 0x40000000) !== 0) {
                alarmStr += "侧翻预警,";
            }
            if ((alarmSign & 0x80000000) !== 0) {
                alarmStr += "非法开门报警,";
            }
            if (alarmStr !== '') {
                alarmStr = alarmStr.substring(0, alarmStr.length - 1);
            }
            return alarmStr;
        },
        toDirectionStr: function(angle){
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
            return direction;
        },
        //点击页面隐藏相应的ul下拉列表
        updateRow: function(table, dataSet, obj){
          if(obj.length == 14){
        	  isSame = true;
              if($realTimeStateTableList.children("tbody").children("tr").text() == ""){
            	  var html = "<tr><td>"+ tableIndex +"</td><td>"+ obj[1] +"</td><td>"+ obj[2] +"</td><td>"+ obj[3] +"</td><td>"+ obj[4] +"</td><td>"+ obj[5] +"</td><td>"+ obj[6] +"</td><td>"+ obj[7] +"</td><td>"+ obj[8] +"</td><td>"+ obj[9] +"</td><td>"+ obj[10] +"</td><td>"+ obj[11] +"</td><td>"+ obj[12] +"</td><td>"+ obj[13] +"</td></tr>";
            	  $realTimeStateTableList.children("tbody").append(html);
            	  dataTableInit = false;
            	  tableIndex++;
            	  tableListLength++;
              }else{
            	  $realTimeStateTableList.children("tbody").children("tr").each(function(){
                  if($(this).children("td:nth-child(2)").text() == obj[1]){
                    $(this).html("<td>"+ $(this).children("td:nth-child(1)").text() +"</td><td>"+ obj[1] +"</td><td>"+ obj[2] +"</td><td>"+ obj[3] +"</td><td>"+ obj[4] +"</td><td>"+ obj[5] +"</td><td>"+ obj[6] +"</td><td>"+ obj[7] +"</td><td>"+ obj[8] +"</td><td>"+ obj[9] +"</td><td>"+ obj[10] +"</td><td>"+ obj[11] +"</td><td>"+ obj[12] +"</td><td>"+ obj[13] +"</td>");
                    isSame = false;
                  }
                });
                if(isSame){
                  var html = "<tr><td>"+ tableIndex +"</td><td>"+ obj[1] +"</td><td>"+ obj[2] +"</td><td>"+ obj[3] +"</td><td>"+ obj[4] +"</td><td>"+ obj[5] +"</td><td>"+ obj[6] +"</td><td>"+ obj[7] +"</td><td>"+ obj[8] +"</td><td>"+ obj[9] +"</td><td>"+ obj[10] +"</td><td>"+ obj[11] +"</td><td>"+ obj[12] +"</td><td>"+ obj[13] +"</td></tr>";
                  $realTimeStateTableList.children("tbody").append(html);
                    tableIndex++;
                    tableListLength++;
                }
              }
              if(tableListLength <= 5 && isSame == true){
            	  if(tableListLength == 5){
            		  $("#realTimeStateTable-div").css({
            			  "height":"266px",
            			  "overflow-y":"auto",
            			  "overflow-x":"auto"
            		  })
            	  }
            	  $MapContainer.css('height',(newMapHeight-(41*tableListLength+43 + 17))+'px');
              }
          }else{
        	//报警记录追加到表格
            dengerIsSame = true;
            if($alarmTable.children("tbody").text() == ""){
            	var html = "<tr><td>"+ dengerIndex +"</td><td>"+ obj[1] +"</td><td>"+ obj[2] +"</td><td>"+ obj[3] +"</td><td>"+ obj[4] +"</td><td>"+ obj[5] +"</td><td>"+ obj[6] +"</td><td>"+ obj[7] +"</td><td>"+ obj[8] +"</td></tr>"
            	$alarmTable.children("tbody").append(html);
            	dengerIndex++;
            }else{
              $alarmTable.children("tbody").children("tr").each(function(){
                  if($(this).children("td:nth-child(2)").text() == obj[1]){
                    $(this).html("<td>"+ $(this).children("td:nth-child(1)").text() +"</td><td>"+ obj[1] +"</td><td>"+ obj[2] +"</td><td>"+ obj[3] +"</td><td>"+ obj[4] +"</td><td>"+ obj[5] +"</td><td>"+ obj[6] +"</td><td>"+ obj[7] +"</td><td>"+ obj[8] +"</td>");
                    dengerIsSame = false;
                  }
                });
                if(dengerIsSame){
                  var html = "<tr><td>"+ dengerIndex +"</td><td>"+ obj[1] +"</td><td>"+ obj[2] +"</td><td>"+ obj[3] +"</td><td>"+ obj[4] +"</td><td>"+ obj[5] +"</td><td>"+ obj[6] +"</td><td>"+ obj[7] +"</td><td>"+ obj[8] +"</td></tr>";
                  $alarmTable.children("tbody").append(html);
                  dengerIndex++;
                }
             }
            var alarLength = $("#alarmTable tbody tr").length;
            if(alarLength == 5){
            	$("#realTimeCall").css({
            		"height":"266px",
      			  	"overflow-y":"auto",
      			  	"overflow-x":"auto"
            	})
            }
            realTimeMonitoring.alarmInfoDataDbclick();
          }
          if(dbClickHeighlight){
        	  realTimeMonitoring.tableHighlight(licensePlateInformation);
          }
          realTimeMonitoring.dataTableDbclick();
        },
        deleteRowByRealTime: function(table, dataSet, plateNumber){
        	$realTimeStateTableList.children("tbody").children("tr").each(function(){
          if($(this).children("td:nth-child(2)").text() == plateNumber[0]){
            $(this).remove();
            tableIndex--;
            tableListLength--;
            if(tableListLength <= 5){
            	$MapContainer.css('height',(newMapHeight-(41*tableListLength+43 + 17))+'px');
            }
          }
        });
          $alarmTable.children("tbody").children("tr").each(function(){
          if($(this).children("td:nth-child(2)").text() == plateNumber[0]){
        	  $(this).remove();
        	  dengerIndex--;
          }
        });
        var dengerNum = $alarmTable.children("tbody").children("tr").length;
        if(dengerNum != 0){
        var alarmIndex = 1;
        $alarmTable.children("tbody").children("tr").each(function(){
            $(this).children("td:nth-child(1)").text(alarmIndex);
            alarmIndex++;
            });
        }
        if(tableListLength == 0){
           $MapContainer.css('height',newMapHeight+'px');
        };
        //序号重新进行排序
        var index = 1;
        $realTimeStateTableList.children("tbody").children("tr").each(function(){
            $(this).children("td:nth-child(1)").html(index);
            index++;
        });
        },
        deleteRowByAlarm: function(table, dataSet, plateNumber){
        	$realTimeStateTableList.children("tbody").children("tr").each(function(){
        		var s = $(this).children("td:nth-child(2)").text();
        		if($(this).children("td:nth-child(2)").text() == plateNumber[0]){
        		}
        	});
        },

        showMisses: function(){
            var zTree = $.fn.zTree.getZTreeObj("treeDemo");
            if ($showMiss.is(':checked') == true) {
                var len =nmoline.length;
                var sarrp;
                for (var i = 0; i < len; i++) {
                    cnmoline=nmoline[i];
                    var list=zTreeIdJson[cnmoline];
                    if(list!=null){
                        $.each(list,function (index,value) {
                            zTree.showNode(zTree.getNodeByTId(value))
                        })
                    }
                }
            } else {
                var len =nmoline.length;
                var sarrp;
                for (var i = 0; i < len; i++) {
                    cnmoline=nmoline[i];
                    var list=zTreeIdJson[cnmoline];
                    if(list!=null) {
                        $.each(list, function (index, value) {
                            zTree.hideNode(zTree.getNodeByTId(value))
                        })
                    }
                }
            }
        },
        showlineAndRun: function(){
            var zTree = $.fn.zTree.getZTreeObj("treeDemo");
            if ($showRun.is(':checked') == true) {
                var len =lineAndRun.length;
                for (var i = 0; i < len; i++) {
                    clineAndRun=lineAndRun[i];
                    var list=zTreeIdJson[clineAndRun];
                    if(list!=null) {
                        $.each(list, function (index, value) {
                            zTree.showNode(zTree.getNodeByTId(value))
                        })
                    }
                }
            } else {
                var len =lineAndRun.length;
                for (var i = 0; i < len; i++) {
                    clineAndRun=lineAndRun[i];
                    var list=zTreeIdJson[clineAndRun];
                    if(list!=null) {
                        $.each(list, function (index, value) {
                            zTree.hideNode(zTree.getNodeByTId(value))
                        })
                    }
                }
            }
        },
        showlineAndStop: function(){
            var zTree = $.fn.zTree.getZTreeObj("treeDemo");
            if ($showStop.is(':checked') == true) {
                var len =lineAndStop.length;
                for (var i = 0; i < len; i++) {
                    clineAndStop=lineAndStop[i];
                    var list=zTreeIdJson[clineAndStop];
                    if(list!=null) {
                        $.each(list, function (index, value) {
                            zTree.showNode(zTree.getNodeByTId(value))
                        })
                    }

                }
            } else {
                var len =lineAndStop.length;
                for (var i = 0; i < len; i++) {
                    clineAndStop=lineAndStop[i];
                    var list=zTreeIdJson[clineAndStop];
                    if(list!=null) {
                        $.each(list, function (index, value) {
                            zTree.hideNode(zTree.getNodeByTId(value))
                        })
                    }
                }
            }
        },
        showlineAndAlarm: function(){
            var zTree = $.fn.zTree.getZTreeObj("treeDemo");
            if ($showAlarm.is(':checked') == true) {
                var len =lineAndAlarm.length;
                for (var i = 0; i < len; i++) {
                    clineAndAlarm=lineAndAlarm[i];
                    var list=zTreeIdJson[clineAndAlarm];
                    if(list!=null) {
                        $.each(list, function (index, value) {
                            zTree.showNode(zTree.getNodeByTId(value))
                        })
                    }
                }
            } else {
                var len =lineAndAlarm.length;
                for (var i = 0; i < len; i++) {
                    clineAndAlarm=lineAndAlarm[i];
                    var list=zTreeIdJson[clineAndAlarm];
                    if(list!=null) {
                        $.each(list, function (index, value) {
                            zTree.hideNode(zTree.getNodeByTId(value))
                        })
                    }
                }
            }
        },

        showMissW: function(){
            var zTree = $.fn.zTree.getZTreeObj("treeDemo");
            if ($missW.is(':checked') == true) {
                var len =lineAndmiss.length;
                for (var i = 0; i < len; i++) {
                    clineAndmiss=lineAndmiss[i];
                    var list=zTreeIdJson[clineAndmiss];
                    if(list!=null) {
                        $.each(list, function (index, value) {
                            zTree.showNode(zTree.getNodeByTId(value))
                        })
                    }
                }
            } else {
                var len =lineAndmiss.length;
                for (var i = 0; i < len; i++) {
                    clineAndmiss=lineAndmiss[i];
                    var list=zTreeIdJson[clineAndmiss];
                    if(list!=null) {
                        $.each(list, function (index, value) {
                            zTree.hideNode(zTree.getNodeByTId(value))
                        })
                    }
                }
            }
        },

        showOverSpeed: function(){
            var zTree = $.fn.zTree.getZTreeObj("treeDemo");
            if ($overSpeed.is(':checked') == true) {
                var len =overSpeed.length;
                for (var i = 0; i < len; i++) {
                    coverSpeed=overSpeed[i];
                    var list=zTreeIdJson[coverSpeed];
                    if(list!=null) {
                        $.each(list, function (index, value) {
                            zTree.showNode(zTree.getNodeByTId(value))
                        })
                    }
                }
            } else {
                var len =overSpeed.length;
                for (var i = 0; i < len; i++) {
                    coverSpeed=overSpeed[i];
                    var list=zTreeIdJson[coverSpeed];
                    if(list!=null) {
                        $.each(list, function (index, value) {
                            zTree.hideNode(zTree.getNodeByTId(value))
                        })
                    }
                }
            }
        },

        //隐藏条件节点
        hideNo: function(treeId, searchConditionId){
            //<2>.得到模糊匹配搜索条件的节点数组集合
            var highlightNodes = new Array();
            var treeObj = $.fn.zTree.getZTreeObj(treeId);
            if (searchConditionId != "") {
                highlightNodes = treeObj.getNodesByParamFuzzy("id", searchConditionId, null);
            }
            treeObj.hideNodes(highlightNodes)
        },
        //显示条件节点
        showNo: function(treeId, searchConditionId){
            //<2>.得到模糊匹配搜索条件的节点数组集合
            var highlightNodes = new Array();
            var treeObj = $.fn.zTree.getZTreeObj(treeId);
            if (searchConditionId != "") {
                highlightNodes = treeObj.getNodesByParamFuzzy("id", searchConditionId, null);
            }
            treeObj.showNodes(highlightNodes)
        },
        //刷新树
        refreshTree: function(){
             lineAr = [];
             lineAs = [];
             lineAa = [];
             lineAm = [];
             lineOs=[];
             changeMiss=[];
            webSocket.init('/clbs/vehicle');
            webSocket.subscribe('/user/'+ $("#userName").text() + '/cachestatus', realTimeMonitoring.updataRealTree,"/app/vehicle/subscribecachestatus", requestStrS);
            $thetree.animate({scrollTop: 0});//回到顶端
        },
        mapVehicle: function(){
            this.elements = new Array();
            //获取MAP元素个数
            this.size = function() {
                return this.elements.length;
            };
            //判断MAP是否为空
            this.isEmpty = function() {
                return (this.elements.length < 1);
            };
            //删除MAP所有元素
            this.clear = function() {
                this.elements = new Array();
            };
            //向MAP中增加元素（key, value)
            this.put = function(_key, _value) {
                this.elements.push( {
                    key : _key,
                    value : _value
                });
            };
            //删除指定KEY的元素，成功返回True，失败返回False
            this.remove = function(_key) {
                var bln = false;
                try {
                    for (i = 0; i < this.elements.length; i++) {
                        if (this.elements[i].key == _key) {
                            this.elements.splice(i, 1);
                            return true;
                        }
                    }
                } catch (e) {
                    bln = false;
                }
                return bln;
            };
            //获取指定KEY的元素值VALUE，失败返回NULL
            this.get = function(_key) {
                try {
                    for (i = 0; i < this.elements.length; i++) {
                        if (this.elements[i].key == _key) {
                            return this.elements[i].value;
                        }
                    }
                } catch (e) {
                    return null;
                }
            };
            //获取指定索引的元素（使用element.key，element.value获取KEY和VALUE），失败返回NULL
            this.element = function(_index) {
                if (_index < 0 || _index >= this.elements.length) {
                    return null;
                }
                return this.elements[_index];
            };
            //判断MAP中是否含有指定KEY的元素
            this.containsKey = function(_key) {
                var bln = false;
                try {
                    for (i = 0; i < this.elements.length; i++) {
                        if (this.elements[i].key == _key) {
                            bln = true;
                        }
                    }
                } catch (e) {
                    bln = false;
                }
                return bln;
            };
            //判断MAP中是否含有指定VALUE的元素
            this.containsValue = function(_value) {
                var bln = false;
                try {
                    for (i = 0; i < this.elements.length; i++) {
                        if (this.elements[i].value == _value) {
                            bln = true;
                        }
                    }
                } catch (e) {
                    bln = false;
                }
                return bln;
            };
            //获取MAP中所有VALUE的数组（ARRAY）
            this.values = function() {
                var arr = new Array();
                for (i = 0; i < this.elements.length; i++) {
                    arr.push(this.elements[i].value);
                }
                return arr;
            };
            //获取MAP中所有KEY的数组（ARRAY）
            this.keys = function() {
                var arr = new Array();
                for (i = 0; i < this.elements.length; i++) {
                    arr.push(this.elements[i].key);
                }
                return arr;
            };
        },
        hidNeverOnline: function(){
            for (var i = 0; i < neverOline.length; i++) {
                realTimeMonitoring.hideNo("treeDemo", neverOline[i])
            }
        },
        showNeverOnline: function(){
            for (var i = 0; i < neverOline.length; i++) {
                realTimeMonitoring.showNo("treeDemo", neverOline[i])
            }
        },
        //筛选车辆
        chooseMiss: function(){
            if(flagR==true){
                // setTimeout(function () {
                    realTimeMonitoring.chooseRun();
                    $chooseRun.css("text-decoration","none");
                // }, 0);
            }
            if(flagN==true){
                // setTimeout(function () {
                realTimeMonitoring.chooseNot();
                $chooseNot.css("text-decoration","none");
                // }, 0);
            }
            if(flagA==true){
                // setTimeout(function () {
                realTimeMonitoring.chooseAlam();
                $chooseAlam.css("text-decoration","none");
                // }, 0);
            }
            if(flagS==true){
                // setTimeout(function () {
                realTimeMonitoring.chooseStop();
                $chooseStop.css("text-decoration","none");
                // }, 0);
            }
            if(flagO==true){
                // setTimeout(function () {
                realTimeMonitoring.chooseOverSeep();
                $chooseOverSeep.css("text-decoration","none");
                // }, 0);
            }
            if(!$showMiss.is(':checked')){
                $showMiss.click();
            }
            if($showRun.is(':checked')){
                $showRun.click();
            }
            if($showStop.is(':checked')){
                $showStop.click();
            }
            if($showAlarm.is(':checked')){
                $showAlarm.click();
            }
            if($missW.is(':checked')){
                $missW.click();
            }
            if($overSpeed.is(':checked')){
                $overSpeed.click();
            }
            if(flagM==false){
                $online.css("text-decoration","none");
                flagT=false;
                $chooseMiss.css("text-decoration","underline");
                flagM=true;
            }else{
                if(!$showRun.is(':checked')){
                    $showRun.click();
                }
                if(!$showStop.is(':checked')){
                    $showStop.click();
                }
                if(!$showAlarm.is(':checked')){
                    $showAlarm.click();
                }
                if(!$missW.is(':checked')){
                    $missW.click();
                }
                if(!$overSpeed.is(':checked')){
                    $overSpeed.click();
                }
                $chooseMiss.css("text-decoration","none");
                flagM=false;
            }
        },
        chooseRun: function(){
            if(flagM==true){
                // setTimeout(function () {
                realTimeMonitoring.chooseMiss();
                $chooseMiss.css("text-decoration","none");
                // }, 0);
            }
            if(flagN==true){
                // setTimeout(function () {
                realTimeMonitoring.chooseNot();
                $chooseNot.css("text-decoration","none");
                // }, 0);
            }
            if(flagA==true){
                // setTimeout(function () {
                realTimeMonitoring.chooseAlam();
                $chooseAlam.css("text-decoration","none");
                // }, 0);
            }
            if(flagS==true){
                // setTimeout(function () {
                realTimeMonitoring.chooseStop();
                $chooseStop.css("text-decoration","none");
                // }, 0);
            }
            if(flagO==true){
                // setTimeout(function () {
                realTimeMonitoring.chooseOverSeep();
                $chooseOverSeep.css("text-decoration","none");
                // }, 0);
            }
            if($showMiss.is(':checked')){
                $showMiss.click();
            }
            if($showStop.is(':checked')){
                $showStop.click();
            }
            if($showAlarm.is(':checked')){
                $showAlarm.click();
            }
            if($missW.is(':checked')){
                $missW.click();
            }
            if($overSpeed.is(':checked')){
                $overSpeed.click();
            }
            if(flagR==false){
                $online.css("text-decoration","none");
                flagT=false;
                $chooseRun.css("text-decoration","underline");
                flagR=true;
            }else{

                if(!$showMiss.is(':checked')){
                    $showMiss.click();
                }
                if(!$showStop.is(':checked')){
                    $showStop.click();
                }
                if(!$showAlarm.is(':checked')){
                    $showAlarm.click();
                }
                if(!$missW.is(':checked')){
                    $missW.click();
                }
                if(!$overSpeed.is(':checked')){
                    $overSpeed.click();
                }
                $chooseRun.css("text-decoration","none");
                realTimeMonitoring.showNeverOnline();
                flagR=false;
            }
        },
        chooseNot: function(){
            if(flagR==true){
                // setTimeout(function () {
                realTimeMonitoring.chooseRun();
                $chooseRun.css("text-decoration","none");
                // }, 0);
            }
            if(flagM==true){
                // setTimeout(function () {
                realTimeMonitoring.chooseMiss();
                $chooseMiss.css("text-decoration","none");
                // }, 0);
            }
            if(flagA==true){
                // setTimeout(function () {
                realTimeMonitoring.chooseAlam();
                $chooseAlam.css("text-decoration","none");
                // }, 0);
            }
            if(flagS==true){
                // setTimeout(function () {
                realTimeMonitoring.chooseStop();
                $chooseStop.css("text-decoration","none");
                // }, 0);
            }
            if(flagO==true){
                // setTimeout(function () {
                realTimeMonitoring.chooseOverSeep();
                $chooseOverSeep.css("text-decoration","none");
                // }, 0);
            }
            if($showMiss.is(':checked')){
                $showMiss.click();
            }
            if($showStop.is(':checked')){
                $showStop.click();
            }
            if($showAlarm.is(':checked')){
                $showAlarm.click();
            }
            if($showRun.is(':checked')){
                $showRun.click();
            }
            if($overSpeed.is(':checked')){
                $overSpeed.click();
            }
            if(flagN==false){
                $online.css("text-decoration","none");
                flagT=false;
                $chooseNot.css("text-decoration","underline");
                flagN=true;
            }else{

                if(!$showMiss.is(':checked')){
                    $showMiss.click();
                }
                if(!$showStop.is(':checked')){
                    $showStop.click();
                }
                if(!$showAlarm.is(':checked')){
                    $showAlarm.click();
                }
                if(!$showRun.is(':checked')){
                    $showRun.click();
                }
                if(!$overSpeed.is(':checked')){
                    $overSpeed.click();
                }
                $chooseNot.css("text-decoration","none");
                flagN=false;
            }
        },
        chooseAlam: function(){
            if(flagR==true){
                // setTimeout(function () {
                realTimeMonitoring.chooseRun();
                $chooseRun.css("text-decoration","none");
                // }, 0);
            }
            if(flagM==true){
                // setTimeout(function () {
                realTimeMonitoring.chooseMiss();
                $chooseMiss.css("text-decoration","none");
                // }, 0);
            }
            if(flagN==true){
                // setTimeout(function () {
                realTimeMonitoring.chooseNot();
                $chooseNot.css("text-decoration","none");
                // }, 0);
            }
            if(flagS==true){
                // setTimeout(function () {
                realTimeMonitoring.chooseStop();
                $chooseStop.css("text-decoration","none");
                // }, 0);
            }
            if(flagO==true){
                // setTimeout(function () {
                realTimeMonitoring.chooseOverSeep();
                $chooseOverSeep.css("text-decoration","none");
                // }, 0);
            }
            if($showMiss.is(':checked')){
                $showMiss.click();
            }
            if($showStop.is(':checked')){
                $showStop.click();
            }
            if($missW.is(':checked')){
                $missW.click();
            }
            if($showRun.is(':checked')){
                $showRun.click();
            }
            if($overSpeed.is(':checked')){
                $overSpeed.click();
            }
            if(flagA==false){
                $online.css("text-decoration","none");
                flagT=false;
                $chooseAlam.css("text-decoration","underline");
                flagA=true;
            }else{

                if(!$showMiss.is(':checked')){
                    $showMiss.click();
                }
                if(!$showStop.is(':checked')){
                    $showStop.click();
                }
                if(!$missW.is(':checked')){
                    $missW.click();
                }
                if(!$showRun.is(':checked')){
                    $showRun.click();
                }
                if(!$overSpeed.is(':checked')){
                    $overSpeed.click();
                }
                $chooseAlam.css("text-decoration","none");
                flagA=false;
            }
            //状态信息点击
            realTimeMonitoring.showAlarmWindow();
        },
        chooseStop: function(){
            if(flagR==true){
                // setTimeout(function () {
                realTimeMonitoring.chooseRun();
                $chooseRun.css("text-decoration","none");
                // }, 0);
            }
            if(flagM==true){
                // setTimeout(function () {
                realTimeMonitoring.chooseMiss();
                $chooseMiss.css("text-decoration","none");
                // }, 0);
            }
            if(flagN==true){
                // setTimeout(function () {
                realTimeMonitoring.chooseNot();
                $chooseNot.css("text-decoration","none");
                // }, 0);
            }
            if(flagA==true){
                // setTimeout(function () {
                realTimeMonitoring.chooseAlam();
                $chooseAlam.css("text-decoration","none");
                // }, 0);
            }
            if(flagO==true){
                // setTimeout(function () {
                realTimeMonitoring.chooseOverSeep();
                $chooseOverSeep.css("text-decoration","none");
                // }, 0);
            }
            if($showMiss.is(':checked')){
                $showMiss.click();
            }
            if($showAlarm.is(':checked')){
                $showAlarm.click();
            }
            if($missW.is(':checked')){
                $missW.click();
            }
            if($showRun.is(':checked')){
                $showRun.click();
            }
            if($overSpeed.is(':checked')){
                $overSpeed.click();
            }
            if(flagS==false){
                $online.css("text-decoration","none");
                flagT=false;
                $chooseStop.css("text-decoration","underline");
                flagS=true;
            }else{

                if(!$showMiss.is(':checked')){
                    $showMiss.click();
                }
                if(!$showAlarm.is(':checked')){
                    $showAlarm.click();
                }
                if(!$missW.is(':checked')){
                    $missW.click();
                }
                if(!$showRun.is(':checked')){
                    $showRun.click();
                }
                if(!$overSpeed.is(':checked')){
                    $overSpeed.click();
                }
                $chooseStop.css("text-decoration","none");
                flagS=false;
            }
        },
        chooseOverSeep: function(){
            if(flagR==true){
                // setTimeout(function () {
                realTimeMonitoring.chooseRun();
                $chooseRun.css("text-decoration","none");
                // }, 0);
            }
            if(flagM==true){
                // setTimeout(function () {
                realTimeMonitoring.chooseMiss();
                $chooseMiss.css("text-decoration","none");
                // }, 0);
            }
            if(flagN==true){
                // setTimeout(function () {
                realTimeMonitoring.chooseNot();
                $chooseNot.css("text-decoration","none");
                // }, 0);
            }
            if(flagA==true){
                // setTimeout(function () {
                realTimeMonitoring.chooseAlam();
                $chooseAlam.css("text-decoration","none");
                // }, 0);
            }
            if(flagS==true){
                // setTimeout(function () {
                realTimeMonitoring.chooseStop();
                $chooseStop.css("text-decoration","none");
                // }, 0);
            }
            if($showMiss.is(':checked')){
                $showMiss.click();
            }
            if($showAlarm.is(':checked')){
                $showAlarm.click();
            }
            if($missW.is(':checked')){
                $missW.click();
            }
            if($showRun.is(':checked')){
                $showRun.click();
            }
            if($showStop.is(':checked')){
                $showStop.click();
            }
            if(flagO==false){
                $online.css("text-decoration","none");
                flagT=false;
                $chooseOverSeep.css("text-decoration","underline");
                flagO=true;
            }else{

                if(!$showMiss.is(':checked')){
                    $showMiss.click();
                }
                if(!$showAlarm.is(':checked')){
                    $showAlarm.click();
                }
                if(!$missW.is(':checked')){
                    $missW.click();
                }
                if(!$showRun.is(':checked')){
                    $showRun.click();
                }
                if(!$showStop.is(':checked')){
                    $showStop.click();
                }
                $chooseOverSeep.css("text-decoration","none");
                flagO=false;
            }
        },
        chooseNeverOnline: function(){
            if(flagR==true){
                realTimeMonitoring.chooseRun();
                $chooseRun.css("text-decoration","none");
            }
            if(flagM==true){
                realTimeMonitoring.chooseMiss();
                $chooseMiss.css("text-decoration","none");
            }
            if(flagN==true){
                realTimeMonitoring.chooseNot();
                $chooseNot.css("text-decoration","none");
            }
            if(flagA==true){
                realTimeMonitoring.chooseAlam();
                $chooseAlam.css("text-decoration","none");
            }
            if(flagS==true){
                realTimeMonitoring.chooseStop();
                $chooseStop.css("text-decoration","none");
            }
            if(flagO==true){
                realTimeMonitoring.chooseOverSeep();
                $chooseOverSeep.css("text-decoration","none");
            }
            if($overSpeed.is(':checked')){
                $overSpeed.click();
            }
            if($showMiss.is(':checked')){
                $showMiss.click();
            }
            if($showAlarm.is(':checked')){
                $showAlarm.click();
            }
            if($missW.is(':checked')){
                $missW.click();
            }
            if($showRun.is(':checked')){
                $showRun.click();
            }
            if($showStop.is(':checked')){
                $showStop.click();
            }
            if(flagNO==false){
                $online.css("text-decoration","none");
                flagT=false;
                $("#chooseNeverOnline").css("text-decoration","underline");
                flagNO=true;
            }else{

                if(!$showMiss.is(':checked')){
                    $showMiss.click();
                }
                if(!$showAlarm.is(':checked')){
                    $showAlarm.click();
                }
                if(!$missW.is(':checked')){
                    $missW.click();
                }
                if(!$showRun.is(':checked')){
                    $showRun.click();
                }
                if(!$showStop.is(':checked')){
                    $showStop.click();
                }
                if(!$overSpeed.is(':checked')){
                    $overSpeed.click();
                }
                $("#chooseNeverOnline").css("text-decoration","none");
                flagNO=false;
            }
        },
        tline: function(){
            if($showMiss.is(':checked')){
                $showMiss.click();
            }
            if(!$showAlarm.is(':checked')){
                $showAlarm.click();
            }
            if(!$missW.is(':checked')){
                $missW.click();
            }
            if(!$showRun.is(':checked')){
                $showRun.click();
            }
            if(!$showStop.is(':checked')){
                $showStop.click();
            }
            if(!$overSpeed.is(':checked')){
                $overSpeed.click();
            }
            if(flagT==false){
                $chooseRun.css("text-decoration","none");
                $chooseMiss.css("text-decoration","none");
                $chooseNot.css("text-decoration","none");
                $chooseAlam.css("text-decoration","none");
                $chooseStop.css("text-decoration","none");
                $chooseOverSeep.css("text-decoration","none");
                $online.css("text-decoration","underline");
                flagT=true;
                flagR=false;
                flagA=false;
                flagM=false;
                flagO=false;
                flagN=false;
                flagNO=false;
                flagS=false;
            }else {
                if(!$showMiss.is(':checked')){
                    $showMiss.click();
                }
                $online.css("text-decoration","none");
                flagT=false;
            }
        },
        chooseAll: function(){
            if(!$showMiss.is(':checked')){
                $showMiss.click();
            }else {
                $chooseMiss.css("text-decoration","none");
                flagM=false;
            }
            if(!$showAlarm.is(':checked')){
                $showAlarm.click();
            }else {
                $chooseAlam.css("text-decoration","none");
                flagA=false;
            }
            if(!$missW.is(':checked')){
                $missW.click();
            }else {
                $chooseNot.css("text-decoration","none");
                flagN=false;
            }
            if(!$showRun.is(':checked')){
                $showRun.click();
            }else {
                $chooseRun.css("text-decoration","none");
                flagR=false;
            }
            if(!$showStop.is(':checked')){
                $showStop.click();
            }else {
                $chooseStop.css("text-decoration","none");
                flagS=false;
            }
            if(!$overSpeed.is(':checked')){
                $overSpeed.click();
            }else {
                $chooseOverSeep.css("text-decoration","none");
                flagO=false;
            }
            if(flagT=true){
                $online.css("text-decoration","none");
                flagT=false;
            }
        },
        search_condition: function(){
            search_ztree('treeDemo','search_condition','vehicle');
        },
        //实时监控数据加载
        realTimeDatatAdapt: function(){
            $("#scalingBtn").unbind("click").bind("click",realTimeMonitoring.hideDataClick);
            realTimeMonitoring.dataTableDbclick();
        },
        //隐藏数据
        hideDataClick: function(){
        	var mapHeightdata = winHeight - headerHeight - headerHeight + 30;
            if($(this).hasClass("fa-chevron-down")){
                uptFlag = false;
                $MapContainer.css('height',mapHeightdata+'px');
                $(this).attr("class","fa  fa-chevron-up");
            }else{
	            var num = $realTimeStateTableList.children("tbody").children("tr").length;
	            if(num >= 5){
	                $("#realTimeStateTable-div").css({
	                 "height":"266px"
	              });
	                $MapContainer.css('height',(newMapHeight-(41*5+43 + 17))+'px');
	              }else{
	                $MapContainer.css('height',(newMapHeight-(41*num+43 + 17))+'px');
	              }
                $(this).attr("class","fa  fa-chevron-down");
            }
        },
        //拖拽DIV
        dragDiv:function(e){
        	if(tableListLength > 5){
        		tableHeight = $("#realTimeStateTable-div").height();
                mapHeight = $MapContainer.height();
                els = e.clientY;
                $(document).bind("mousemove", realTimeMonitoring.mouseMove).bind("mouseup", realTimeMonitoring.mouseUp);
                e.stopPropagation();
        	}
        },
        //单双击
        dataTableDbclick: function(){
            var TimeFn = null;
            $realTimeStateTableList.children("tbody").children("tr").unbind("click").bind("click",function(){
            	$("#realTimeStateTable tbody tr").removeClass("tableHighlight");
                var numberPlate = $(this).children("td:nth-child(2)").text();
            	var realTimeDataTableTrNum = $("#realTimeStateTable").find("tr").length;
            	for(var i=0;i<realTimeDataTableTrNum;i++){
            		$(this).addClass("tableHighlight");
            	}
            	$(".ztree li a").removeClass("curSelectedNode_dbClick");
            	$(".ztree li a").removeClass("curSelectedNode");
  	          	var zTreeDataTables = $.fn.zTree.getZTreeObj("treeDemo");
  	          	var dataTabCheckedNum = zTreeDataTables.getCheckedNodes(true);
  	          	for(var i=0;i<dataTabCheckedNum.length;i++){
            		if(dataTabCheckedNum[i].name==numberPlate){
      	          		ztreeStyleDbclick = dataTabCheckedNum[i].tId;
            			$("#"+ztreeStyleDbclick).children("a").addClass("curSelectedNode_dbClick");
            		}
  	          	}
                TimeFn = setTimeout(function(){
                    realTimeMonitoring.centerMarkerBands(numberPlate);
                },300);
            });
            $realTimeStateTableList.children("tbody").children("tr").unbind("dblclick").bind("dblclick",function(){
            	if($(this).children("td:nth-child(1)").text() == 1){
            		$(this).removeClass("tableHighlight");
                	$(".ztree li a").removeClass("curSelectedNode_dbClick");
            	}else{
            		var nodeName = $(this).children("td:nth-child(2)").text();
                	realTimeMonitoring.tableHighlight(nodeName);
            	};
                fixedPoint = null;
                clearTimeout(TimeFn);
                var plateInformationName = $(this).children("td:nth-child(2)").text();
                if(licensePlateInformation==plateInformationName){
                    $(".ztree li a").removeAttr("class","curSelectedNode");
                    $("#"+dbclickCheckedId).parent().removeAttr("class","curSelectedNode_dbClick");
                }
                if(groupIconSkin=="assignmentSkin" || groupIconSkin=="groupSkin"){
                    $(".ztree li a").removeAttr("class","curSelectedNode");
                    $("#"+dbclickCheckedId).parent().removeAttr("class","curSelectedNode_dbClick");
                }
                realTimeMonitoring.centerMarkerNo();
            });
        },
        //报警记录单双击
        alarmInfoDataDbclick: function(){
        	var alarmTimeFn = null;
        	$("#alarmTable tbody tr").unbind("click").bind("click",function(){
                clearTimeout(alarmTimeFn);
            	$("#alarmTable tbody tr").removeClass("tableHighlight");
            	var alarmDataTableTrNum = $("#alarmTable").find("tr").length;
            	for(var i=0;i<alarmDataTableTrNum;i++){
            		$(this).addClass("tableHighlight");
            	}
                alarmTimeFn = setTimeout(function(){},300);
        	});
        	$("#alarmTable tbody tr").unbind("dblclick").bind("dblclick",function(){
                clearTimeout(alarmTimeFn);
                //获取当前点击行相对应的值
                var alarmVid = $(this).children("td:nth-child(2)").text();
        		var timeFormat = $(this).children("td:nth-child(7)").text();
        		var alarmStr = $(this).children("td:nth-child(5)").text();
        		//跳转
        		window.open("/clbs/a/search/list?avid="+alarmVid+"&atype="+alarmStr+"&atime="+timeFormat+"");
        	});
        },
        //实时视频
        videoRealTimeShow: function(){
        	if($(this).hasClass("map-active")){
        		$(this).removeClass("map-active");
        		$mapPaddCon.removeClass("mapAreaTransform");
            	$realTimeVideoReal.removeClass("realTimeVideoShow");
            	m_videoFlag=0; //标识视频窗口关闭
            	realTimeVideo.beventAllMediaStop(); 
        	}else{
        		$(this).addClass("map-active");
            	$mapPaddCon.addClass("mapAreaTransform");
            	$realTimeVideoReal.addClass("realTimeVideoShow");
            	m_videoFlag=1; //标识视频窗口打开      
            	realTimeVideo.downloadVideoOcx();
            	realTimeVideo.windowSet();
            	setTimeout("realTimeVideo.beventLiveView()",5);   	         
        	}
        },
        //点击显示报警
        showAlarmWindow: function(){
        	$showAlarmWinMark.show();
        	$("#showAlarmWin").hide();
        },
        //点击切换状态栏
        showAlarmWinMarkRight: function(){
        	$("#realTimeStatus").removeAttr("class");
        	$("#realTtimeAlarm").attr("class","active");
        	$("#realTimeState").attr("class","tab-pane fade");
        	$("#realTimeCall").attr("class","tab-pane fade active in");
        	$(this).css("background-position","0px -67px");
        	setTimeout(function(){
            	$showAlarmWinMark.css("background-position","0px 0px");
        	},100)
        },
        //最小化
        alarmToolMinimize: function(){
        	$("#context-menu").removeAttr("class");
        	$("#showAlarmWin").show();
        	$showAlarmWinMark.hide();
        },
        //开启关闭声音
        alarmOffSound: function(){
        	if($alarmSoundSpan.hasClass("soundOpen")){
        		$alarmSoundSpan.addClass("soundOpen-off");
        		$alarmSoundSpan.removeClass("soundOpen");
        		$alarmSoundFont.css("color","#a8a8a8");
        		if(alarmNum>0){$("#alarmMsgAutoOff")[0].pause();}
        		$alarmMsgAutoOff.removeAttr("autoplay");
        	}else{
        		$alarmSoundSpan.removeClass("soundOpen-off");
        		$alarmSoundSpan.addClass("soundOpen");
        		$alarmSoundFont.css("color","#fff");
        		if(alarmNum>0){$("#alarmMsgAutoOff")[0].play();}
        	}
        },
        //开启关闭闪烁
        alarmOffFlashes: function(){
        	if($alarmFlashesSpan.hasClass("flashesOpen")){
        		$alarmFlashesSpan.addClass("flashesOpen-off");
        		$alarmFlashesSpan.removeClass("flashesOpen");
        		$alarmFlashesFont.css("color","#a8a8a8");
        		$showAlarmWinMark.css("background-position","0px 0px");
        	}else{
        		$alarmFlashesSpan.removeClass("flashesOpen-off");
        		$alarmFlashesSpan.addClass("flashesOpen");
        		$alarmFlashesFont.css("color","#fff");
        		if(alarmNum>0){
        			$showAlarmWinMark.css("background-position","0px -134px");
            		setTimeout(function(){
            			$showAlarmWinMark.css("background-position","0px 0px");
            		},1500)
        		}else{
        			$showAlarmWinMark.css("background-position","0px 0px");
        		}
        	}
        },
        //显示报警设置详情
        showAlarmInfoSettings: function(){
        	$("#alarmSettingInfo").modal("show");
			$("#context-menu").removeClass("open");
        },
        //报警设置
        alarmSettingSave: function(){
        	var sounds = [];
        	var flickers = [];
        	$("input[name^='sound']").each(function(i){
        		sounds[i]=$(this).is(':checked');
        	});
        	$("input[name^='flicker']").each(function(i){
        		flickers[i]=$(this).is(':checked');
        	});
        	var url="/clbs/v/monitoring/alarmSettingSave";
            var parameter={"flicker": flickers,"sound": sounds};
            ajax_submit("POST",url,"json",true,parameter,true,realTimeMonitoring.getCallback);
        },
        getCallback: function(){
        	$("#alarmSettingInfo").modal("hide");
        },
        getAlarmSetting: function(){
        	var url="/clbs/v/monitoring/getAlarmSetting";
            var parameter={};
        	json_ajax("POST",url,"json",true,parameter,realTimeMonitoring.getAlarmData);
        },
        getAlarmData: function(data){
        	if (data.msg!=null) {
        		var msg = $.parseJSON(data.msg);
        		var flickers = msg.flicker;
        		var sounds = msg.sound;
        		if(flickers!=null){
        			$("input[name^='flicker']").each(function(i){
        				if(flickers[i]=="true"){
        					$(this).prop("checked",true);
        				}else{
        					$(this).prop("checked",false);
        				}
                	});
        		}
        		if(sounds!=null){
        			$("input[name^='sound']").each(function(i){
        				if(sounds[i]=="true"){
        					$(this).prop("checked",true);
        				}else{
        					$(this).prop("checked",false);
        				}
                	});
        		}
        	}
        },
        //列表高亮
        tableHighlight: function(name){
        	$realTimeStateTableList.children("tbody").children("tr").removeClass("tableHighlight");
      	  	$realTimeStateTableList.children("tbody").children("tr").each(function(){
      	  		if($(this).children("td:nth-child(2)").text() == name){
      	  			dbClickHeighlight = false;
      	  			$(this).addClass("tableHighlight");
      	  			$("#realTimeStateTable-div").scrollTop(0);
      	  			$(".tableHighlight").insertBefore($realTimeStateTableList.children("tbody").children("tr:first-child"));
      	  		}
      	  	});
      	  	//序号重新进行排序
      	  	var index = 1;
      	  	$realTimeStateTableList.children("tbody").children("tr").each(function(){
      	  		$(this).children("td:nth-child(1)").html(index);
      	  		index++;
      	  	});
        },
    }

    $(function(){
    	//地图
        var lineVid = [];//在线车辆id
        var allCid = [];
        var missVid = []//离线车辆id
        var lineAndRun = []//在线行驶id;
        var lineAndStop = [];//在线停止id
        var lineAndAlarm = [];//报警
        var lineAndmiss = [];//未定位
        var offLineTable = [];
        var overSpeed = [];
        var vnodesId =[];
        var vnodemId=[];
        var vnodelmId = [];
        var vnoderId = [];
        var vnodeaId = [];
        var vnodespId=[];
        var markerRealTime;
        var lineArr = [];
        var pathsTwo = null;
        var cancelList = [];
        var myTable;
        var nmoline;
        //初始化页面
        realTimeMonitoring.init();
        //默认地图显示
        $("#defaultMap").on("click",realTimeMonitoring.satelliteMapSwitching);
        //实时路况点击
        $realTimeRC.on("click",realTimeMonitoring.realTimeRC);
        //右边菜单显示隐藏切换
        $("#toggle-left").on("click",realTimeMonitoring.toggleLeft);
        //左侧操作树点击隐藏
        $("#goHidden").on("click",realTimeMonitoring.goHidden);
        //左侧操作树点击显示
        $goShow.on("click",realTimeMonitoring.goShow);
        //输入时自动查询
        $("#search_condition").on('input oninput',realTimeMonitoring.search_condition);
        //刷新文件树
        $("#refresh").on("click",realTimeMonitoring.refreshTree);
        //显示离线
        $showMiss.on("click",realTimeMonitoring.showMisses);
        $("#chooseMiss,#chooseMissLine").on("click",realTimeMonitoring.chooseMiss);
        //显示行驶
        $showRun.on("click",realTimeMonitoring.showlineAndRun);
        $chooseRun.on("click",realTimeMonitoring.chooseRun);
        //显示停止
        $showStop.on("click",realTimeMonitoring.showlineAndStop);
        $chooseStop.on("click",realTimeMonitoring.chooseStop);
        //显示报警
        $showAlarm.on("click",realTimeMonitoring.showlineAndAlarm);
        $chooseAlam.on("click",realTimeMonitoring.chooseAlam);
        //显示未定位
        $missW.on("click",realTimeMonitoring.showMissW);
        $chooseNot.on("click",realTimeMonitoring.chooseNot);
        //显示超速
        $overSpeed.on("click",realTimeMonitoring.showOverSpeed);
        $chooseOverSeep.on("click",realTimeMonitoring.chooseOverSeep);
        //全部显示
        $("#chooseAll").on("click",realTimeMonitoring.chooseAll);
        //在线显示
        $online.on("click",realTimeMonitoring.tline);
        //状态信息可以拖动
        $("#realTimeStatus").on("click",function(){flagState = true});
        //报警记录、操作日志不拖动
        $("#realTtimeAlarm,#operationLog").on("click",function(){flagState = false});
        //拖动数据
        $("#dragDIV").mousedown(realTimeMonitoring.dragDiv);
        //实时视频
        $("#btn-videoRealTime-show").on("click",realTimeMonitoring.videoRealTimeShow);
        //报警参数设置
        $("#alarmSettingSave").on("click",realTimeMonitoring.alarmSettingSave);
        //报警设置取消
        $("#alarmSettingCancel").on("click",function(){
        	realTimeMonitoring.getAlarmSetting();
        	$("#alarmSettingInfo").modal("hide");
        });
         //报警参数设置
        $("#alarmSetting").on("click",realTimeMonitoring.getAlarmSetting);
        //报警弹窗显示
        $("#showAlarmWin").on("click",realTimeMonitoring.showAlarmWindow);
        //报警数量块单击
        $showAlarmWinMark.bind("click",realTimeMonitoring.showAlarmWinMarkRight);
        //屏蔽浏览器右键菜单
        $(".contextMenuContent,#showAlarmWin").bind("contextmenu",function(e){return false;});
        $showAlarmWinMark.contextmenu();
        //最小化
        $(".alarmSettingsSmall").bind("click",realTimeMonitoring.alarmToolMinimize);
        //关闭声音
        $(".alarmSound").bind("click",realTimeMonitoring.alarmOffSound);
        //关闭闪烁
        $(".alarmFlashes").bind("click",realTimeMonitoring.alarmOffFlashes);
        //点击显示报警设置详情
        $(".alarmSettingsBtn").bind("click",realTimeMonitoring.showAlarmInfoSettings);
        $("ul.dropdown-menu").on("click", function(e) {
            e.stopPropagation();
        });
    })
})(window,$)