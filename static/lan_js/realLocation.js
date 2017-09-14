//地图聚合
var cluster;
var infoWindow;//信息窗体
var focusedMarker;//当前关注的车辆
var clickedMarker;//标记弹出了信息框的marker
var isMoving=false;//点标记是否正在执行moveAlong
var numbers=0;
var CarNo="";	//车牌号
var onlineArray=new Array();//在线车辆集合
var onlineTotalArray=new Array();
var sumarry=new Array();
var offlineArray=new Array();//离线车辆集合
var sumCarNo=[];//车牌集合
var data=new Array();
var IsFresh=false;
var TotalCarNo;
var GroupCode=$("#GroupCode").val();
var updateCarArry=new Array();
var Caraddress=new Array();//车辆地址
var initialHeight;//地图初始高度
var treeSettingMap = {
		async : {
			url : web_url+"AppUserInfo/UserCarList",
			type : "post",
			enable : true,
			autoParam :['Code'],
			dataType : "json",
			otherParam: {
				"GroupCode":GroupCode
				},
			dataFilter: ajaxDataFilter
		},
		view : {
			selectedMulti : false,
			nameIsHTML: true,
			dblClickExpand: false,
//			fontCss : setFontCss
		},
		check : {
				enable : true,
//				chkboxType:{ "Y": "p", "N": "s" },
				chkStyle: "checkbox",
//				autoCheckTrigger: true
			},
		data : {
			simpleData : {
				enable : true,
				idKey:"Code",
				pIdKey:"ParentCode",
				rootPId:""
			},
			key:{
				enable:true,
				name:"Name"
			},
			check:{
				enable:true,
				chkStyle:"checkbox",
			}
		},

		callback : {
			beforeClick:beforeClickMap,
			onClick : zTreeOnClickMap,
			onCheck:zTreeOnClickMap,
			beforeCheck: zTreeBeforeCheckMap,
		}
	};

//动态设置高度
function SetWidth(){

	var mainHeight = $(window).height();//当前页面中间高度
	var demoHeight = $("#ScrollTab").height();//表格高度
	initialHeight=mainHeight-demoHeight-101;//地图    顶部、底部、空隙高度和101
	$("#pull_down").css({
		"min-height":(mainHeight-139)+"px"
	})
	$("#treeDemoRealMap").css({
		"max-height":(mainHeight-250)+"px"
	})
	
	$("#container").css({
		height:initialHeight+"px"
	})
	$("#ScrollTab").css({
		"max-height":((initialHeight/2)-70)+"px"
	})
}

window.onload=SetWidth();

	//组织树预处理函数
	function ajaxDataFilter(treeId, parentNode, responseData) {
		var nodes=responseData.Result;
		var ArrData=new Array();
		var sumcar=[];
		var sumname=[];
		if (nodes) {
			for (var i = 0; i < nodes.length; i++) {
				fGroup=nodes[i]['FleetGroupList'];
					for (var f=0; f < fGroup.length; f++){
						//处理code重复问题
						fGroup[f]['Code']=fGroup[f]['Code']+"fGroup";		//避免code重复
						fGroup[f]['ParentCode']=nodes[i]['Code'];
						fGroup[f].open=true;
						fGroup[f]['iconSkin']="assignmentSkin";	//分组类名
						ArrData.push(fGroup[f]); //压入子节点	分组
						
						//车辆循环
						CarNos=fGroup[f]['CarList'];
						for(var c=0;c<CarNos.length;c++){
							//处理code重复问题
							if(CarNos[c] && CarNos[c] !=null){
								CarNos[c]['ParentCode']=fGroup[f]['Code'];
								CarNos[c]['Name']=CarNos[c]['Carno'];
								CarNos[c]['iconSkin']="vehicleSkin";	//分组类名
								CarNos[c]['GroupFlag']="assignment";	//分组标记，用于选择时只能选择分组，而不能选择企业
								CarNos[c]['type']="group";		//用于搜索时的标记
								CarNos[c]['CarType']=1;		//用于搜索时的标记
								ArrData.push(CarNos[c]); //压入子节点	车辆
							}
						}
					}
				nodes[i]['type']="group";
				nodes[i].open=true;
				ArrData.push(nodes[i]);
			}
		}
		
		//找出所有车辆
		for (var a=0;a<ArrData.length;a++) {
			if(ArrData[a].GroupFlag == "assignment"){
				sumcar.push(ArrData[a]);
			}else{
				sumname.push(ArrData[a]);
			}
		}
		//拿到所有车牌
//		var sumdata=[];
		for(var r=0;r<sumcar.length;r++){
			sumCarNo.push(sumcar[r].Carno);
			for (var n=0;n<sumname.length;n++) {
				if(sumcar[r].ParentCode==sumname[n].Code){
					data.push({"GroupName":sumname[n].Name,"LinkPhone":sumname[n].LinkPhone,"TerminalId":sumcar[r].TerminalId,"Cartypename":sumcar[r].Cartypename,"Carbrand":sumcar[r].Carbrand,"MachineModelName":sumcar[r].Carbrand,"Carno":sumcar[r].Carno});
				}
			}
		}
		
		sendcarajxa(sumCarNo);
		TotalCarNo=sumCarNo;		//总车辆
		
		$("#tall").html("("+sumcar.length+")");
		return ArrData;
	};

	/*
	*	FUNCTION beforClick 点击节点之前
	*	author	 兰子
	*/
	
	function beforeClickMap(treeId,treeNode,clickFlag){
		var node=$.fn.zTree.getZTreeObj("treeDemoRealMap");
		node.checkNode(treeNode,!treeNode.checked,treeNode,true);
		return false;
	}
	
	//勾选回调函数
	function zTreeBeforeCheckMap(treeId, treeNode){
            var treeObj = $.fn.zTree.getZTreeObj("treeDemoRealMap");
            var nodes = treeObj.getCheckedNodes(true);
            // for(var i = 0; i < nodes.length; i++){
                // treeObj.checkNode(nodes[i], false, true);
            // }
			
        }

/**
 * 点击节点
 */
var SplitStr='';
var carl=[];
function zTreeOnClickMap(event, treeId, treeNode) {
	var zTree = $.fn.zTree.getZTreeObj("treeDemoRealMap");
//  nodes = zTree.getCheckedNodes(true);	//获得选中的节点数据
    nodes = zTree.getChangeCheckedNodes();
    v = "";
    
	    for (var i=0, l=nodes.length; i<l; i++) {
	    	if (nodes[i].GroupFlag == "assignment") { // 选择的是分组，才组装值
	    		if (nodes[i].Code, nodes[i].Name) {
	                v += nodes[i].Name + ",";
//	                c+=nodes[i].Name+","+nodes[i].;
//	                carl.push(c);
	    		} else {
	    			nodes[i].checked = false;
	    			amtNames = nodes[i].Name;
	    		}
	    	}
	    	nodes[i].checkedOld=nodes[i].checked;
	    }
	if (v.length > 0) v = v.substring(0, v.length-1);	//去掉多余的逗号
	
   	var cityObj = $("#CarNoName");
    cityObj.val(v);
	//赋值
    $("#CarNos").val(v);
	var StrData=$("#CarNos").val();
	SplitStr=StrData.split(",");
	if(treeNode.checked==false){
		var DataTab=$("#ScrollTab").height();	//表格高度
		var MapHeight;
		
		removeMarkers(SplitStr);
		for (i=0;i<SplitStr.length;i++) {
			$("#CarNoData .CarNo"+ SplitStr[i] +"").remove('tr');
			var DataTaba=$("#ScrollTab").height();	//表格高度
			if(parseInt($(window).width())<1400){
						MapHeight=initialHeight-DataTaba+($("#dataTable thead").height()+11);
						
						$("#container").css({"height":MapHeight+"px"})
					}else{
						MapHeight=initialHeight-DataTaba+($("#dataTable thead").height());
						
						$("#container").css({"height":MapHeight+"px"})
					}
		
		}
	}
	else{
		//执行请求
		sendajxa(SplitStr);
	}			
};

//function reduce(SplitiStr){
//	var carno=SplitiStr;
//	for (i=0;i<carno.length;i++) {
//		$("#CarNoData .CarNo"+ carno[i] +"").remove('tr');
//	}
//}

var carInfos = [];
//根据树上点击的车辆，生成表格与地图打点
function sendajxa(SplitStr){		 
		$.ajax({
			type:"POST",//通常会用到两种：GET,POST。默认是：GET
			url:History+"/CarState/CarLocationInfo",//(默认: 当前页地址) 发送请求的地址
			dataType:"json", //预期服务器返回的数据类型。"json"
			async:true, // 异步同步，true  false
			beforeSend:beforeSend,
			data:JSON.stringify(SplitStr),
			contentType:"application/json",
			timeout : 8000, //超时时间设置，单位毫秒
			success:function(data){
			var CarTd="";
			if(data.State==200){
				var obj=data.Result;
				var JsonArray=new Array();
				carInfos=[];
				if(obj){
					for(var i=0;i<obj.length;i++){
						var nextIndex=obj[i];
							JsonArray.push(obj[i]);
							
							//生成表格数据
							CarTd+="<tr style='word-spacing:normal' class='CarNo"+ obj[i]['CarNo'] +"'>";
							CarTd+="<td style='word-spacing:normal'>"+ obj[i]['CarNo'] +"</td>";
							if(obj[i]['GpsDateTime']!=null){
								CarTd+="<td style='word-spacing:normal'>"+ obj[i]['GpsDateTime'] +"</td>";
							}else{
								CarTd+="<td style='word-spacing:normal'>无</td>";
							}
							CarTd+="<td style='word-spacing:normal'>"+obj[i]['AccState'] +"</td>";
							CarTd+="<td style='word-spacing:normal'>"+ obj[i]['Speed'] +".00"+"</td>";
							if(obj[i]['Direction']!=null){
								CarTd+="<td style='word-spacing:normal'>"+ obj[i]['Direction'] +"</td>";
							}else{
								CarTd+="<td style='word-spacing:normal'>无</td>";
							}
							CarTd+="<td style='word-spacing:normal'>"+ obj[i]['GoogleLongitude'] +"</td>";
							CarTd+="<td style='word-spacing:normal'>"+ obj[i]['GoogleLatitude'] +"</td>";
							var Pos=new Array(
								obj[i]['GoogleLongitude'],
								obj[i]['GoogleLatitude']
							)
							CarTd+="<td style='word-spacing:normal' class='"+ obj[i]['CarNo'] +"addFormat'>查询中</td>";
							
							getPos(Pos,obj[i]['CarNo']);
						
							CarTd+="</tr>";
							carInfos[i]=obj[i];
						}
						addMarkers(carInfos);

						$("#CarNoData").append(CarTd);
						
						//点击tr
						$("#dataTable").find("tbody tr").on("click",function(){
						  	$(this).addClass("onbackgroup").siblings("tr").removeClass("onbackgroup");
//							var po =[$('.onbackgroup')[0].cells[5].innerHTML,$('.onbackgroup')[0].cells[6].innerHTML];
//		  					map.panTo(po);
		  					map.setZoomAndCenter(15, [$('.onbackgroup')[0].cells[5].innerHTML, $('.onbackgroup')[0].cells[6].innerHTML]);//找到表格点击车辆及缩放级别
						});
					IntHeight=0;	//改变表格距离顶部高度
					$("#ScrollTab").scrollTop(0);	//改变表格距离顶部高度为0
					
					// var treeHeight=$("#treeDemoRealMap").height();
					var DataTab=$("#ScrollTab").height();	//表格高度
					
					
				
					if(parseInt($(window).width())<1400){
						var MapHeight=initialHeight-DataTab+($("#dataTable thead").height()+11);
						
						$("#container").css({"height":MapHeight+"px"})
					}else{
						var MapHeight=initialHeight-DataTab+($("#dataTable thead").height());
						
						$("#container").css({"height":MapHeight+"px"})
					}
						
					
				}
			}else{
				layer.alert(data.Error); 
				return;
			}
			
		 }, error:function(XMLHttpRequest, textStatus, errorThrown){
			  layer.closeAll('loading');
			if(textStatus=="timeout"){
				layer.alert("加载超时，请重试");
			}else{
				/*alert(textStatus);*/
			}
		 },			//请求出错
		 complete:function(XMLHttpRequest, textStatus){
			 layer.closeAll('loading');
		 }	//请求完成
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

//添加车辆点标记
function addMarkers(carInfos) {
    var infos = carInfos; 
    var markers = []; //数组，存储要添加的点标记
    for (var i = 0; i < infos.length; i++) {
        var info = infos[i];
        var carno = info.CarNo;
        if(info.Online==1){
	//      var iconStr = info.IconName;
	        if (isHasMarker(carno) != null) //对应车牌号的点标记是否已存在
	            continue;
	        var point = new AMap.LngLat(info.GoogleLongitude, info.GoogleLatitude);
	  
	        
	        var marker = new AMap.Marker({
	//          icon: iconStr,
				icon: "http://webapi.amap.com/images/car.png",
	            position: point,
	            autoRotation: true,
	            extData: info //Marker的用户自定义属性，存储车辆信息
	        });
//	      marker.on("moving", function (e) {
//	          isMoving = true;
//	          var icon = "http://webapi.amap.com/images/car.png";
//	          focusedMarker.setIcon(icon);
//	          focusedMarker.setOffset(new AMap.Pixel(-26, -13));
//	      });
	      marker.on("moveend", function () {
//	          isMoving = false;
//	          var info = focusedMarker.getExtData();
//	          focusedMarker.setIcon(info.IconName);
//	          setOffset(info.IconName, focusedMarker);
//	          focusedMarker.setAngle(0);
	          cluster.addMarker(marker);
	      });
	//      setOffset(iconStr, marker);
	        marker.on("click", markerClick);
	        map.panTo(marker.getPosition());
	        console.log(info.Carno);
		    marker.setTitle(""+carno+"");
		
		    // 设置label标签
		    marker.setLabel({//label默认蓝框白底左上角显示，样式className为：amap-marker-label
		        offset: new AMap.Pixel(-16, -26),//修改label相对于maker的位置
		        content:""+carno+"" 
		    });
	        markers.push(marker);
       }
    }
    //添加点聚合
    try {
        cluster.addMarkers(markers);
    } catch (e) {}

}

//更新单个点标记
function updateMarker(carInfo) {
    var info=carInfo;
    var marker = isHasMarker(info.CarNo);
    if (marker == null) {
        //点标记不存在,但车辆状态为在线则增加点标记
        if (info.Online == 1) {
            var markers = [];
            markers.push(info);
            addMarkers(markers);
            return;
        }
    } else {
        //点标记存在，但车辆状态为离线则删除点标记
        if (info.Online == 0) {
            removeMarker(marker);
            return;
        }
        var point = new AMap.LngLat(info.GoogleLongitude, info.GoogleLatitude);
        var currentPoint = marker.getPosition();
        var starttime = marker.getExtData().GpsDateTime;
        var endtime = info.GpsDateTime;

        updateInfo(marker, info); //更新点标记信息
//      if (marker == focusedMarker) {
            var speed = getSpeed(currentPoint, point, starttime, endtime);
            if (speed <= 0)
                return;
            var points = [];
            points.push(currentPoint);
            points.push(point);
//          driv(currentPoint,point);
            //cluster.removeMarker(marker);
            //marker.setMap(map);
//          alert(points);
//	        alert(speed);
            marker.moveAlong(points, speed);
//      } else {
//          marker.setPosition(point);
//      }
    }
}
//车辆路径规划
function driv(currentPoint,point){

	var aa=[currentPoint.lng,currentPoint.lat];
	var bb=[point.lng,point.lat];
	var p=[];
	AMap.plugin(["AMap.Driving"], function() {
        var drivingOption = {
            policy:AMap.DrivingPolicy.LEAST_TIME,
            map:map
        };
	    var driving = new AMap.Driving(drivingOption); //构造驾车导航类
	    //根据起终点坐标规划驾车路线
	    driving.search(new AMap.LngLat(currentPoint.lng,currentPoint.lat),new AMap.LngLat(point.lng,point.lat),function(status,result){
	//      button.onclick = function(){
	            driving.searchOnAMAP({
	                origin:result.origin,
	                destination:result.destination
	                
	            });
	            var ee=getPoints(result);
	    
	//      } 
	    });
    });
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
//  oldInfo.LocationAddress = carInfo.LocationAddress;
}
//删除车辆点标记
function removeMarkers(carnos){
	var arrCarNo=carnos;
	var markers=[];
	for(var i=0;i<arrCarNo.length;i++)
	{
	    var carno = arrCarNo[i];
		var marker=isHasMarker(carno);//获取车牌号对应的点标记对象
		if(marker!=null)
			markers.push(marker);
	}
	 try{
		cluster.removeMarkers(markers);//移除点标记
	}catch(e){} 
}

//判断对应车牌号的车辆标记是否存在，存在则返回点标记对象
function isHasMarker(carno){
	if(cluster==null)
	{
		return null;
	}
	var markers=cluster.getMarkers();//获取点聚合中点标记的集合
	for(var i=0;i<markers.length;i++)
	{
		var marker=markers[i];
		var extraCarNo = marker.getExtData().CarNo;//获取点标记用户自定义属性
		if(extraCarNo==carno)
			return marker;
	}
	return null;
}
//计算平均速度
function getSpeed(currentPoint, newPoint, startTime, endTime) {
    //开始时间  
    sta_str = startTime.replace(/-/g, "/");
    var sta_date = new Date(sta_str); //将字符串转化为时间  
    //结束时间  
    var end_str = endTime.replace(/-/g, "/");
    var end_date = new Date(end_str);
    var time = (end_date - sta_date) / (1000 * 3600); //求出两个时间的时间差(小时)
    var distance = currentPoint.distance(newPoint) / 1000; //两个坐标是AMap.LngLat格式，两点间的距离(千米)
    var speed = 0;
    if (time == 0 || distance * 1000 < 1) {
        speed = 0;
    } else {
        speed = distance / time; //速度(km/h)
    }
    return speed;
}

//点聚合实例化
function mapCluster() {
    var markers = [];
    //防止聚合重复在地图上显示车辆
    if (cluster) {
        cluster.setMap(null);
    }
    //显示热聚合 
    map.plugin(["AMap.MarkerClusterer"], function () {
        cluster = new AMap.MarkerClusterer(map, markers, {
            minClusterSize: 2,//聚合的最小数量
            maxZoom: 10 //当地图缩放至指定级别 才显示聚合
        });
    });
}
	
//点击marker弹出信息框
function markerClick(e) {
	var LocationAddress;
	var pos=[];
	var detailed;//车辆详细信息
    clickedMarker = e.target;//标记发生点击事件的Marker
    var position = e.target.getPosition();//点击的marker所在的位置
    pos=[position.lng,position.lat];//获取经纬度
    
    var carInfo = e.target.getExtData();//获取marker中存储的车辆信息
    for (var d=0;d<data.length;d++) {
    	if(data[d].Carno==carInfo.CarNo){
    		detailed=data[d];
    	}
    }
    AMap.plugin('AMap.Geocoder',function(){//根据经纬度获取详细地址信息
    	var geocoder = new AMap.Geocoder({
        	city: "010"//城市，默认：“全国”
    	});
	    geocoder.getAddress(pos,function(status,result){
	            if(status=='complete'){
	                LocationAddress= result.regeocode.formattedAddress //详细地址
	            }
		var carType=detailed.Cartypename+" "+detailed.Carbrand;
    	//实例化信息窗体
    	var content = [];
    	var title = '<span id="carno">' + carInfo.CarNo + '</span><img id="close" onclick ="closeInfoWindow()" src="'+local+'/Public/img/close.png" />';
    	content.push("<ul><li>车  型：" + carType + "</li>");
		content.push("<ul><li>时  间：" + carInfo.GpsDateTime + "</li>");
	    content.push("<ul><li>车  组：" + detailed.GroupName + "</li>");
		content.push("<ul><li>车主电话：" + detailed.LinkPhone + "</li>");
	    content.push("<ul><li>终端号：" + detailed.TerminalId+ "</li>");
	    content.push("<ul><li>ACC状态： " + carInfo.AccState + "</li>");
	    content.push("<ul><li>速  度：" + carInfo.Speed + "(km/h)" + "</li>");
	    content.push("<ul><li>油  量：" + carInfo.DOil+"(L)"+ "</li>");
	    content.push("<ul><li>里  程：" + carInfo.Mileage + "(km)" + "</li>");
	    content.push("<ul><li>位  置：" + LocationAddress +"</li></ul>");
	    content.push("<a href='javascript:;' onclick ='getHistory()'><div id='btn'>轨迹</div></a>");
	    content.push("<a href='javascript:;' onclick ='GetVideo( "+ detailed.TerminalId +" )'><div id='btn'>视频</div></a>");
	    content.push("<a href='javascript:;' onclick =''><div id='btn'>"+
			'<select id="sldd" style="width: 60px;padding:4px 0px;color:#6E61B2;border:solid 1px #e6e6e6" onchange="this.value>0?MonitorFourWindow.MonitorWindow[ this.value-1].selectWindow():0;">'+
				"<option value='0' selected>所有</option>"+
				"<option value='1' >第一个</option>"+
				"<option value='2' >第二个</option>"+
				"<option value='3' >第三个</option>"+
				"<option value='4'>第四个</option>"+
				"<select>"+
				"</div></a>");
		content.push("<a href='javascript:;' onclick ='GetVideoClose("+ detailed.TerminalId +")'><div id='btn'>关闭</div></a>");
		    infoWindow = new AMap.InfoWindow({
	        	isCustom: true,  //使用自定义窗体
	        content: createInfoWindow(title, content.join("")),
	        //offset: new AMap.Pixel(13, -30),
	        offset:new AMap.Pixel(13,-60),
	        closeWhenClickMap: true,//当点击地图是窗体自动关闭  
	        //autoMove:false
	    	});
    
    	infoWindow.open(map, position);
//      map.setZoomAndCenter(16, position);//当信息窗体的autoMove为true时，此句可设置将maker和信息窗体显示在地图中心
    	})
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

//刷新事件
function InitTree(Flash){
	if (!Flash || Flash =="undefined" || Flash==null){
			Flash=false;
		}else{
			Flash=Flash;
		}

	if(TotalCarNo){
		sendcarajxa(TotalCarNo);
	}
	if(SplitStr!=''){
		updateCar();
		//获取地址
		if(IsFresh){
    		if(Caraddress.length>0){
    			Caraddress.splice(0,Caraddress.length);
    		}
         }
	}
	if(updateCarArry.length!=0){
		for (var i=0;i<updateCarArry.length;i++) {
			updateMarker(updateCarArry[i]);
		}
	}
	//获取table序号 
	var tab=document.getElementById("CarNoData"); 
	//获取行数 
	var rows=tab.rows;
	if(rows!=null){
		if($("#dataTable").find(" tr").length>0){
			$("#CarNoData tr").on("click",function(){
		  		$(this).addClass("onbackgroup").siblings("tr").removeClass("onbackgroup");
//		  		var po =[$('.onbackgroup')[0].cells[5].innerHTML,$('.onbackgroup')[0].cells[6].innerHTML];
//		  		map.panTo(po);
		  		map.setZoomAndCenter(15, [$('.onbackgroup')[0].cells[5].innerHTML, $('.onbackgroup')[0].cells[6].innerHTML]);//找到表格点击车辆及缩放级别
			});
		}
	}
	
	if(Flash){
		IsFresh=true;
	}

	setTimeout("InitTree(Flash=true)",30000);		//30s刷新树
}

//过滤函数
function filter(node){
	 return node.CarType==1?node:"";	
}
//在线车辆过滤函数
function Onlinefilter(node){
	 return node.IsOnline==1?node:"";	
}
//离线车辆过滤函数
function Offlinefilter(node){
	 return node.IsOnline==0?node:"";	
}


$(function(){
	var n=$("#sidebar").hasClass("menu-compact");
	$("#sidebar").is(":visible")||$("#sidebar").toggleClass("hide");$("#sidebar").toggleClass("menu-compact");$(".sidebar-collapse").toggleClass("active");
	n=$("#sidebar").hasClass("menu-compact");
	n&&$(".open > .submenu").removeClass("open")
	//车辆信息
	$.fn.zTree.init($("#treeDemoRealMap"), treeSettingMap);
	 // 组织架构模糊搜索
	$("#CarNoName").on("input oninput",function(){
		alert();
		search_ztree('treeDemoRealMap','CarNo','group');
	});
	
	InitTree();	//30s刷新树
	mapDriving();//添加插件，驾车路线规划
	//全部显示
	$("#chooseAllPosition").on("click",function(){
		var ztree=$.fn.zTree.getZTreeObj("treeDemoRealMap");
		nodes=ztree.getNodesByFilter(filter);
		
		for(var online=0;online<nodes.length;online++){
			if(nodes[online]['Name']==onlineTotalArray[online]['CarNo']){
				nodes[online].IsOnline =onlineTotalArray[online]['Online'] ;
				ztree.updateNode(nodes[online]);
				ztree.showNode(nodes[online]);
			}
		}
		//online
		onlineArray=ztree.getNodesByFilter(filter);
		for(onlineCarNo=0;onlineCarNo<onlineArray.length;onlineCarNo++){
			var OnlineId=onlineArray[onlineCarNo].tId;
			$("#"+OnlineId+"_span").css("color","#333");
		}
	});
	//在线显示
	$("#onlinePosition").on("click",function(){
		var ztree=$.fn.zTree.getZTreeObj("treeDemoRealMap");
		nodes=ztree.getNodesByFilter(filter);
		
		for(var online=0;online<nodes.length;online++){
			if(nodes[online]['Name']==onlineTotalArray[online]['CarNo']){
				nodes[online].IsOnline =onlineTotalArray[online]['Online'] ;
				ztree.updateNode(nodes[online]);
				if(nodes[online]['IsOnline']==0){
					ztree.hideNode(nodes[online]);
				}else{
					ztree.showNode(nodes[online]);
				}
			}
		}
		//online
		onlineArray=ztree.getNodesByFilter(Onlinefilter);
		for(onlineCarNo=0;onlineCarNo<onlineArray.length;onlineCarNo++){
			var OnlineId=onlineArray[onlineCarNo].tId;
			$("#"+OnlineId+"_span").css("color","#45A541");
		}
		
	});
	//离线显示
	$("#missLinePosition").on("click",function(){
		var ztree=$.fn.zTree.getZTreeObj("treeDemoRealMap");
		nodes=ztree.getNodesByFilter(filter);
		
		for(var online=0;online<nodes.length;online++){
			if(nodes[online]['Name']==onlineTotalArray[online]['CarNo']){
				nodes[online].IsOnline =onlineTotalArray[online]['Online'] ;
				ztree.updateNode(nodes[online]);
				if(nodes[online]['IsOnline']==1){
					ztree.hideNode(nodes[online]);
				}else{
					ztree.showNode(nodes[online]);
				}
			}
		}
		//online
		offlineArray=ztree.getNodesByFilter(Offlinefilter);

		for(onlineCarNo=0;onlineCarNo<offlineArray.length;onlineCarNo++){
			var OnlineId=offlineArray[onlineCarNo].tId;
			$("#"+OnlineId+"_span").css("color","red");
		}
		
	});
	 // 组织架构模糊搜索
	$("#CarNo").on("input oninput",function(){
		search_ztree('treeDemoRealMap','CarNo','group');
	});
	
	initialize();//加载地图
	addMenu();
	mapCluster();//初始化cluster

    //地图缩放级别发生改变事件
    map.on("zoomchange", zoomChange);
    //地图发生移动动画结束后的事件
	map.on("moveend", moveEnd);
    
});

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

//在树加载完成后获取所有的实时数据	
function sendcarajxa(sumCarNo){	
		$.ajax({
			type:"POST",//通常会用到两种：GET,POST。默认是：GET
			url:History+"/CarState/CarLocationInfo",//(默认: 当前页地址) 发送请求的地址
			dataType:"json", //预期服务器返回的数据类型。"json"
			async:true, // 异步同步，true  false
			data:JSON.stringify(sumCarNo),
			contentType:"application/json",
			timeout : 10000, //超时时间设置，单位毫秒
			success:function(data){
			var CarTd="";
			if(data.State==200){
				var obj=data.Result;
				onlineTotalArray=[];
				onlineArray=[];
				offlineArray=[];
				if(obj){
					for(var i=0;i<obj.length;i++){
						onlineTotalArray.push(obj[i]);
						if(obj[i].Online==1){
							onlineArray.push(obj[i]);
						}else{
							offlineArray.push(obj[i]);
						}
					}
					$("#tline").html("("+onlineArray.length+")");
					$("#tmiss").html("("+offlineArray.length+")");
				}
			}else{
				layer.alert(data.Error); 
				return;
			}
			
		 }, error:function(XMLHttpRequest, textStatus, errorThrown){
			  layer.closeAll('loading');
			if(textStatus=="timeout"){
				layer.alert("加载超时，请重试");
			}else{
				/*alert(textStatus);*/
			}
		 },			//请求出错
		 complete:function(XMLHttpRequest, textStatus){
			 layer.closeAll('loading');
		 }	//请求完成
	});
}



//根据表格有多少车辆实时刷新数据
function updateCar(){
	var Add='';
	var tableCar=[];
	if(offlineArray){
		sumarry=onlineArray.concat(offlineArray);
	}
	//获取table序号 
	var tab=document.getElementById("CarNoData"); 
	//获取行数 
	var rows=tab.rows;
	if(rows!=null){
		//遍历行 
		tableCar=[];
		for(var i=0;i<rows.length;i++) { 
		//遍历表格列 
			tableCar.push(rows[i].cells[0].innerHTML);
		}
		updateCarArry=[];
		for (var x=0;x<tableCar.length;x++) {
			for (var y=0;y<sumarry.length;y++) {
				if(tableCar[x]==sumarry[y].CarNo){
				updateCarArry.push(sumarry[y]);
				}
			}
		}
	
		
		var Str='';
		var pos=new Array();
		for (var acf=0;acf<updateCarArry.length;acf++) {
		
			pos=[];
			var updatetime;
			var Direction;
			var udeadress;
			pos=[updateCarArry[acf].GoogleLongitude,updateCarArry[acf].GoogleLatitude];
			
			getPos(pos,updateCarArry[acf]['CarNo']);

			if(updateCarArry[acf]['GpsDateTime']!=null){
	    		updatetime= updateCarArry[acf]['GpsDateTime'];
	    	}else{
	    		updatetime="无";
	    	}
			if(updateCarArry[acf]['Direction']!=null){
				Direction=updateCarArry[acf]['Direction'];
			}else{
				Direction="无";
			}

			if(Caraddress.length>0){
				for (cd=0;cd<Caraddress.length;cd++){
					if(updateCarArry[acf]['CarNo']==Caraddress[cd]['c']){
						udeadress=Caraddress[cd]['Add'];
					}
				}
				if(updateCarArry[acf]['GoogleLongitude']==0 && updateCarArry[acf]['GoogleLatitude']==0){
					udeadress="无";
				}
			}else{
				udeadress="查询中";
			}
			

	    	Str+="<tr style='word-spacing:normal' class='CarNo"+ updateCarArry[acf]['CarNo'] +"'>"+"<td>"+ updateCarArry[acf]['CarNo'] +"</td>"+
	    	"<td style='word-spacing:normal'>"+ updatetime +"</td>"+
	    	"<td style='word-spacing:normal'>"+ updateCarArry[acf]['AccState'] +"</td>"+
	    	"<td style='word-spacing:normal'>"+ updateCarArry[acf]['Speed'] +".00"+"</td>"+
	    	"<td style='word-spacing:normal'>"+ Direction +"</td>"+
	    	"<td style='word-spacing:normal'>"+ updateCarArry[acf]['GoogleLongitude'] +"</td>"+
	    	"<td style='word-spacing:normal'>"+ updateCarArry[acf]['GoogleLatitude'] +"</td>"+
	    	"<td style='word-spacing:normal' class='"+ updateCarArry[acf]['CarNo'] +"addFormat'>"+udeadress+"</td>"+"</tr>";
			$('#CarNoData').html(Str);
		}
	}
}

CarNoaddress="";
Positaddress=new Object();
function getPos(pos,carno){
	
	if(pos[0]>0 || pos[1]>0){
			AMap.plugin('AMap.Geocoder',function(){//根据经纬度获取详细地址信息
			var geocoder = new AMap.Geocoder({
				city: "010",//城市，默认：“全国”
				radius: 1000, 
				extensions: "all" 
			});
			geocoder.getAddress(pos,function(status,result){
				if(status=='complete'){
					CarNoaddress = result.regeocode.formattedAddress;
					
					Positaddress={
						"Add":CarNoaddress,
						"c":carno
						};
					Caraddress.push(Positaddress);
		
				}else{
						Positaddress={
						"Add":"无",
						"c":carno
						};
					Caraddress.push(Positaddress);
				}
					geocoder_CallBack(result,carno)
			})
		});
	}
	
}

function geocoder_CallBack(data,carno) {
        var address = data.regeocode.formattedAddress; //返回地址描述
        $("#CarNoData").find("."+carno+"addFormat").text(address)
		
}


//轨迹回放跳转
function getHistory(){
	alert();
}
var IsVideo=false;
//获取视频
function GetVideo(ter){
	
	
		
			$("#RealVideo").show();
			
			var Con=$("#container").height();
			var Table=$("#ScrollTab").height();
			
			var H=0;
			
			if($(document).width()>1400){
				H=Con+Table;
			}else{
				H=Con+Table+10;
			}
			//总padding
			$("#TotalPadding").css({"padding-right":"0px"});
			$("#content-right").css({"padding-right":"0px","width":"45%"});
			
			$("#RealVideo").css({"padding-right":"0px","width":"32%","height":H+"px","background":"#ffffff","transition":"width 2s;","-moz-transition":"width 2s;"});
			
			
			
			var ConWidth=$("#RealVideo").width();
			

			var TotalHeight=(Con+Table)-40;
			
			
			TotalHeight=(TotalHeight/2);
			
			var TotalWidth=(ConWidth/2);
			
			MonitorFourWindow.MonitorWindow[0].resizeTo(0, 0, TotalWidth, TotalHeight);
			MonitorFourWindow.MonitorWindow[1].resizeTo(TotalWidth+10, 0, TotalWidth, TotalHeight);
			MonitorFourWindow.MonitorWindow[2].resizeTo(0, TotalHeight+20, TotalWidth, TotalHeight);
			MonitorFourWindow.MonitorWindow[3].resizeTo(TotalWidth+10, TotalHeight+20, TotalWidth, TotalHeight);
			
			MonitorFourWindow.invite("010086100861");
		IsVideo=true;
	
	

	
}

function GetVideoClose(ter){
	if(IsVideo){
		$(this).removeClass("map-Active");
		$("#RealVideo").hide();
		$("#TotalPadding").css({"padding-right":"15px"});
		$("#content-right").css({"padding-right":"5px","width":"75%"});
			
			 // $("#RealVideo").animate({width: '0%'}, "slow");
		$("#RealVideo").css({"padding-right":"15px","width":"0%","height":"0px","background":"#ffffff","transition":"width 2s;","-moz-transition":"width 2s;"});
		
		IsVideo=false;
		MonitorFourWindow.byte("010086100861");
	}
	
}
