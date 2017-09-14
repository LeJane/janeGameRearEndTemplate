var marker;//点标记
var points;//轨迹路径的坐标数组
var progress=0;//播放进度
var speed=300;//播放速度(km/h)
var playIndex=0;//用于标识手动进行修改的播放进度(该变量用于设置播放过的轨迹)
var passedPolyline;//播放过的轨迹路径
var isPlaying=false;//是否正在播放
var data;
var ml = 120;  //data  div的初始margin-left为120px

window.onload = function () {
    data = document.getElementById('data');
    //鼠标点击按钮实时显值  	
    $(function (iSet, callBack) {
        iSet = $.extend({ Minus: $('#reduction'), Add: $('#add'), Input: $('#speed'), Min: 1, Max: 100 }, iSet);
        var c = null, o = null;
        //插件返回值
        var $cb = {};
        //增加
        iSet.Add.each(function (i) {
            $(this).click(function () {
                o = parseInt(iSet.Input.eq(i).val());
                (o + 10<= iSet.Max) || (iSet.Max == null) ? iSet.Input.eq(i).val(o + 10) : iSet.Input.eq(i).val(iSet.Max);
                //输出当前改变后的值
                $cb.val = iSet.Input.eq(i).val();
                data.innerHTML = $cb.val;
                var m = parseInt(ml) + parseInt($cb.val) * 1.75;
                document.getElementById("data").style.marginLeft = m + "px";
                speed = $cb.val * 30;
                setMoveSpeed();//设置播放速度
            });
        });
        //减少
        iSet.Minus.each(function (i) {
            $(this).click(function () {
                o = parseInt(iSet.Input.eq(i).val());
                o - 10 < iSet.Min ? iSet.Input.eq(i).val(iSet.Min) : iSet.Input.eq(i).val(o - 10);
                $cb.val = iSet.Input.eq(i).val();
                data.innerHTML = $cb.val;
                var m = parseInt(ml) + parseInt($cb.val) * 1.75;
                document.getElementById("data").style.marginLeft = m + "px";
                speed = $cb.val * 30;
                setMoveSpeed();//设置播放速度
            });
        });
    });
};

//鼠标点击滑块实时显值
function change() {
    var speedValue = document.getElementById('speed').value;
    speed = speedValue * 30;//页面选择的倍率*30
    data.innerHTML = speedValue;
    var m = parseInt(ml) + parseInt(speedValue) * 1.75;//计算data的位置
    document.getElementById("data").style.marginLeft = m + "px";//设置data偏移量
    setMoveSpeed();
}

//初始化数据
function initData() {
	points=null;
	progress = playIndex = 0;
	isPlaying = false;
    if (passedPolyline == null || passedPolyline == undefined)
        return;
    else {
        try {
            passedPolyline.setPath(null);//清空已走过的轨迹
        } catch (e) { }
    }
}
//设置Marker的Icon
function setMarkerIcon(source)
{
    var newIcon = "../img/" + source;
    if (marker == null || marker == undefined)
        return;
	var icon=marker.getIcon();
	if(newIcon==icon)
		return;
	marker.setIcon(newIcon);
	//setOffset(newIcon,marker);
}

//加载轨迹路径
function newLoadPath(pts,iconName)
{
    map.clearMap(); //每次加载路线时,清除地图上所有覆盖物,防止覆盖物重复
	initData();//初始化数据
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
		icon:"../img/carStandBy.png",
        offset: new AMap.Pixel(-26, -13), //相对于基点的位置
        autoRotation: true//自动旋转角度
    });
	setMarkerIcon(iconName);
	map.setZoomAndCenter(15,points[0]);
	//播放过的轨迹路径设置为红色
	marker.on('moving',function(e){
        passedPolyline.setPath(points.slice(0,playIndex+1).concat(e.passedPath));
    });
	//与后台交互，更改播放进度
	marker.on('moveend',function(){
	    progress++;
	    var position = marker.getPosition();
	    map.setCenter(position);
		window.external.Progress = progress;
	});
	marker.on('movealong',function(){
	    progress = points.length - 1;
	    passedPolyline.setPath(points);
		window.external.Progress = progress;
	});
}

//轨迹播放
function moveAlong() {
    if (marker == null || marker == undefined)
        return;
	isPlaying=true;
	playIndex=progress=0;
	passedPolyline.setPath(null);
    marker.moveAlong(points,speed);
}

//继续播放
function resumeMove() {
    if (marker == null || marker == undefined)
        return;
	isPlaying=true;
	marker.resumeMove();
}
//暂停播放
function pauseMove() {
    if (marker == null || marker == undefined)
        return;
	isPlaying=false;
	marker.pauseMove();
}
//停止播放
function stopMove() {
    if (marker == null || marker == undefined)
        return;
	marker.stopMove();
}
//设置播放速度
function setMoveSpeed() {
    if (marker == null || marker == undefined)
        return;
    var position = marker.getPosition();//获取点标记当前位置
    playIndex = progress;
    var unpassed = points.slice(progress+1);//更改后的播放路径
    unpassed.splice(0, 0, position);//计算点标记未走过的坐标集合
    marker.moveAlong(unpassed,speed);//设置播放速度
    if(!isPlaying)
    	pauseMove();
}
//设置播放进度
function setCurrentPosition(index) {
    if (marker == null || marker == undefined)
        return;
    progress = playIndex = index;
    var unpassed = points.slice(playIndex);
    passedPolyline.setPath(points.slice(0, playIndex + 1));
    if (unpassed.length > 1) {
        marker.moveAlong(unpassed, speed);
        pauseMove();
    } else {
        if (index >= points.length) {
            marker.setPosition(points[points.length - 1]);
        } else {
            marker.setPosition(points[index]);
        }
    }
    var position = marker.getPosition();
	map.setCenter(position);
}

//绘制 起点 和终点图标
function drawStartAndEndICO()
{

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

//刷新页面
function refresh() {
    stopMove();
    location.reload();
}

//清除地图显示
function clearMap() {
    stopMove();
    if (map != null && map != undefined) {
        map.clearMap();
    }
}





