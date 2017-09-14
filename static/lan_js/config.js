var lin=$("#lin").val();
var key=$("#key").val();
// 显示隐藏列
var menu_text = "";
var table = $("#comp tr th:gt(2)");
menu_text += "<li data-stopPropagation=\"true\"><label><input type=\"checkbox\" checked=\"checked\" class=\"toggle-vis lan-checkbox\" data-column=\"" + parseInt(2) +"\" disabled />"+ table[0].innerHTML +"</label></li>"
for(var i = 1; i < table.length; i++){
    menu_text += "<li data-stopPropagation=\"true\"><label><input type=\"checkbox\" checked=\"checked\" class=\"toggle-vis lan-checkbox\" data-column=\"" + parseInt(i+3) +"\" />"+ table[i].innerHTML +"</label></li>"
};
// <!-- 让复选框停止事件传播 -->
$("ul.dropdown-menu").on("click","[data-stopPropagation]",function(e){
	e.stopPropagation();
});

$("#Ul-menu-text").html(menu_text);
var selectTreeId="";
$("ul.dropdown-menu").on("click","[data-stopPropagation]",function(e){
	e.stopPropagation();
});

$("#Ul-menu-text").html(menu_text);

		var selectName="";
		var treeSetting = {
			async : {
				url : web_url+"CarGroup/FleetGroupsInfo",
				type : "post",
				enable : true,
				autoParam :['Code'],
				dataType : "json",
				otherParam : {
					"Lic" : lin,
					"LicKey":key
				},
				dataFilter: ajaxDataFilter
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
			view : {
				selectedMulti : false,
				nameIsHTML: true,
				dblClickExpand: false
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
				}
			},
			
			callback : {
				beforeClick:beforeClick,
				onClick : zTreeOnClick,
				onCheck:zTreeOnClick,
				onAsyncSuccess:onAsyncSuccess
			}
		};
//组织树预处理函数
	function ajaxDataFilter(treeId, parentNode, responseData) {
		
		var nodes=responseData.Result;	//数据结果集	
		
		var ArrData=[];		//空数组
		
	    if (nodes) {
	        for (var i = 0; i < nodes.length; i++) {
				var EmpoyeeList=nodes[i]['Fleets'];
					
					//判断长度为0的跳过
					if(EmpoyeeList){
						//循环获取数据
						for(var b=0;b<EmpoyeeList.length;b++){
					
							EmpoyeeList[b]['ParentCode']=nodes[i]['Code'];	//添加一个父级
							if(EmpoyeeList[b]['ParentCode']==EmpoyeeList[b]['Code']){
								EmpoyeeList[b]['Code']=EmpoyeeList[b]['Code']+"spkj";
							}
							EmpoyeeList[b]['iconSkin']="assignmentSkin";	//分组类名
							EmpoyeeList[b]['GroupFlag']="assignment";	//分组标记，用于选择时只能选择分组，而不能选择企业
							EmpoyeeList[b]['type']="group";		//用于搜索时的标记
							ArrData.push(EmpoyeeList[b]);//压入子节点
						}
					}
					
					
					nodes[i]['type']="group";		//用于搜索时的标记
					nodes[i].open=true;
					ArrData.push(nodes[i]);
	        }
	    }

	    return ArrData;
	
	};
	
	/*
	*FUNCTION 异步加载成功
	*author 兰子奇
	*/
	
	function onAsyncSuccess(event,treeId,treeNode,msg){
		//获取后台返回的值
			var Code=$("#FeetGroupsName").val();
			Code=Code.split(",");
			
				//默认选中
			var Tree = $.fn.zTree.getZTreeObj("Config");
			
			//循环获取数据
			for(var kk=0;kk<Code.length;kk++){
			
					 var nodes=Tree.getNodesByParam("Name", Code[kk], null);	//根据Name获取相应的数据
					 for(var vv=0; vv<nodes.length;vv++){
				
						Tree.checkNode(nodes[vv],true,true);
						
					 }
					 
				}
			
	}
	
	/*
	*	点击节点之前
	*/
	function beforeClick(treeId,treeNode,clickFlag){
	
		var zTree = $.fn.zTree.getZTreeObj("Config");
			//点击节点选中
			zTree.checkNode(treeNode, !treeNode.checked, treeNode, true);
			return false;
	}
		
		/**
	 * 点击节点 
	 */
	function zTreeOnClick(event, treeId, treeNode) {
	
		
			var zTree = $.fn.zTree.getZTreeObj("Config");
            nodes = zTree.getCheckedNodes(true);	//获得选中的节点数据
            v = "";	
            t = "";
            nodes.sort(function compare(a,b){return a.Id-b.Id;});	//排序
            
            
            for (var i=0, l=nodes.length; i<l; i++) {
            	if (nodes[i].GroupFlag == "assignment") { // 选择的是分组，才组装值
            		if (nodes[i].Code, nodes[i].Name) {
						
						var reg=/[spkj]/;	//用于重复时添加的spkj并且进行替换
						if(nodes[i].Code.match(reg)){
							nodes[i].Code=nodes[i].Code.replace(/spkj/ig, '');	//替换
						}
		                t += nodes[i].Name + ",";
		                v += nodes[i].Code+",";
						
            		} else {
            			nodes[i].checked = false;
            			amtNames += nodes[i].Name + ",";
            		}
            	}
            }
        
            if (v.length > 0) v = v.substring(0, v.length-1);	//去掉多余的逗号
            if (t.length > 0) t = t.substring(0, t.length-1);  
           	var cityObj = $("#FeetGroupsName");
            cityObj.attr("value", t);
			//赋值
            $("#FeetGroups").val(v);
			//如果有为空的提示，那么当赋值成功后，错误消失
			if($("#FeetGroupsName").hasClass("error")){
			
					$("#FeetGroupsName").toggleClass("error").toggleClass("valid");
					$("#FeetGroupsName").siblings(".error").toggle();
			}
		

	};
	
		//ajax参数
	var ajaxDataParamFun = function(d) {
		d.simpleQueryParam = $('#simpleQueryParam').val(); //模糊查询
		d.groupId=selectTreeId;
	};

	//表格
	var myTable;
	//表格列定义
	var columnDefs = [ {
		//第一列，用来显示序号
		"searchable" : false,
		"orderable" : false,
		"targets" : 0
	},{"targets":1,"visible":false}];
	var columns = [
		{"data":null},
		{"data":"Id","target":1,"visible":false},
		{
			"data" : null,
			"class" : "text-center",
			render : function(data, type, row, meta) {

				var result = '';
				result += '<input  type="checkbox" name="subChk" class="lan-checkbox"  value="' + row.Id + '" />';
				return result;
			}
		},
		{
			"data" : null,
			"class" : "text-center", //最后一列，操作按钮
			render : function(data, type, row, meta) {
				
				var detailUrlPath =wear+"Config/Edit.html?update_code="+row.Id;//+"/edit/"+ 
				var result ='';
			
				result += '<button  href="#" onclick="showModal(\'edit\',\''+ row.Id +'\')"  data-target="#" data-toggle="modal"  type="button" class="editBtn editBtn-info"><i class="fa fa-pencil"></i>修改</button>&nbsp;';
				//删除按钮
				result += '<button type="button" onclick="del(\''
						+ row.Id
						+ '\')" class="deleteButton editBtn disableClick"><i class="fa fa-trash-o"></i>删除</button>';
				return result;
			}
		},
		{
			"data" : "CarNo",
			"class" : "text-center"
		},
		{
			"data" : "Sim",
			"class" : "text-center",
		},
		{
			"data" : "TerminalCode",
			"class" : "text-center"
		},
		{
			"data":"FleetGroupNames",
			"class":"text-center"
		},
		{
			"data" : "InstallPersonCode",
			"class" : "text-center"
		},
		{
			"data" : "IsGravity",
			"class" : "text-center",
			render:function(data, type, row, meta){
				if(data==1){
					return "是";
				}else{
					return "否";
				}
			}
		},
		{
			"data" : "GravitySensorCode",
			"class" : "text-center"
		},
		{
			"data" : "IsPressure",
			"class" : "text-center",
			render:function(data, type, row, meta){
				if(data==1){
					return "是";
				}else{
					return "否";
				}
			}
		},
		{
			"data" : "PressureSensorCode",
			"class" : "text-center"
		},
		{
			"data" : "OilSensorCode",
			"class" : "text-center"
		},
		{
			"data" : "IsOpen",
			"class" : "text-center",
			render:function(data, type, row, meta){
				if(data==1){
					return "是";
				}else{
					return "否";
				}
			}
		},
		{
			"data" : "PressureWorkThreshold",
			"class" : "text-center"
		},
		{
			"data" : "ExceptionTimeThreshold",
			"class" : "text-center"
		},
		{
			"data" : "WorkTimesThresholdValue",
			"class" : "text-center"
		},
		
		{
			"data" : "GravityWorkThreshold",
			"class" : "text-center"
		},
		{
			"data" : "IsOilSensor",
			"class" : "text-center",
			render:function(data, type, row, meta){
				if(data==1){
					return "是";
				}else{
					return "否";
				}
			}
		},
		{
			"data":"Remark",
			"class":"text-center"
			
		}
		];

	//表格setting
	var setting = {
		listUrl :wear+"Config/list_info",
		editUrl : web_url+"AppTermial/UpdateCarConfig",
		deleteUrl : web_url+"AppTermial/DeleteCarConfig",
		deletemoreUrl : web_url+"AppTermial/DeleteCarConfigs",
		columnDefs : columnDefs, //表格列定义
		columns : columns, //表格列
		dataTableDiv : 'comp', //表格
		ajaxDataParamFun : ajaxDataParamFun, //ajax参数
		pageable : true, //是否分页
		showIndexColumn : true, //是否显示第一列的索引列
		enabledChange : true
	};
	
	
	//全选
	$("#checkAll").click(function() {
		$("input[name='subChk']").prop("checked", this.checked);
	});
	//单选
	var subChk = $("input[name='subChk']");
	subChk.click(function() {
		$("#checkAll").prop(
				"checked",
				subChk.length == subChk.filter(":checked").length ? true
						: false);
	});
	//创建表格
	myTable = new TG_Tabel.createNew(setting);
	//批量删除
	$("#del_model").click(function() {
		//判断是否至少选择一项
		var chechedNum = $("input[name='subChk']:checked").length;
		if (chechedNum == 0) {
			layer.alert("至少选择一项！");
			return

		}
		var checkedList = new Array();
		$("input[name='subChk']:checked").each(function() {
		
			checkedList.push($(this).val());
		});
		myTable.deleteItems({
			'Lic':lin,
			'LicKey':key,
			'Ids' : checkedList
		});
	});
	
	function del(id){
		myTable.deleteItem({
			'Lic':lin,
			'LicKey':key,
			'Id':id
			});
	}
	// 查询全部 
	$('#queryAll').click(function() {
		selectTreeId = "";
		$('#simpleQueryParam').val("");
		myTable.filter();
	});
	//search
	$('#search_button').click(function() {
		myTable.filter();
		$('#simpleQueryParam').val("");
	});
	//加载完成后执行
	$(function() {
		//表格初始化
		myTable.init();
		// $.fn.zTree.init($("#ztreeDemo"),treeSetting );
	});
	
	
	//modal
	var windowId = "commonWin";
            
            $("#" + windowId).on("hidden.bs.modal", function() {
                $(this).removeData("modal");
            });
			var showModal=function(meth,id){
				//获取大类数据
				if(meth=='add'){
					var remote=wear+"Config/Add";
			
				}else{
					
					var remote=wear+"Config/Edit.html?update_code="+id;
					
				}
				
				
				if(remote!==''){
					$("#"+windowId).load(remote,function(){
					
						$("#"+windowId).modal("show");
					
					});
				}
			}
			
	function showMenu(id){
		var contr=$(id);
		contr.addClass(""+id+"");
		$(".ztreeModelBox").each(function(k,v){
			
			if($(v).hasClass(id)){
				contr.toggle();
			}else{
				$(v).hide();
			}
		});
	}
	
	function showMenu2(){
		var contr=$("#zTreeContent");
		contr.toggle();
	}
	//验证