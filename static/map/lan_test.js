//mark,lineArr
var marker,lineArr=[];
var map;
//卫星图层标记
var isSatellLayer=true;

//实时路况图层标记
var isRealTimeTraffic=true;

//建筑图层
var buildings;

//滚动标记
var flagTwo=true;
var dragFlag=true;

//速度
var speed;

	//地图加载
	map=new AMap.Map('container',{
		resizeEnable:true,
		scrollWheel: true,
		zoom:18
	});
	  //实例化3D楼块图层
		buildings = new AMap.Buildings();
		// 在map中添加3D楼块图层
		buildings.setMap(map);
	// 加载数据
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
	 
	 //加载数据
	 	 map.on("complete",MapOnload);
	 
	 //卫星事件监听
	 var setMoon=document.getElementById('setMoon');
	 AMap.event.addDomListener(setMoon, 'click',function(){
		if(isSatellLayer){
			$(this).addClass("MapActive");
			satellLayer.show();
			buildings.setMap(null);
			isSatellLayer = false;
		}else{
			
			$(this).removeClass("MapActive");
			buildings.setMap(map);
			satellLayer.hide();
			isSatellLayer=true;
		}
	 },false);
	 
	 //实时路况事件
	  //卫星事件监听
	 var setRealTimeRoad=document.getElementById('setRealTimeRoad');
	 AMap.event.addDomListener(setRealTimeRoad, 'click',function(){
		if(isRealTimeTraffic){
			$(this).addClass("MapActive");
			realTimeTraffic.show();
			buildings.setMap(null);
			isRealTimeTraffic = false;
		}else{
			
			$(this).removeClass("MapActive");
			buildings.setMap(map);
			realTimeTraffic.hide();
			isRealTimeTraffic=true;
		}
	 },false);
	 
	
	
	// 监听鼠标速度移动
	// AMap.event.addDomListener(document.getElementById("scroll_Thumb"),"mousemov",function(e){
		// var rs;
		// for(var i=0;i<175;i++){
			// rs=i;
		// }
		// $("#scroll_Track").width(rs+"px");
		// $("#scroll_Thumb").css({"margin-left":rs+"px"});
	// });
	//速度当前值
	var currentValueSpeed;
	var valite = false;
	value=50;		//默认值
	
	maxValue=40000;		//最大值
	//初始化滚动条
	 var InitTrack = 500/(maxValue - 50)* $("#scrollBar").width();
	$("#scroll_Track").css("width", InitTrack + 2 + "px");
	$("#scroll_Thumb").css("margin-left", InitTrack + "px");
	if(value < maxValue){
		$("#scroll_Thumb").mousedown(function(e){
				valite=true;
			$(document .body).mousemove(function(event){
				dragFlag=false;
				if (valite == false) return;
				
				currentValueSpeed=Math.round(event.clientX)-$("#Demo").offset().left;
				
				if(currentValueSpeed <=0){
					currentValueSpeed=0;
				}
				$("#scroll_Thumb").css("margin-left", currentValueSpeed + "px");
				$("#scroll_Track").css("width", currentValueSpeed + 2 + "px");
				if ((currentValueSpeed + 15) >= $("#scrollBar").width()) {
					$("#scroll_Thumb").css("margin-left", $("#scrollBar").width() - 10 + "px");
					$("#scroll_Track").css("width", $("#scrollBar").width() + 2 + "px");
					value = maxValue;
				} else if (currentValueSpeed <= 0) {
					$("#scroll_Thumb").css("margin-left", "0px");
					$("#scroll_Track").css("width", "0px");
				} else {
					 value= Math.round(39950 * (currentValueSpeed / $("#scrollBar").width()));
				}
				
			});
		});
		
		//鼠标松掉之后
		$(document.body).mouseup(function(e){
			// if(flagTwo || dragFlag){
					// speed=500;
					// flagTwo=false;
			// }else{
				// speed=value;
				
				speed=value;
			// }
			valite=false;
			
		});
		
		
	}else{
		layer.alert("给定值大于了最大值");
		valite=false;
	}
	
	
	//监听播放

	AMap.event.addDomListener(document.getElementById("playIcon"),'click',function(){
		
		marker.moveAlong(lineArr,speed);
		$(this).removeClass("playIcon").addClass("suspendedIcon");
	},false);
	
	//暂停播放监听
	AMap.event.addDomListener(document.getElementById("startAnimation"),'click',function(){
		marker.stopMove();
		$("#playIcon").removeClass("suspendedIcon").addClass("playIcon");
	},false);
	
	
	
	//地图加载完成后执行函数
	function MapOnload(){
		marker=new AMap.Marker({
			map:map,
			icon:"http://webapi.amap.com/images/car.png",
			offset:new AMap.Pixel(-26, -13),
			autoRotation:true
		});
		
		//json数据转成LngLat经纬度
		json=jsonConvertToMaplnglat(json);
		
		
		for(var i=0; i < json.length; i++){
			
			lineArr.push(json[i]);
		}
		
		
	
		//绘制轨迹
		
		res=setPolyLine(lineArr);
		map.setFitView();
		
		//播放过的轨迹路径设置为红色
		var i=0;
		marker.on('moving',function(e){
			polyline.setPath(res.slice(0,playIndex).concat(e.passedPath));
		});
	}