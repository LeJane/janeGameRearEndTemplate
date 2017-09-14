var DataTableThtj;
var DataTableSon;

// 显示隐藏列
var menu_text = "";
var table = $("#yhtjbb tr th:gt(0)");
	menu_text += "<li data-stopPropagation=\"true\"><label><input type=\"checkbox\" checked=\"checked\" class=\"toggle-vis lan-checkbox\" data-column=\"" + parseInt(0) +"\" disabled />"+ table[0].innerHTML +"</label></li>"
	for(var i = 1; i < table.length; i++){
		menu_text += "<li data-stopPropagation=\"true\"><label><input type=\"checkbox\" checked=\"checked\" class=\"toggle-vis lan-checkbox\" data-column=\"" + parseInt(i+0) +"\" />"+ table[i].innerHTML +"</label></li>"
	};
	
// <!-- 让复选框停止事件传播 -->
$("ul.dropdown-menu").on("click","[data-stopPropagation]",function(e){
	e.stopPropagation();
});
	
$("#Ul-menu-text").html(menu_text);
	var selectTreeId="";
	var selectName="";
	var treeSetting = {
		async : {
			url : web_url+"AppUserInfo/UserCarList",
			type : "post",
			enable : true,
			autoParam :['Code'],
			dataType : "json",
			
			dataFilter: ajaxDataFilter
		},
		view : {
			selectedMulti : false,
			nameIsHTML: true,
			dblClickExpand: false
		},
		check : {
				enable : true,
				chkStyle : "checkbox",
				autoCheckTrigger: true
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
			}
		},
		callback : {
			beforeClick:beforeClick,
			onClick : zTreeOnClick,
			onCheck:zTreeOnClick
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
	
function beforeClick(treeId,treeNode,clickFlag){
	var node=$.fn.zTree.getZTreeObj("addyou");
	node.checkNode(treeNode,!treeNode.checked,treeNode,true);
	return false;
}
/**
 * 点击节点
 */
function zTreeOnClick(event, treeId, treeNode) {
	var zTree = $.fn.zTree.getZTreeObj("addyou");
            nodes = zTree.getCheckedNodes(true);	//获得选中的节点数据
            v = "";	
            t = "";
            for (var i=0, l=nodes.length; i<l; i++) {
            	if (nodes[i].GroupFlag == "assignment") { // 选择的是分组，才组装值
            		if (nodes[i].Code, nodes[i].Name) {
		                t += nodes[i].Name + ",";
		                v += nodes[i].Name+",";
            		} else {
            			nodes[i].checked = false;
            			amtNames += nodes[i].Name + ",";
            		}
            	}
            }
        
            if (v.length > 0) v = v.substring(0, v.length-1);	//去掉多余的逗号
            if (t.length > 0) t = t.substring(0, t.length-1);  
           	var cityObj = $("#CarNosName");
            cityObj.attr("value", t);
			//赋值
            $("#CarNos").val(v);


};
//时间
var today=new Date();
var tYear = today.getFullYear();//当年
var tMonth = (parseInt(today.getMonth()+1) < 10 ? "0" + parseInt(today.getMonth()+1) : parseInt(today.getMonth()+1)) ;//当月
var tDate =(today.getDate() < 10 ? "0" + today.getDate():today.getDate());//当日

//起始时间 and 结束时间
var startTime="",endTime="";

//今天
function nowDay(){
	$("#StartDate").val(tYear+"-"+tMonth+"-"+tDate + " "+"00:00:00");
	$("#EndDate").val(tYear+"-"+tMonth+"-"+tDate +" "+"23:59:59");
}

//设置前一天，前三天，前七天时间
function StartDay(day){
	var startValue = $("#StartDate").val();
    var endValue = $("#EndDate").val();
    if(startValue==""||endValue==""){
    	var today=new Date();
    	var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
        today.setTime(targetday_milliseconds); //关键代码
        var tYear = today.getFullYear();
        var tMonth = today.getMonth();
        var tDate = today.getDate();
        tMonth = doHandleMonth(tMonth + 1);
        tDate = doHandleMonth(tDate);
		var num=-1;
        startTime = tYear + "-" + tMonth + "-" + tDate + " " + "00:00:00";
        today.setTime(targetday_milliseconds); //关键代码	利用起始时间的原因是因为today已经被设置过了
        var endYear = today.getFullYear();
        var endMonth = today.getMonth();
        var endDate = today.getDate();
		console.log(endDate);
        endMonth =doHandleMonth(endMonth + 1);
        endDate = doHandleMonth(endDate);
        endTime = endYear + "-" + endMonth + "-" + endDate + " " + "23:59:59";
    }else{
    	var startTimeIndex = startValue.slice(0,10).replace("-","/").replace("-","/");
    	var vtoday_milliseconds = Date.parse(startTimeIndex) + 1000 * 60 * 60 * 24 * day;
	
    	var dateList = new Date();
    	dateList.setTime(vtoday_milliseconds);
    	var vYear = dateList.getFullYear();
        var vMonth = dateList.getMonth();
    	var vDate = dateList.getDate();
        vMonth = doHandleMonth(vMonth + 1);
        vDate = doHandleMonth(vDate);
        startTime = vYear + "-" + vMonth + "-" + vDate + " "+ "00:00:00";
			
        var endNum = -1;
		var vendtoday_milliseconds = Date.parse(startTimeIndex) + 1000 * 60 * 60 * 24 * day;
	
        var dateEnd = new Date();
        dateEnd.setTime(vendtoday_milliseconds);
        var vendYear = dateEnd.getFullYear();
        var vendMonth = dateEnd.getMonth();
        var vendDate = dateEnd.getDate();
        vendMonth = doHandleMonth(vendMonth + 1);
        vendDate = doHandleMonth(vendDate);
        endTime = vendYear + "-" + vendMonth + "-" + vendDate + " "+ "23:59:59";
    }
    $("#StartDate").val(startTime);
	$("#EndDate").val(endTime);
}
//日期
function doHandleMonth(month) {
    var m = month;
    if (month.toString().length == 1) {
        m = "0" + month;
    }
    return m;
}
//时间戳计算
function Time(time){
	return new Date(time); 
}
//显示当前时间
$(function(){
	  $("#StartDate").val(tYear+"-"+tMonth+"-"+tDate + " "+"00:00:00");
	  $("#EndDate").val(tYear+"-"+tMonth+"-"+tDate +" "+"23:59:59");
});
		//查询点击
function Query(){	
	BeginDateTime = $("#StartDate").val();	//起始时间
	EndDateTime = $("#EndDate").val();	//结束时间
	//车辆信息
	var StrData=$("#CarNos").val();
	var SplitStr=StrData.split(",");
	//车辆是否为空
	if(SplitStr.length==0){
		layer.alert("请选择至少一辆车");
		return false;
	}
	//时间为空判断
	if(BeginDateTime =='' || EndDateTime==''){
		layer.alert("起始时间或结束时间不能为空");
		return false;
	}
	
	//时间大小判断
	if(Time(EndDateTime).getTime() < Time(BeginDateTime).getTime()){
		layer.alert("结束时间不能小于起始时间");
		return false;
	}
	var TableData={
		"BeginDateTime":BeginDateTime,
		"EndDateTime":EndDateTime,
		"CarNos":SplitStr
	};
	SubmitAjax(History+"/OilStatis/OilTotalAnalsis",TableData,function(msg){
		if(msg.State==200){
			var res=msg.Result;
			if(res && res != null){
				var ObjRes=new Array();	//数据集
				console.log(res);
				for(var i=0;i<res.length;i++){
					
					Obj=['',res[i]['CarNo'],res[i]['WorkingThan'],res[i]['WorkingTime'],res[i]['WorkingDistance'],res[i]['WorkingOilExpendSum']]
					ObjRes.push(Obj);
				}
//				res[0]['WorkingThan']=12
//				res[1]['WorkingThan']=22
//				res[0]['WorkingTime']=2
//				res[1]['WorkingTime']=3
//				res[0]['WorkingDistance']=45
//				res[1]['WorkingDistance']=60
				//报表生成
				chartsAddyou(res);
				if(DataTableThtj){
					DataTableThtj.destroy();
				}
				getTable('#yhtjbb',ObjRes,true,true,true,true);	//获取表格
			}
		}else{
			layer.alert(msg.Error);
			return false;
		}
	});
}
		
//报表
var chartsAddyou=function(param){

	//报表
	var Carno=new Array();       //车牌号
	var WorkingThan=new Array();   //行车百分比
	var WorkingTime=new Array();   //行车时间
	var WorkingDistance=new Array();   //行车距离
	var WorkingOilExpendSum=new Array();   //行车油耗
	for(var i=0;i<param.length;i++){
		Carno.push(param[i]['CarNo']);	//车辆信息
		WorkingThan.push(param[i]['WorkingThan']);	//行车百分比
		WorkingTime.push(parseInt(param[i]['WorkingTime']));	 //行车时间
		WorkingDistance.push(param[i]['WorkingDistance']);	 //行车距离
		WorkingOilExpendSum.push(param[i]['WorkingOilExpendSum']);	 //行车油耗
			
	}
	var ser=[
				{
					"name":"行车百分比",
					"data":WorkingThan,
				},
				{
					"name":"行车时间",
					"data":WorkingTime,
				},
				{
					"name":"行车距离",
					"data":WorkingDistance,
				},
				{
					"name":"行车油耗",
					"data":WorkingOilExpendSum,
				}
			];
	var params={
		"SubTitle":"绵阳世平科技有限公司",
		"Title":"",
		"X":Carno,
		"Y":"",
		"series":ser
	}
	chartsTotal("#sjcontainer",params);
};
//报表
		

//获得表格
var getTable=function(Table,data,IsRow,page,info,lengthChange){
	//表格数据
	DataTableThtj=$(Table).DataTable({
	"data": data,
	 "language" : {
			"search" : "搜索:",
			"processing" : "处理中...",
			"loadingRecords" : "加载中...",
			"lengthMenu" : "每页 _MENU_ 条记录",
			"info" : "第 _START_ 至 _END_ 条记录，共 _TOTAL_  条",
			"infoEmpty" : "无记录",
			"infoFiltered" : "(从 _TOTAL_ 条记录中过滤)",
			"emptyTable" : "没有数据可以展示",
			"zeroRecords" : "没有数据可以展示",
			"paginate" : {
				"first" : "首页",
				"previous" : "上一页",
				"next" : "下一页",
				"last" : "末页"
			}
		},
		"dom" : "t" + "<'row'<'col-md-3 col-sm-12 col-xs-12'l><'col-md-4 col-sm-12 col-xs-12'i><'col-md-5 col-sm-12 col-xs-12'p>>",
		 "scrollX": "auto",
		 "ScrollXInner":"110%",
		"bAutoWidth": true,  //是否自适应宽度
		"AutoWidth": true,  //是否自适应宽度
		'bScrollCollapse':true,
		 "scrollY":"500px",
		 "searching" : true, // 搜索
		 "bFilter":true,
		// 分页相关
		"paging" :page,
	 //   "pagingType" : "full_numbers", // 分页样式
		"lengthChange" : lengthChange,// 切换每页数据大小
		"info" : info,
		"pageLength" : 10, // 默认每页数据量
		"lengthMenu" : [ 10, 20, 50, 100, 200 ],
		"ordering" : false, // 禁用排序
		// 服务端
		"processing" : "正在加载数据",
		"serverSide" : false,
		//多语言配置
	   // set the initial value
	   
	  "fnCreatedRow": function(nRow, aData, iDataIndex) {
		  	if(IsRow){
				$('td:eq(0)', nRow).html("<span class='row-details row-details-close' id='Status"+aData[1]+"' data_id='" + aData[1] + "'></span>&nbsp;" + aData[0]);
			}
        }
	});
}

var TableObj;	
//子集
var getTableSon=function(Table,data,IsRowpage,info,lengthChange){
//表格数据
	if(TableObj && TableObj.context.length>0 && TableObj.context !="undefined" ){
		TableObj.destroy();		//销毁当前行上所生成的数据
	}
	Table=Table.replace("#","");
	TableObj=Table+carnos;		//不重复更新表格,指定当前行下面的子集更新
	TableObj=$("#"+Table).DataTable({
	"data": data,
	 "language" : {
			"search" : "搜索:",
			"processing" : "处理中...",
			"loadingRecords" : "加载中...",
			"lengthMenu" : "每页 _MENU_ 条记录",
			"info" : "第 _START_ 至 _END_ 条记录，共 _TOTAL_  条",
			"infoEmpty" : "无记录",
			"infoFiltered" : "(从 _TOTAL_ 条记录中过滤)",
			"emptyTable" : "没有数据可以展示",
			"zeroRecords" : "没有数据可以展示",
			"paginate" : {
				"first" : "首页",
				"previous" : "上一页",
				"next" : "下一页",
				"last" : "末页"
			}
		},
		"dom" : "t" + "<'row'<'col-md-3 col-sm-12 col-xs-12'l><'col-md-4 col-sm-12 col-xs-12'i><'col-md-5 col-sm-12 col-xs-12'p>>",
		 "scrollX": "auto",
		 "ScrollXInner":"110%",
		"bAutoWidth": true,  //是否自适应宽度
		"AutoWidth": true,  //是否自适应宽度
		'bScrollCollapse':true,
		 "scrollY":"500px",
		 "searching" : true, // 搜索
		 "bFilter":true,
		// 分页相关
		"paging" :page,
	 //   "pagingType" : "full_numbers", // 分页样式
		"lengthChange" : lengthChange,// 切换每页数据大小
		"info" : info,
		"pageLength" : 10, // 默认每页数据量
		"lengthMenu" : [ 10, 20, 50, 100, 200 ],
		"ordering" : false, // 禁用排序
		// 服务端
		"processing" : "正在加载数据",
		"serverSide" : false,
		"fnCreatedRow": function(nRow, aData, iDataIndex) {
		  if(IsRow){
				$('td:eq(0)', nRow).html("<span class='row-details row-details-close' data_id='" + aData[1] + "'></span>&nbsp;" + aData[0]);
			}
		}
	});
}
//子集
var StatusCarNo="";
$('.table').on('click', 'tbody td .row-details',function() {
    var DefaultStatus=false;
    var tr = $(this).closest('tr');
	var row =DataTableThtj.row( tr );
	var RowData=row.data();
	
	carnos=RowData[1];
	StatusCarNo=sessionStorage.getItem("StatusCar");
  	if(StatusCarNo !=''){
  		if($('#Status'+StatusCarNo).hasClass("row-details-open") && StatusCarNo != RowData[1] ){
  			var NodesEle=$('#Status'+StatusCarNo).parent().parent();
  			$('#Status'+StatusCarNo).addClass("row-details-close").removeClass("row-details-open");
  			NodesEle.next().hide();
  		}
  		
  	}
    if ($(this).hasClass("row-details-open")) //判断是否已打开
    {
	   row.child.hide();
	   /* This row is already open - close it */
	   $(this).addClass("row-details-close").removeClass("row-details-open");
    } else {
	   /* Open this row */
	   
	   row.child( format(RowData[1]) ).show();
	   
	   sessionStorage.setItem("StatusCar",RowData[1]);
	   
	   $(this).addClass("row-details-open").removeClass("row-details-close");
		
		var SubmitData={
				"BeginDateTime":BeginDateTime,
				"EndDateTime":EndDateTime,
				"CarNo":RowData[1]
			};
			if(!DefaultStatus){
				ChildData(SubmitData,"#sigleCarRun"+RowData[1]+"Table",'#sigleCarRun'+RowData[1]+'',"/OilStatis/CarWorkingOilStatisResult");	//默认请求
				DefaultStatus=true;
			}
			
		//生成相应的数据表格,tab切换之前请求数据
		$('#myTab a[data-toggle="tab"]').on('show.bs.tab', function(e) {
			e.target // 激活的标签页
			e.relatedTarget // 前一个激活的标签页
			
			var RequestUrl=$(this).attr("data-RequestUrl");	//请求的url
		
			var $Id=$(this).attr("href")+"Table";	//表格id
			var field=$(this).attr("href");	//字段名称

			ChildData(SubmitData,$Id,field,RequestUrl);	
			
		});

    }
});

// 子级表格数据请求
ChildData=function(SubmitData,id,field,RequestUrl){
	SubmitAjax(History+RequestUrl,SubmitData,function(msg){
		if(msg.State==200){
			var sigleCarRunArr=new Array();
			var res=msg.Result;
			console.log(res);
			//单车行驶
//			if(!isNaN(res.length) && res.length>0){
			for (var i=0;i<res.length;i++) {
					var sigleCarRun=[res[i]['beginDateTime'],res[i]['endDateTime'],res[i]['WorkingTime'],res[i]['Distance'],res[i]['Oil'],res[i]['Posinfo']];
					sigleCarRunArr.push(sigleCarRun);
					}
			}
//		else{
//				var sigleCarRun=[res['beginDateTime'],res['endDateTime'],res['WorkingTime'],res['BeginDis'],res['EndDis'],res['Distance'],res['Oil'],res['Posinfo']];
//				sigleCarRunArr.push(sigleCarRun);
//			}
//			var sigleCarRun=[res['beginDateTime'],res['endDateTime'],res['WorkingTime'],res['BeginDis'],res['EndDis'],res['Distance'],res['Oil'],res['Posinfo']];
			if(res){
				if(!isNaN(res.length)&&res.length<=0){
					return;
				}
				var objRes=new Array();	//数据集
				if(field==''){
					return false 
				}else{
					if(field="#sigleCarRun"+carnos+""){
//						case "#sigleCarRun"+carnos+"":
							objRes.push(sigleCarRunArr);
//							objRes.push(sigleCarRun);
//						break;
//						default:
//							return false;
					}else{
						return;
					}
				}
				if(DataTableSon){
					DataTableSon.destroy();
				}
//				if(objRes.length>0 && objRes[0][0].constructor==Array){
					for (var a=0;a<objRes.length;a++) {
						getTableSon(id,objRes[a],false,false,false,false);	//获取表格
					}
//				}else{

//					getTableSon(id,objRes,false,false,false,false);	//获取表格
//				}
//					getTableSon(id,objRes,false,false,false,false);	//获取表格
				
		}else{
			layer.alert(msg.Error);
			return false;
		}
	});
}

function showMenu(){
    var contr=$("#zTreeContent");
    contr.toggle();
}
//验证

//数据格式化
//function format ( d ) {
//  
//  return '<ul id="myTab" class="nav nav-tabs">'+
//				'<li class="active">'+
//					'<a id="DefaultsigleCarRun" href="#sigleCarRun'+ d +'" data-RequestUrl="/OilStatis/CarWorkingOilStatisResult"   data-toggle="tab">单车行驶</a>'+
//				'</li>'+
//			'</ul>'+
//			'<div id="myTabContent" class="tab-content">'+
////单车行驶			
//				'<div class="tab-pane fade in active" id="sigleCarRun'+ d +'">'+
//					'<table id="sigleCarRun'+d+'Table" class="table table-striped table-bordered table-hover table-full-width" cellspacing=" style="text-align: center;">'+
//						'<thead style="border:white">'+
//							'<th style="min-width:120px">开始时间</th>'+
//							'<th style="min-width:120px">结束时间</th>'+
//							'<th style="min-width:100px">持续时间</th>'+
//							'<th style="min-width:50px">里程</th>'+
//							'<th style="min-width:50px">消耗</th>'+
//							'<th style="min-width:320px">地图查看</th>'+
//						'</thead>'+
//					'</table>'+
//				'</div>'+
//			'</div>'
//}
