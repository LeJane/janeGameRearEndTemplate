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
			url : web_url+"CarGroup/GroupCarsInfo",
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
				chkboxType : {
					"Y" : "s",
					"N" : "s"
				},
				radioType : "all"
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
			beforeClick:beforeClick,
			onClick : zTreeOnClick,
			onCheck:zTreeOnClick
		}
	};
	//组织树预处理函数
	function ajaxDataFilter(treeId, parentNode, responseData) {
		var nodes=responseData.Result;
		var ArrData=[];
		if (nodes) {
			for (var i = 0; i < nodes.length; i++) {
				nodes[i]['ParentCode']="";
				var CarNos=nodes[i]['CarNos'];
				for(var b=0;b<CarNos.length;b++){
					CarNos[b]['ParentCode']=nodes[i]['Code'];
					CarNos[b]['iconSkin']="assignmentSkin";	//分组类名
					CarNos[b]['GroupFlag']="assignment";	//分组标记，用于选择时只能选择分组，而不能选择企业
					CarNos[b]['type']="group";		//用于搜索时的标记
					ArrData.push(CarNos[b]); //压入子节点
				}
				nodes[i]['type']="group";
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
            // nodes.sort(function compare(a,b){return a.Id-b.Id;});	//排序
            
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

  var today = new Date();
  
  var tYear = today.getFullYear();	//当年
  
  var tMonth = (parseInt(today.getMonth()+1) < 10 ? "0" + parseInt(today.getMonth()+1) : parseInt(today.getMonth()+1)) ;	//当月
  
  var tDate =(today.getDate() < 10 ? "0" + today.getDate():today.getDate());		//当日
	
		
		//起始时间 and 结束时间
		var startTime="",endTime="";
		
		//今天
		function nowDay(){
			$("#StartDate").val(tYear+"-"+tMonth+"-"+tDate + " "+"00:00:00");
			$("#EndDate").val(tYear+"-"+tMonth+"-"+tDate +" "+"23:59:59");
		}
		
		//设置前一天，前三天，前七天时间
	   function StartDay(day) {
            var startValue = $("#StartDate").val();
            var endValue = $("#EndDate").val();
            if (startValue == "" || endValue == "") {
                var today = new Date();
                var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
                today.setTime(targetday_milliseconds); // 注意，这行是关键代码
                var tYear = today.getFullYear();
                var tMonth = today.getMonth();
                var tDate = today.getDate();
                tMonth = doHandleMonth(tMonth + 1);
                tDate = doHandleMonth(tDate);
                // var num = -(day + 1);
				var num=-1;
                startTime = tYear + "-" + tMonth + "-" + tDate + " " + "00:00:00";

				// var end_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
               // var end_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * parseInt(num);	
                today.setTime(targetday_milliseconds); // 注意，这行是关键代码		这里利用起始时间的原因是因为today已经被设置过了
                var endYear = today.getFullYear();
                var endMonth = today.getMonth();
                var endDate = today.getDate();
				console.log(endDate);
                endMonth =doHandleMonth(endMonth + 1);
                endDate = doHandleMonth(endDate);
                endTime = endYear + "-" + endMonth + "-" + endDate + " " + "23:59:59";
				
				
            } else {
            	var startTimeIndex = startValue.slice(0,10).replace("-","/").replace("-","/");
            	var vtoday_milliseconds = Date.parse(startTimeIndex) + 1000 * 60 * 60 * 24 * day;
			
            	var dateList = new Date();
            	dateList.setTime(vtoday_milliseconds);
            	var vYear = dateList.getFullYear();
                var vMonth = dateList.getMonth();
            	var vDate = dateList.getDate();
                vMonth = doHandleMonth(vMonth + 1);
                vDate = doHandleMonth(vDate);
                startTime = vYear + "-" + vMonth + "-" + vDate + " "
                    + "00:00:00";
					
                var endNum = -1;
				var vendtoday_milliseconds = Date.parse(startTimeIndex) + 1000 * 60 * 60 * 24 * day;
                //var vendtoday_milliseconds = Date.parse(startTimeIndex) + 1000 * 60 * 60 * 24 * parseInt(endNum);
			
                var dateEnd = new Date();
					
                dateEnd.setTime(vendtoday_milliseconds);
                var vendYear = dateEnd.getFullYear();
                var vendMonth = dateEnd.getMonth();
                var vendDate = dateEnd.getDate();
                vendMonth = doHandleMonth(vendMonth + 1);
                vendDate = doHandleMonth(vendDate);
                endTime = vendYear + "-" + vendMonth + "-" + vendDate + " "
                    + "23:59:59";
					
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
		
		//查询点击
		function Query(){
			
			var Car=$("#CarNos").val(); //获取车辆信息
			
			//车辆是否为空
			if(Car =='' || Car =="undefined"){
				layer.alert("请选择至少一辆车");
				return false;
			}
			
			var startValue = $("#StartDate").val();
			
            var endValue = $("#EndDate").val();
			
			//时间为空判断
			if(startValue =='' || endValue==''){
				layer.alert("起始时间或结束时间不能为空");
				return false;
			}
			
			//时间大小判断
			if(Time(endValue).getTime() < Time(startValue).getTime()){
				layer.alert("结束时间不能小于起始时间");
				return false;
			}
			
		}
		

		
		//油耗信息
		var Oil=[
['','川运98971','20','2017-1-31','2017-2-11','22','澳门'],
['','川运98972','120','2017-1-31','2017-2-11','22','澳门'],
['','川运98973','220','2017-1-31','2017-2-11','22','澳门'],
['','川运98974','240','2017-1-31','2017-2-11','22','澳门'],
['','川运98975','12','2017-1-31','2017-2-11','22','澳门'],
['','川运98976','2','2017-1-31','2017-2-11','22','澳门'],
];
		
		
		
		//表格数据
		var DataTable=$('#yhtjbb').DataTable({
		"data": Oil,
        // 语言
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
		'bScrollCollapse':true,
		 // "scrollY":"400px",
		 "searching" : true, // 搜索
		 "bFilter":true,
        // 分页相关
        "paging" : true,
     //   "pagingType" : "full_numbers", // 分页样式
        "lengthChange" : 10,// 切换每页数据大小
        "info" : false,
        "pageLength" : 10, // 默认每页数据量
        "lengthMenu" : [ 10, 20, 50, 100, 200 ],
        "ordering" : false, // 禁用排序
        // 服务端
        "processing" : "正在加载数据...",
        "serverSide" : false,
        // "ajax" : {
                // "url" : tg_table.listUrl,
                // "iDisplayLength":true,
                // "type" : "POST", // post方式请求
                // "data" : tg_table.ajaxDataParamFun,
                // "dataFilter": function(data){

                // var json = jQuery.parseJSON( data );
                // json.recordsTotal= json.recordsTotal;
                // json.recordsFiltered = json.recordsFiltered;
                // json.data = json.data;
                // return JSON.stringify( json ); // return JSON string
                // }

			// },
			// "columns": [
				// { "title": "CarNo" },
				// { "title": "AddOilSum" },
				// { "title": "AddOilTotal" },
				// { "title": "ExcetionalOilExpendSum", "class": "center" },
				// { "title": "ExcetionalOilExpendTotal", "class": "center" },
				// { "title": "WorkingOilExpendSum" },
				// { "title": "WorkingDistance" },
				// { "title": "IdleTime" },
				// { "title": "IdleOilExpendTotal", "class": "center" },
				// { "title": "StopTime", "class": "center" },
				// { "title": "HundredKilmeteOilExpend" },
				// { "title": "WorkingTime" },
				// { "title": "WorkingThan" },
				// { "title": "IdleThan", "class": "center" },
				// { "tsoe.itle": "StopThan", "class": "center" },
			// ]
			//多语言配置
           // set the initial value
           "fnCreatedRow": function(nRow, aData, iDataIndex) {
               $('td:eq(0)', nRow).html("<span class='row-details row-details-close' data_id='" + aData[1] + "'></span>&nbsp;" + aData[0]);
           }
			
       
        });
		$('.table').on('click', 'tbody td .row-details',
		   function() {
			   
			   var nTr = $(this).parents('tr')[0];
			   console.log(nTr);
			   
			    var tr = $(this).closest('tr');
				var row = DataTable.row( tr );
			   if ($(this).hasClass("row-details-open")) //判断是否已打开
			   {
				   row.child.hide();
				   /* This row is already open - close it */
				   $(this).addClass("row-details-close").removeClass("row-details-open");
			   } else {
				   /* Open this row */
				   row.child( format(row.data()) ).show();
				   $(this).addClass("row-details-open").removeClass("row-details-close");

			   }
		   });
			
		//表格数据
$(function(){
	  $("#StartDate").val(tYear+"-"+tMonth+"-"+tDate + " "+"00:00:00");
	  $("#EndDate").val(tYear+"-"+tMonth+"-"+tDate +" "+"23:59:59");
});


function showMenu(){
    var contr=$("#zTreeContent");
    contr.toggle();
}
//验证

























