//地图聚合
var cluster;
var markers = [];//添加的点标记集合
var infoWindow;//信息窗体
var focusedMarker;//当前关注的车辆
var clickedMarker;//标记弹出了信息框的marker
var isMoving = false;//点标记是否正在执行moveAlong
var driving;//用于获取两点间的路线

//点聚合实例化
function mapCluster() {
    //var markers = [];
    //防止聚合重复在地图上显示车辆
    if (cluster) {
        cluster.setMap(null);
    }
    //显示热聚合 
    map.plugin(["AMap.MarkerClusterer"], function () {
        cluster = new AMap.MarkerClusterer(map, markers, {
            minClusterSize: 1,//聚合的最小数量
            maxZoom: 11 //当地图缩放至指定级别("市")才显示聚合
        });
    });
}

//添加插件，驾车路线规划
function mapDriving() {
    AMap.service('AMap.Driving', function () {//回调函数
        //实例化Driving
        driving = new AMap.Driving({
            //map: map,     //显示规划路径
            //panel: "panel",   //显示规划列表
        });
    })
}

//地图缩放改变
function zoomChange() {
    var zoom = map.getZoom();
    //当地图的缩放级别小于等于8时，清除地图上的信息窗体
    if (zoom <= 8) {
        map.clearInfoWindow();//清除信息窗体
    }
    //地图缩放级别小于等于10，则停止正在播放的moveAlong动画
    if (zoom <= 11) {
        if (focusedMarker != null && focusedMarker != undefined && isMoving) {
            focusedMarker.stopMove();//关注的车辆停止移动
            isMoving = false;
            setMarkerInfo();//设置点标记的图标和偏移量
            cluster.addMarker(focusedMarker);//点标记添加到聚合中
        }
    }
}

//地图平移结束
function moveEnd() {
    var bounds = map.getBounds();//获取地图的可见区域
    if (infoWindow == null || infoWindow == undefined || infoWindow.getIsOpen() == false)
        return;
    var position = infoWindow.getPosition();
    //如果信息窗体不在地图的可见区域则清除窗体
    if (!bounds.contains(position)) {
        closeInfoWindow();
    }
}
//页面加载事件
window.onload = function () {
    mapCluster();//初始化cluster
    mapDriving();
    //地图缩放级别发生改变事件
    map.on("zoomchange", zoomChange);
    //地图发生移动动画结束后的事件
    map.on("moveend", moveEnd);
};

//设置focusedMarker点标记的信息
function setMarkerInfo() {
    if (focusedMarker == null || focusedMarker == undefined)
        return;
    var info = focusedMarker.getExtData();
    var iconName = info.IconName;
    focusedMarker.setIcon(iconName);
    //设置点标记偏移量
    setOffset(iconName, focusedMarker);
    //设置点标记旋转角度
    focusedMarker.setAngle(0);
}

//判断对应车牌号的车辆标记是否存在，存在则返回点标记对象
function isHasMarker(carno) {
    for (var i = 0; i < markers.length; i++) {
        var marker = markers[i];
        var extraCarNo = marker.getExtData().Carno; //获取点标记用户自定义属性
        if (extraCarNo == carno)
            return marker;
    }
    return null;
}

//添加单个点标记(carInfo:车辆信息，json类型)
function addMarker(carInfo) {
    var info = eval("(" + carInfo + ")"); //解析json数据
    var carno = info.Carno;//车牌号
    var iconStr = info.IconName;//图标路径
    if (isHasMarker(carno) != null) //对应车牌号的点标记是否已存在
        return;
    var point = new AMap.LngLat(info.GoogleLongitude, info.GoogleLatitude);
    var marker = new AMap.Marker({
        icon: iconStr,
        position: point,
        autoRotation: true, //是否自动转向
        topWhenClick: true, 
        extData: info //Marker的用户自定义属性，存储车辆信息
    });
    showCarno(marker, carno);//显示车牌号
    addListener(marker);//添加事件监听
    setOffset(iconStr, marker);//设置偏移量
    markers.push(marker);//记录点标记到集合中
    //添加点聚合
    try {
        cluster.addMarker(marker);//添加点标记
    } catch (e) {
    }
}

//点标记上显示车牌号
function showCarno(marker,carno) {
    if (marker == null || marker == undefined)
        return;
    if (carno == null || carno == undefined) {
        carno = marker.getExtData().Carno;
    }
    // 设置label标签
    marker.setLabel({
        offset: new AMap.Pixel(0, -15),//修改label相对于maker的位置
        content: carno
    });
}

//点标记隐藏车牌号显示框
function hideCarno(marker) {
    if (marker == null || marker == undefined)
        return;
    //设置label标签
    marker.setLabel({
        offset: new AMap.Pixel(0, -15), //修改label相对于maker的位置
        content: ""
    });
}

//点标记在地图上可见
function fitToViewMarker(marker) {
    var bounds = map.getBounds();//获取地图可视区域
    var position = marker.getPosition();//点标记当前位置
    if (!bounds.contains(position)) {
        map.setCenter(position);
    }
}

//点标记添加事件处理
function addListener(marker) {
    if (marker == null || marker == undefined)
        return;
    //正在进行移动
    marker.on("moving", function(e) {
        isMoving = true;
        //设置点标记图标和偏移量
        var icon = "http://webapi.amap.com/images/car.png";
        focusedMarker.setIcon(icon);
        focusedMarker.setOffset(new AMap.Pixel(-26, -13));
        fitToViewMarker(marker);
    });
    marker.on("moveend", function() {
        hideCarno(focusedMarker);
    });
    //移动结束
    marker.on("movealong", function () {
        isMoving = false;
        var info = marker.getExtData();
        marker.setIcon(info.IconName);
        setOffset(info.IconName, marker);
        marker.setAngle(0);//设置点标记旋转角度
        showCarno(marker, info.Carno);
        cluster.addMarker(marker);
    });
    marker.on("click", markerClick);
}

//更新单个点标记
function updateMarker(carInfo) {
    var info = eval("("+ carInfo+")");
    var marker = isHasMarker(info.Carno);
    if (marker == null) {
        //点标记不存在,但车辆状态为在线则增加点标记
        if (info.Online == 1) {
            var infos = [];
            infos.push(info);
            addMarkers(infos);
            return;
        }
    } else {
        //点标记存在，但车辆状态为离线则删除点标记
        if (info.Online == 0) {
            removeMarker(marker);
            return;
        }
        var point = new AMap.LngLat(info.GoogleLongitude, info.GoogleLatitude);
        updateInfo(marker, info); //更新点标记信息
        marker.setPosition(point);
    }
}

//更新关注车辆
function updateFocusedMarker(carInfo) {
    var info = eval("(" + carInfo + ")");
    if (focusedMarker == null || focusedMarker == undefined) {
        var marker = isHasMarker(info.Carno);
        if (marker != null) {
            focusedMarker = marker;
            focusedMarker.setzIndex(200);
        } else {
            //点标记不存在且在线状态为在线，则增加点标记
            if (info.Online == 1) {
                addMarker(info);
                setFocusedMarker(info.Carno);//设置focusedMarker
            }
        }
        return;
    } else {
        //点标记存在但更新状态为离线，则删除
        if (info.Online == 0) {
            if (isMoving) {//若正在执行移动动画则先停止动画，再删除
                focusedMarker.stopMove();
                setMarkerInfo();
                cluster.addMarker(focusedMarker);
            }
            removeMarker(focusedMarker);
            return;
        }
        moveTo(info);//执行移动动画
    }
}

//关注的车辆移动至更新的位置
function moveTo(info) {
    var point = new AMap.LngLat(info.GoogleLongitude, info.GoogleLatitude);//终点坐标
    var currentPoint = focusedMarker.getPosition();//当前坐标
    var starttime = focusedMarker.getExtData().GpsDateTime;//当前时间
    var endtime = info.GpsDateTime;//结束时间
    var time = getTime(starttime, endtime);//计算时间差
    updateInfo(focusedMarker, info); //更新点标记信息
    getRoute(currentPoint, point,time, startMove);
}

//获取两个点间的路线
function getRoute(pointStart, pointEnd,time,callback) {
    if (driving == null || driving == undefined)
        return;
    driving.clear();
    driving.search(pointStart, pointEnd, function (status, result) {
        searchCallBack(pointStart, pointEnd,status, result, time, callback);
    });	
}

//driving查询成功(start:起点坐标,end:终点坐标,status:状态,reuslt:查询结果,time:时间,callback:回调函数)
function searchCallBack(start, end,status, result, time, callback) {
    var distance;
    var path = [];//路径坐标点数组
    var speed=0;
    //path.push(start);
    if (status == "complete") {
        try {
            distance = result.routes[0].distance / 1000;
            speed = getSpeed(distance, time);
        } catch (e) {
        }
        var points = getPoints(result);
        if (points != null && points != undefined && points.length) {
            path = path.concat(points);
        }

    } else {
        distance = start.distance(end) / 1000; //两个坐标是AMap.LngLat格式，两点间的距离(千米)
        speed = getSpeed(distance, time);
        path.push(start);
        path.push(end);
    }
   // path.push(end);
    if (typeof (callback) == "function") {
        callback(path, speed);
    }
}

//driving查询成功，获取查询结果的点标记集合
function getPoints(result) {
    var points = [];
    if (result.routes.length == 0) {
        return null;
    }
    points.push(result.origin);
    var route = result.routes[0];//查询的路径结果
    var steps = route.steps;//路径中的路段集合
    for (var i = 0; i < steps.length; i++) {
        var step = steps[i];
        points.push(step.start_location);
        var path = step.path;//此路段的坐标集合
        if (path != null && path != undefined && path.length > 0) {
            points = points.concat(path);
        }
        path.push(step.end_location);
    }
    points.push(result.destination);
    return points;
}

//更新点标记中存储的车辆信息
function updateInfo(marker, carInfo) {
    var oldInfo = marker.getExtData();
    if (oldInfo == null || oldInfo == undefined)
        return;
    oldInfo.GoogleLatitude = carInfo.GoogleLatitude;
    oldInfo.GoogleLongitude = carInfo.GoogleLongitude;
    oldInfo.WorkState = carInfo.WorkState;
    oldInfo.Speed = carInfo.Speed;
    oldInfo.GpsDateTime = carInfo.GpsDateTime;
    oldInfo.DOil = carInfo.DOil;
    oldInfo.Mileage = carInfo.Mileage;
    oldInfo.AccState = carInfo.AccState;
    oldInfo.LocationAddress = carInfo.LocationAddress;
}

//计算平均速度(distance:路程单位千米，time：时间，单位小时)
function getSpeed(distance,time) {    
    var speed = 0;
    if (time <= 0 || distance*1000< 1) {
        speed = 0;
    } else {
        speed = distance / time; //速度(km/h)
    }
    return speed;
}

//计算时间差
function getTime(startTime, endTime) {
    //开始时间  
    sta_str = startTime.replace(/-/g, "/");
    var sta_date = new Date(sta_str); //将字符串转化为时间  
    //结束时间  
    var end_str = endTime.replace(/-/g, "/");
    var end_date = new Date(end_str);
    var time = (end_date - sta_date) / (1000 * 3600); //求出两个时间的时间差(小时)
    return time;
}

//driving查询结束点标记移动(path:坐标数组,speed:平均速度(km/h))
function startMove(path,speed) {
    if (speed <= 0)
        return;
    if (isMoving == false) {//如果点标记未处于移动状态
        //以下用于解决点标记移动和地图缩放同时发生时报错的问题
        cluster.removeMarker(focusedMarker);//从聚合中移除
        focusedMarker.setMap(map);//点标记显示在地图上
    }
    hideCarno(focusedMarker);//取消显示车牌号
    focusedMarker.moveAlong(path, speed);
}

//根据车牌号移除单个点标记
function removeMarkerByCarNo(carno) {
    var carNo = eval(carno);
    var marker = isHasMarker(carNo);
    if (marker == null) {
        if (focusedMarker!=null&&focusedMarker!=undefined&&focusedMarker.getExtData().Carno == carNo) {
            marker = focusedMarker;
        }   
    }
    removeMarker(marker);
}

//移除点标记(marker为点标记对象)
function removeMarker(marker) {
    if (marker == null)
        return;
    var carno=marker.getExtData().Carno
    if (isMoving == true && carno == focusedMarker.getExtData().Carno) {
        focusedMarker.stopMove();
        isMoving = false;
        setMarkerInfo();
        cluster.addMarker(focusedMarker);
        focusedMarker.setMap(null);
    }
    if (marker == clickedMarker) {
        if (infoWindow != null && infoWindow != undefined && infoWindow.getIsOpen() == true)
            closeInfoWindow();
    }
    if (cluster != null && cluster != undefined && marker != null) {
        cluster.removeMarker(marker);
    }
}

//点击marker弹出信息框
function markerClick(e) {
    clickedMarker = e.target;//标记发生点击事件的Marker
    initInfoWin(clickedMarker);
    var position = clickedMarker.getPosition();//点击的marker所在的位置
    infoWindow.open(map, position);
}

///实例化并弹出信息窗体
function initInfoWin(marker) {
    if (marker == null)
        return;
    var carInfo =marker.getExtData();//获取marker中存储的车辆信息
    var carType = carInfo.Cartypename + " " + carInfo.Carbrand + " " + carInfo.MachineModelName;
    //实例化信息窗体
    var content = [];
    var title = '<span id="carno">' + carInfo.Carno + '</span><img id="close" onclick ="closeInfoWindow()" src="../img/xn.png"/>';
    content.push("<ul><li>车  型：" + carType + "</li>");
    content.push("<ul><li>时  间：" + carInfo.GpsDateTime + "</li>");
    content.push("<ul><li>车  组：" + carInfo.GroupName + "</li>");
    content.push("<ul><li>车主电话：" + carInfo.LinkPhone + "</li>");
    content.push("<ul><li>终端号：" + carInfo.TerminalId + "</li>");
    content.push("<ul><li>ACC状态： " + carInfo.AccState + "</li>");
    content.push("<ul><li>速  度：" + carInfo.Speed + "(km/h)" + "</li>");
    content.push("<ul><li>油  量：" + carInfo.DOil + "(L)" + "</li>");
    content.push("<ul><li>里  程：" + carInfo.Mileage + "(km)" + "</li>");
    content.push("<ul><li>位  置：" + carInfo.LocationAddress + "</li></ul>");
    content.push("<a href='#' onclick ='getHistory()'><div id='btn'>轨迹</div></a>");
    infoWindow = new AMap.InfoWindow({
        isCustom: true,  //使用自定义窗体
        content: createInfoWindow(title, content.join("")),
        //offset: new AMap.Pixel(13, -30),
        offset: new AMap.Pixel(13, -60),
        closeWhenClickMap: true,//当点击地图是窗体自动关闭  
        autoMove:false
    });
}

//构建信息窗体
function createInfoWindow(title, content) {
    var info = document.createElement("div");
    info.className = "info";

    //可以通过下面的方式修改自定义窗体的宽高
    //info.style.width = "400px";
    // 定义顶部标题
    var top = document.createElement("div");
    var titleD = document.createElement("div");
    var closeX = document.createElement("span");
    top.className = "info-top";
    titleD.innerHTML = title;
    closeX.onclick = closeInfoWindow;

    top.appendChild(titleD);
    top.appendChild(closeX);
    info.appendChild(top);

    // 定义中部内容
    var middle = document.createElement("div");
    middle.className = "info-middle";
    middle.innerHTML = content;
    info.appendChild(middle);

    // 定义底部内容
    var bottom = document.createElement("div");
    bottom.className = "info-bottom";
    //bottom.style.position = 'relative';
    var sharp = document.createElement("img");
    sharp.src = "http://webapi.amap.com/images/sharp.png";
    bottom.appendChild(sharp);


    info.appendChild(bottom);
    return info;
}

//关闭信息窗体
function closeInfoWindow() {
    clickedMarker = null;
    map.clearInfoWindow();
}

//点击弹出窗口的轨迹连接切换到轨迹回放界面
function getHistory()
{
	var carno=document.getElementById("carno").innerHTML;
	window.external.GetHistory(carno);
}


//根据车牌号查看车辆当前的实时状态
function fitToView(carNo) {
    if (focusedMarker != null && focusedMarker != undefined) {
        focusedMarker.setzIndex(100);//设置点标记叠加顺序(默认:100)
        if (isMoving) {
            focusedMarker.stopMove();
            isMoving = false;
            setMarkerInfo();
            cluster.addMarker(focusedMarker);
        }
    }
    focusedMarker = isHasMarker(carNo);
    if (focusedMarker != null && focusedMarker != undefined) {
        focusedMarker.setzIndex(200);
        clickedMarker = focusedMarker;
        var position = focusedMarker.getPosition();
        map.setZoomAndCenter(16, position);
        initInfoWin(focusedMarker);
        infoWindow.open(map, position);
    }
}

//刷新界面
function refresh() {
    location.reload();
}

