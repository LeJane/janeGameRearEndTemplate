/*
 *编写:兰子奇
 *创建日期:2017-2-17
 *说明:本节代码主要提供关于车辆历史轨迹功能
*/
var points;//轨迹路径
var progress=0;//播放进度
var speed =100;//播放速度(km/h)
var playIndex=0;//用于标识手动进行修改的播放进度(该变量用于设置播放过的轨迹)
var passedPolyline;//播放过的轨迹路径
var isPlaying=false;//是否正在播放
var isresumeMove=false;
var FlagPro=false;

//初始化数据
function initData(){
	points=null;
	progress=playIndex=0;
	isPlaying=false;
	if (passedPolyline == null || passedPolyline == undefined)
        return;
    else {
        try {
            passedPolyline.setPath(null);//清空已走过的轨迹
        } catch (e) { }
    }
	
}
//设置Marker的Icon
function setMarkerIcon(source){
	var newIcon="../../Public/img/"+source;
	if (marker == null || marker == undefined)
        return;
	var icon=marker.getIcon();
	if(newIcon==icon)
		return;
	marker.setIcon(newIcon);
	//setOffset(newIcon,marker);
}

//加载轨迹路径
function newLoadPath(pts,iconName){
    map.clearMap(); //每次加载路线时,清除地图上所有覆盖物,防止覆盖物重复
	initData();
    points = jsonConvertToMapLngLat(pts); //把json字符串坐标点转换成高德经纬度坐标
    drawStartAndEndICO(); //绘制起点和终点图标
    //绘制轨迹
    var polyline = new AMap.Polyline({
        map: map,
        path: points,
        strokeColor: "#3898f9",//线颜色
        strokeOpacity: 0.9,//线透明度
        strokeWeight: 5,//线宽
        strokeStyle: "solid"//线样式
		//showDir:true //显示方向
    });
	//车辆运行过的轨迹
	passedPolyline = new AMap.Polyline({
		map: map,
		// path: points,
		strokeColor: "#f74948",  //线颜色
		 strokeOpacity: 0.9,     //线透明度
		strokeWeight: 5,      //线宽
		// strokeStyle: "solid"  //线样式
	});
    //绘制车辆图标
    marker = new AMap.Marker({
        map: map,
        position: points[0],//基点位置
		// icon:"http://webapi.amap.com/images/car.png",
		icon:"../../Public/img/carStandBy.png",
        offset: new AMap.Pixel(-26, -13), //相对于基点的位置
        autoRotation: true//自动旋转角度
    });
//	map.setFitView();
	setMarkerIcon(iconName);
	map.setZoomAndCenter(15,points[0]);
	//播放过的轨迹路径设置为红色
	marker.on('moving',function(e){
        passedPolyline.setPath(points.slice(0,playIndex+1).concat(e.passedPath));
		
    });
	//与后台交互，更改播放进度
	marker.on('moveend',function(){
			progress++;
//			playIndex++;
			FlagPro=true;
			DataTableHistory(progress,true);
			var position=marker.getPosition();
			map.panTo(position);
			
			
	});
	marker.on('movealong',function(){
	    progress = points.length - 1;
	    passedPolyline.setPath(points);
		FlagPro=false;
		$("#playIcon").removeClass("suspendedIcon").addClass("playIcon");
		var isresumeMove=false;
		DataTableHistory(0,false);
	});
}

//轨迹播放
function moveAlong(){
	if (marker == null || marker == undefined)
        return;
	isPlaying=true;
	FlagPro=true;
	playIndex=progress=0;
	passedPolyline.setPath(null);
    marker.moveAlong(points,speed);
}
//继续播放
function resumeMove(){
	isPlaying=true;
	FlagPro=true;
	marker.resumeMove();
}
//暂停播放
function pauseMove(){
	isPlaying=false;
	marker.pauseMove();
	isresumeMove=true;
	FlagPro=false;
	
}
//停止播放
function stopMove(){
	marker.setPosition(points[0]);
	isPlaying=false;
	isresumeMove=false;
	marker.stopMove();
	passedPolyline.setPath(null);
	FlagPro=false;
	$("#playIcon").removeClass("suspendedIcon").addClass("playIcon");
	$("#ScrollTab").scrollTop(0);
	DataTableHistory(0,false);
}
//回放速度
function setMoveSpeed(s){
	if (marker == null || marker == undefined)
        return;
        
    speed = s;
	var position = marker.getPosition();//获取点标记当前位置
    var unpassed=points.slice(progress+1);//更改后的播放路径
    playIndex=progress;
    passedPolyline.setPath(points.slice(0,playIndex));//将播放过的路径设置为红色
    unpassed.splice(0, 0, position);//计算点标记未走过的坐标集合
    marker.moveAlong(unpassed,speed);//设置播放速度
	// DataTableHistory(progress);	
//	 marker.moveAlong(points,speed);
//	 map.getCenter(marker);
    if(!isPlaying)
    	pauseMove();
}
//设置播放进度
function setCurrentPosition(index)
{
	if (marker == null || marker == undefined)
        return;
	progress=playIndex=index;
	var pr=points.slice(playIndex);
	marker.moveAlong(pr,speed);
	passedPolyline.setPath(points.slice(0, playIndex));
	pauseMove();
	var position=marker.getPosition();
	map.setCenter(position);
}

//绘制 起点 和终点图标
function drawStartAndEndICO(){

    var start_xy = points[0];
    var end_xy = points[points.length - 1];	
	
    //起点、终点图标
    var sicon = new AMap.Icon({
        image: "http://cache.amap.com/lbs/static/jsdemo002.png",
        size: new AMap.Size(44, 44),
        imageOffset: new AMap.Pixel(-334, -180)
    });
    var startmarker = new AMap.Marker({
        icon: sicon, //复杂图标
        visible: true,
        position: start_xy,
        map: map,
        offset: {
            x: -16,
            y: -40
        }
    });

    var eicon = new AMap.Icon({
        image: "http://cache.amap.com/lbs/static/jsdemo002.png",
        size: new AMap.Size(44, 44),
        imageOffset: new AMap.Pixel(-334, -134)
    });

    var endmarker = new AMap.Marker({
        icon: eicon, //复杂图标
        visible: true,
        position: end_xy,
        map: map,
        offset: {
            x: -16,
            y: -40
        }
    });

    map.setFitView();
}
//清空地图上的覆盖物
function clearMap(){
	initData();
	if (map != null && map != undefined) {
        map.clearMap();
    }
}






