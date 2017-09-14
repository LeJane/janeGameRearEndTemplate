

function SetWidth(){
	//动态设置高度

	var windowHeight = $(window).height();//当前页面高度
	var panel=(windowHeight-131);
	$("#treeDemoMap").css({
		"max-height":(windowHeight-645)+"px"
	})

	$(".panel-body").css({"max-height":panel+"px"})
	
	// var TotalHeight=windowHeight-headerHeight-demoHeight-footerHeight;
	
	var Table=$("#ScrollTab").height();
	$("#container").css({
		"height":(panel-10)+"px"
	})
	// $("#ScrollTab").css({
		// "max-height":(leftHeight-(TotalHeight/2)-115)+"px"
	// })
}

window.onload=SetWidth();





//日历高亮

var CarNo="";	//车牌号

var IconCarNoName="";

var GroupCode=$("#GroupCode").val();

var treeSettingMap = {
		async : {
			url : web_url+"AppUserInfo/UserCarList",
			type : "post",
			enable : true,
			autoParam :['Code'],
			otherParam: {
				"GroupCode":GroupCode
				},
			dataFilter: ajaxDataFilter
		},
		view : {
			selectedMulti : false,
			nameIsHTML: true,
			dblClickExpand: false
		},
		check : {
				enable : true,
				chkStyle: "radio"
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
			beforeCheck: zTreeBeforeCheckMap
		}
	};
	//组织树预处理函数
	function ajaxDataFilter(treeId, parentNode, responseData) {
		var nodes=responseData.Result;
		
		var ArrData=new Array();
		if (nodes) {
			for (var i = 0; i < nodes.length; i++) {
				fGroup=nodes[i]['FleetGroupList'];
				for (var f=0; f < fGroup.length; f++){
					//处理code重复问题
					fGroup[f]['Code']=fGroup[f]['Code']+"fGroup";		//避免code重复
					
					fGroup[f]['ParentCode']=nodes[i]['Code'];
					
					fGroup[f]['nocheck']=true;
					fGroup[f].open=true;
					fGroup[f]['iconSkin']="assignmentSkin";	//分组类名
					ArrData.push(fGroup[f]); //压入子节点	分组
					
					CarNos=fGroup[f]['CarList'];
					//车辆循环
					for(var c=0;c<CarNos.length;c++){
						//处理code重复问题
						CarNos[c]['ParentCode']=fGroup[f]['Code'];
						CarNos[c]['Name']=CarNos[c]['Carno'];
		
						CarNos[c]['iconSkin']="vehicleSkin";	//分组类名
						CarNos[c]['GroupFlag']="assignment";	//分组标记，用于选择时只能选择分组，而不能选择企业
						CarNos[c]['type']="group";		//用于搜索时的标记
						ArrData.push(CarNos[c]); //压入子节点	车辆
					}
				}
				// nodes[i]['type']="group";
				nodes[i]['nocheck']=true;
				nodes[i].open=true;
				ArrData.push(nodes[i]);
			}
		}
		return ArrData;
	};

	/*
	*	FUNCTION beforClick 点击节点之前
	*	author	 兰子
	*/
	
	function beforeClickMap(treeId,treeNode,clickFlag){
		var node=$.fn.zTree.getZTreeObj("treeDemoMap");
		node.checkNode(treeNode,!treeNode.checked,treeNode,true);
		return false;
	}
	
	//勾选回调函数
	function zTreeBeforeCheckMap(treeId, treeNode){
            var treeObj = $.fn.zTree.getZTreeObj("treeDemoMap");
            var nodes = treeObj.getCheckedNodes(true);
            for(var i = 0; i < nodes.length; i++){
                treeObj.checkNode(nodes[i], false, true);
            }
        }
/**
 * 点击节点
 */
function zTreeOnClickMap(event, treeId, treeNode) {
		var nowDate=new Date();
		nowMonth = nowDate.getFullYear() + "-" + (parseInt(nowDate.getMonth() + 1) < 10 ? "0" + parseInt(nowDate.getMonth() + 1):parseInt(nowDate.getMonth() + 1)) + "-01";
         afterMonth = nowDate.getFullYear() + "-" + (parseInt(nowDate.getMonth() + 2) < 10? "0" + parseInt(nowDate.getMonth() + 2):parseInt(nowDate.getMonth() + 2)) + "-01";
	
	var zTree = $.fn.zTree.getZTreeObj("treeDemoMap");
            nodes = zTree.getCheckedNodes(true);	//获得选中的节点数据
            v = "";	
            // nodes.sort(function compare(a,b){return a.Id-b.Id;});	//排序
            
            for (var i=0, l=nodes.length; i<l; i++) {
            	if (nodes[i].GroupFlag == "assignment") { // 选择的是分组，才组装值
            		if (nodes[i].Code, nodes[i].Name) {
		                v = nodes[i].Name;
            		} else {
            			nodes[i].checked = false;
            			amtNames = nodes[i].Name;
            		}
            	}
            }
        
           	// var cityObj = $("#CarNosName");
            // cityObj.attr("value", t);
			//赋值
            CarNo=v;
			$("#CarNo").val(v);

			getActive(v,nowMonth,afterMonth)		//获得历史信息
};
var IntHeight=0;

$(function(){
	
	 var today = new Date();
  
	  var tYear = today.getFullYear();	//当年
	  
	  var tMonth = (parseInt(today.getMonth()+1) < 10 ? "0" + parseInt(today.getMonth()+1) : parseInt(today.getMonth()+1)) ;	//当月
	  
	  var tDate =(today.getDate() < 10 ? "0" + today.getDate():today.getDate());		//当日
	  
	  $("#beginDateTime").val(tYear+"-"+tMonth+"-"+tDate + " "+"00:00:00");
	  $("#endDateTime").val(tYear+"-"+tMonth+"-"+tDate +" "+"23:59:59");		//初始化日历
	  
	//日历显示
	$('.calendar3').calendar();
	
	
	//车辆信息
	$.fn.zTree.init($("#treeDemoMap"), treeSettingMap);
	 
	 // 组织架构模糊搜索
	$("#CarNo").on("input oninput",function(){
		search_ztree('treeDemoMap','CarNo','group');
	});
	
	initialize();
	
	addMenu();
	
	
	//当查询点击时执行请求
	$("#query").on("click",function(){
		
		if(CarNo ==""){
			layer.alert("车辆不能为空");
			return;
		}
		//时间
		var beginDateTime=$("#beginDateTime").val();
		
		var endDateTime=$("#endDateTime").val();
		if(beginDateTime=='' || endDateTime==''){
			layer.alert("时间不能为空");
			return;
		}
		var startDate=new Date(beginDateTime);	//开始时间
		
		var endDate=new Date(endDateTime);	//结束时间
		if(startDate.getTime() > endDate.getTime()){
			layer.alert("结束时间不能小于开始时间");
			return;
		}
			
			 $.ajax({
				type:"POST",//通常会用到两种：GET,POST。默认是：GET
				url:History+"/CarState/CarHistoryInfos",//(默认: 当前页地址) 发送请求的地址
				dataType:"json", //预期服务器返回的数据类型。"json"
				async:true, // 异步同步，true  false
				beforeSend:beforeSend,
				data:JSON.stringify({"CarNo":CarNo,"beginDateTime":beginDateTime,"endDateTime":endDateTime}),
				contentType:"application/json",
				timeout : 8000, //超时时间设置，单位毫秒
				success:function(data){
				 console.log(data);
				 var CarTd="";
				 if(data.State==200){
					var obj=data.Result;
					var JsonArray=new Array();
					if(obj){
						for(var i=0;i<obj.length-1;i++){
							var nextIndex=obj[i+1];
							   
								if(obj[i].GoogleLongitude !=nextIndex.GoogleLongitude || obj[i].GoogleLatitude !=nextIndex.GoogleLatitude){
									
										JsonArray.push(obj[i]);
										
										if(obj[i]['WorkState']=="待机"){
											IconCarNoName="carStandBy.png";
										}else if(obj[i]['WorkState']=="工作"){
											IconCarNoName="carWork.png";
										}else{
											IconCarNoName="carStandBy.png";
										}
										//生成表格数据
										CarTd+="<tr>";
										CarTd+="<td>"+ JsonArray.length+"</td>";
										CarTd+="<td>"+ CarNo +"</td>";
										CarTd+="<td>"+ obj[i]['GpsDateTime'] +"</td>";
										CarTd+="<td>"+obj[i]['AccState'] +"</td>";
										CarTd+="<td>"+ obj[i]['Speed'] +".00"+"</td>";
										CarTd+="<td>"+ obj[i]['Direction'] +"</td>";
										CarTd+="<td>"+ obj[i]['GoogleLongitude'] +"</td>";
										CarTd+="<td>"+ obj[i]['GoogleLatitude'] +"</td>";
										
										var Pos=new Array(
											obj[i]['GoogleLongitude'],
											obj[i]['GoogleLatitude']
										)
//										CarTd+="<td>绵阳</td>";
										CarTd+="<td class='addFormat"+i+"'>查询中</td>";
										getPos(Pos,i);
										CarTd+="</tr>";
									
								}
								
							}
					
						clearMap();
						
						//设置表格的最大高度
				
						//加载轨迹
						newLoadPath(JSON.stringify(JsonArray),IconCarNoName);
						
						if($("#playIcon").hasClass("suspendedIcon")){
							$("#playIcon").removeClass("suspendedIcon").addClass("playIcon");	//播放
						}
						$("#playCarListIcon").show();
						if($("#CarNoData").find("tr").length>1){
							$("#CarNoData").html('');
							$("#CarNoData").append(CarTd);
						}else{
							$("#CarNoData").append(CarTd);
						}
						IntHeight=0;	//改变表格距离顶部高度
						$("#ScrollTab").scrollTop(0);	//改变表格距离顶部高度为0
						
						$("#CarNoData tr").removeClass("success");
						$("#CarNoData tr:nth-child(1)").addClass("success");
						
						
						
						var DataTab=$("#ScrollTab").height();	//表格高度
					
						if($(document).width()>1400){
							var MapHeight=$("#container").height()+34;		//地图高度
						}else{
							var MapHeight=$("#container").height()+35;		//地图高度
						}
						
						
						
							MapHeight=MapHeight-DataTab;
							$("#container").css({
								height:MapHeight+"px"
							})
						
					}else{
						$("#playCarListIcon").hide();
						$("#playIcon").removeClass("suspendedIcon").addClass("playIcon");
						if($("#CarNoData").find("tr").length>1){	//清除表格
							
							$("#CarNoData").html('');
						}	
						
						var windowHeight = $(window).height();//当前页面高度
						var panel=(windowHeight-131);
						
							$("#container").css({
								"height":+(panel-10)+"px"
							})
						
						clearMap();
						
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
	
	});
	
	
});
	
	//播放
	function PlayMap(){
		
		if(!isPlaying && !isresumeMove){
			$("#playIcon").removeClass("playIcon").addClass("suspendedIcon");	//播放
			moveAlong()
		}else if(isPlaying){
			$("#playIcon").removeClass("suspendedIcon").addClass("playIcon");
								//暂停播放
			pauseMove()
			
		}else if(!isPlaying && isresumeMove ){
						//继续播放
			$("#playIcon").removeClass("playIcon").addClass("suspendedIcon");
			resumeMove() 
		}
	}
	
	//停止播放
	function Restart(){
		if(isPlaying){
			$("#playIcon").removeClass("suspendedIcon").addClass("playIcon");
		}
		stopMove();
	}
	
	
	//当车辆点击时请求数据
	function getActive(CarNo,nowMonth,afterMonth){
		var dataTime = nowMonth.split("-")[0] + nowMonth.split("-")[1];
        // json_ajax("POST",History+"/CarState/CarHistoryInfos","json",true,{"CarNo":CarNo,"nowMonth":nowMonth,"afterMonth":afterMonth,function(data){
			
		// });
	}
	
	
	function DataTableHistory(process,stat){
		//表格交互
		
			if(stat){
				
				IntHeight=IntHeight+1;
				
				
				
				var tableTrHeight = parseInt($("#CarNoData tr:first-child").height()) * IntHeight;
				
				
				
				
				
				$("#CarNoData tr:nth-child("+ process +")").addClass("success").siblings().removeClass("success");
				
				
				$("#ScrollTab").scrollTop(tableTrHeight);
				
				
			}else{
				
				IntHeight=0;
				$("#CarNoData tr").removeClass("success");
				$("#CarNoData tr:nth-child(1)").addClass("success");
				$("#ScrollTab").scrollTop(0);
				
			}
	}	
	
function getPos(pos,number){
	AMap.plugin('AMap.Geocoder',function(){//根据经纬度获取详细地址信息
		var geocoder = new AMap.Geocoder({
    		city: "010",//城市，默认：“全国”
    		radius: 1000, 
            extensions: "all" 
		});
	    geocoder.getAddress(pos,function(status,result){
            if(status=='complete'){
				geocoder_CallBack(result,number)
            }
    	})
	});
}

function geocoder_CallBack(data,number) {
        var address = data.regeocode.formattedAddress; //返回地址描述
        $("#CarNoData").find(".addFormat"+number+"").text(address)
		
}	

	
