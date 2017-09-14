var lin=$("#lin").val();
var key=$("#key").val();
// 显示隐藏列
var menu_text = "";
var table = $("#clgl tr th:gt(2)");
menu_text += "<li data-stopPropagation=\"true\"><label><input type=\"checkbox\" checked=\"checked\" class=\"toggle-vis lan-checkbox\" data-column=\"" + parseInt(3) +"\" disabled />"+ table[0].innerHTML +"</label></li>"
for(var i = 1; i < table.length; i++){
    menu_text += "<li data-stopPropagation=\"true\"><label><input type=\"checkbox\" checked=\"checked\" class=\"toggle-vis lan-checkbox\" data-column=\"" + parseInt(i+3) +"\" />"+ table[i].innerHTML +"</label></li>"
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
				url : web_url+"CarGroup/GroupsInfo",
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
			view : {
				selectedMulti : false,
				nameIsHTML: true 
			},
			data : {
				simpleData : {
					enable : true,
					idKey:"Code",
					pIdKey:"ParentCode",
					rootPId:"null"
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
				onClick : zTreeOnClick
			}
		};
//组织树预处理函数
	function ajaxDataFilter(treeId, parentNode, responseData) {
	    var treeObj = $.fn.zTree.getZTreeObj("ClgltreeDemo");
	    if (responseData.Result) {
	        for (var i = 0; i < responseData.Result.length; i++) {
	                responseData.Result[i]['type']="group";
	        }
	    }
	    return responseData.Result;
	};
		/**
	 * 点击节点 
	 */
	function zTreeOnClick(event, treeId, treeNode) {
		//console.log(treeId);
		
		if(treeId=="ClgltreeDemo"){
			$('#simpleQueryParam').val("");
			selectTreeId = treeNode.Code;
			myTable.filter();
		}
		if(treeId=="clgladdztreeDemo"){
			
			selectName=treeNode.Name;
			var id=$("#GroupCode").val(treeNode.Code);
			var name=$("#GroupName").val(selectName);
			if($("#GroupName").hasClass("error")){
					$("#GroupName").toggleClass("error").toggleClass("valid");
					$("#GroupName").siblings(".error").toggle();
			}
			
			showMenu();
		}
		

	};
	
		//ajax参数
	var ajaxDataParamFun = function(d) {
		d.simpleQueryParam = $('#simpleQueryParam').val(); //模糊查询
		d.groupId = selectTreeId;
		var field=$("#field").val();
			if(field=='CarNo'){
					d.CarNo=d.simpleQueryParam;
			}else if(field=='CarNoSigle'){
				d.CarNoSigle=d.simpleQueryParam;
			}		
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
		{"data":"Id","targets":1,"visible":false},
		{
			"data" : null,
			"class" : "text-center",
			render : function(data, type, row, meta) {
			//console.log(data);
				var result = '';
				result += '<input  type="checkbox" name="subChk" class="lan-checkbox"  value="' + row.CarNo + '" />';
				return result;
			}
		},
		{
			"data" : null,
			"class" : "text-center", //最后一列，操作按钮
			render : function(data, type, row, meta) {
				var editUrlPath =wear+"Clgl/Edit";//+"/edit/"+ row.Code+".html"; //修改地址
				var result = '';
			
				result += '<button  href="#" onclick="showModal(\'edit\',\''+row.Id+'\')" data-target="#" data-toggle="modal"  type="button" class="editBtn editBtn-info"><i class="fa fa-pencil"></i>修改</button>&nbsp;';
				
				//删除按钮
				result += '<button type="button" onclick="del(\''
						+ row.CarNo
						+ '\')" class="deleteButton editBtn disableClick"><i class="fa fa-trash-o"></i>删除</button>';
				return result;
			}
		},
		{
			"data":"CarNo",
			"class":"text-center"
		},
		{
			"data" : "Manufacturer",
			"class" : "text-center"
		},
		{
			"data" : "EngineNo",
			"class" : "text-center",
		},
		{
			"data" : "GroupCode",
			"class" : "text-center"
		},
		{
			"data" : "GroupName",
			"class" : "text-center"
		},
		{
			"data" : "MachineClass",
			"class" : "text-center",
			render : function(data, type, row, meta) {
				if(data=="EngineCar"){
						return "工程车";
				}else if(data=="TransportCar"){
					return "运输车";
					
				}else{
					
					return "";
				}
				
				
			}
			
		},
		{
			"data" : "IdentificatioNum",
			"class" : "text-center"
		},
		{
			"data" : "CarType",
			"class" : "text-center"
		},
		{
			"data":"Brand",
			"class":"text-center"
		},
		{
			"data" : "Model",
			"class" : "text-center"
		},
		{
			"data" : "FuelTankVol",
			"class" : "text-center",
		},
		{
			"data" : "CarAge",
			"class" : "text-center"
		},
		{
			"data" : "DeadWeight",
			"class" : "text-center"
		},
		{
			"data" : "LoadWeight",
			"class" : "text-center"
		},
		{
			"data" : "Length",
			"class" : "text-center"
		},
		{
			"data" : "Width",
			"class" : "text-center"
		}
		,
		{
			"data" : "Height",
			"class" : "text-center"
		},
		{
			"data" : "WorkHeight",
			"class" : "text-center"
		}
		];

	//表格setting
	var setting = {
		listUrl :wear+"Clgl/list_info",
		editUrl : web_url+"CarGroup/UpdateGroup",
		deleteUrl : web_url+"CarInfo/DelCarInfo",
		deletemoreUrl : web_url+"CarInfo/DelCarInfoList",
		//enableUrl : "/clbs/c/user/enable_",
		//disableUrl : "/clbs/c/user/disable_",
		columnDefs : columnDefs, //表格列定义
		columns : columns, //表格列
		dataTableDiv : 'clgl', //表格
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
			'CarNos' : checkedList
		});
	});
	
	function del(id){
			myTable.deleteItem({
				'Lic':lin,
				'LicKey':key,
				'CarNo':id
				});
	}
	// 查询全部 
	$('#queryAll').click(function() {
		selectTreeId = "";
		$('#simpleQueryParam').val("");
		var zTree = $.fn.zTree.getZTreeObj("ClgltreeDemo");
		zTree.selectNode("");
		myTable.filter();
	});
		//search
	$('#search_button').click(function() {
		selectTreeId = "";
		
		var zTree = $.fn.zTree.getZTreeObj("ClgltreeDemo");
		zTree.selectNode("");
		// $('#simpleQueryParam').val("");
		myTable.filter();
		
	});
	//加载完成后执行
	$(function() {
		//表格初始化
		myTable.init();
		$.fn.zTree.init($("#ClgltreeDemo"), treeSetting);
		// myTable.clickRow("clgl");
		
	});

//组织结构模糊搜索
$("#search_condition").on("input oninput",function(){
		search_ztree('ClgltreeDemo','search_condition','group');
});
//组织结构模糊搜索
$("#search_add_condition").on("input oninput",function(){
		search_ztree('clgladdztreeDemo','search_add_condition','group');
});
	
	


	
	
	//modal
	var windowId = "commonWin";
            
            $("#" + windowId).on("hidden.bs.modal", function() {
                $(this).removeData("modal");
            });
			var showModal=function(meth,id){
	
				if(meth=='add'){
					var remote=wear+"Clgl/Add";
				}else{
					var remote=wear+"Clgl/Edit?update_code="+id;
					
				}
				
				
				if(remote!==''){
					$("#"+windowId).load(remote,function(){
						
						$("#"+windowId).modal("show");
					
					});
				}
			}
			
	function showMenu(){
		var contr=$("#zTreeContent");
		contr.toggle();
	}
	//验证
	
	
	
	//字典请求
	function data(dataUrl,nodeId,TypeName){
		
		 $.ajax({  
				  url: web_url+dataUrl,  
				  type: 'POST',
				  async:false,
				  data: "TypeName="+ TypeName +"",
				  beforeSend: function(Request){			//发送头部信息
						Request.setRequestHeader("AccessToken",""+ AccessToken +"");
				   },
				  success: function (res) {  
						if(res['State']==200){
							node=res['Result'];
							var selected="";		//设定状态
							var rslValue=$("#"+ nodeId +"Input").val();	//获取修改值
							for(i=0;i<node.length;i++){
								if(node[i]['Value']==rslValue){
									selected="selected";
								}else{
									selected='';
								}
								var str="<option value="+ node[i]['Value']+" "+ selected +" >"+ node[i]['Name'] +"</option>";
								$("#"+ nodeId +"").append(str);
							}
							
						}
				  },  
				  error: function (res) {  
					  return res; 
				  }  
			 }); 
	
	
	}
	
	
	