var lin=$("#lin").val();
var key=$("#key").val();
// 显示隐藏列
var menu_text = "";
var table = $("#dep tr th:gt(3)");
menu_text += "<li data-stopPropagation=\"true\"><label><input type=\"checkbox\" checked=\"checked\" class=\"toggle-vis lan-checkbox\" data-column=\"" + parseInt(3) +"\" disabled />"+ table[0].innerHTML +"</label></li>"
for(var i = 1; i < table.length; i++){
    menu_text += "<li data-stopPropagation=\"true\"><label><input type=\"checkbox\" checked=\"checked\" class=\"toggle-vis lan-checkbox\" data-column=\"" + parseInt(i+4) +"\" />"+ table[i].innerHTML +"</label></li>"
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
		//	var lin=$("#lin").val();
		//var key=$("#key").val();
		var selectName="";
		var InstitutionCodeSetting = {
			async : {
				url : web_url+"InstitutionInfo/InstitutionsInfo",
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
					enable:true
				}
			},
			
			callback : {
				onClick : zTreeOnClick
			}
		};
		var ParentCodeSetting = {
			async : {
				url : web_url+"DepartmentInfo/DepartmentsInfo",
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

				}
			},
			
			callback : {
				onClick : zTreeOnClick
			}
		};
//组织树预处理函数
	function ajaxDataFilter(treeId, parentNode, responseData) {
	    //var treeObj = $.fn.zTree.getZTreeObj("compaddztreeDemo");
	    if (responseData.Result) {
	        for (var i = 0; i < responseData.Result.length; i++) {
					responseData.Result[i]['type']="group";
	                // responseData.Result[i].open = false;
	        }
	    }
	    return responseData.Result;
	};
		
		/**
	 * 点击节点 
	 */
	function zTreeOnClick(event, treeId, treeNode) {

		
		if(treeId=="depaddztreeDemo_ins_index"){
		selectTreeId = treeNode.Code;
		$('#simpleQueryParam').val("");
			myTable.filter();
		}
		if(treeId=="depaddztreeDemo_ins"){
	
			selectName=treeNode.Name;
			var id=$("#InstitutionCode").val(treeNode.Code);
			var name=$("#InstitutionName").val(selectName);
			if($("#InstitutionName").hasClass("error")){
				$("#InstitutionName").toggleClass("error").toggleClass("valid");
				$("#InstitutionName").siblings(".error").toggle();
			}
			showMenu2();
		}
		if(treeId=="depaddztreeDemo_parent"){
			
			selectName=treeNode.Name;
			var id=$("#ParentCode").val(treeNode.Code);
			var name=$("#GroupName").val(selectName);
			showMenu();
		}
		
		

	};
	
		//ajax参数
	var ajaxDataParamFun = function(d) {
			d.groupId=selectTreeId;
			d.simpleQueryParam =$('#simpleQueryParam').val(); //模糊查询
		
		
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
		{"data":"ParentCode","targets":2,"visible":false},
		{
			"data" : null,
			"class" : "text-center",
			render : function(data, type, row, meta) {

				var result = '';
				result += '<input  type="checkbox" name="subChk" class="lan-checkbox"  value="' + row.Code + '" />';
				return result;
			}
		},
		{
			"data" : null,
			"class" : "text-center", //最后一列，操作按钮
			render : function(data, type, row, meta) {
				var editUrlPath =wear+"Cdgl/Edit";//+"/edit/"+ row.Code+".html"; //修改地址
				var result = '';
			
				result += '<button  href="#" onclick="showModal(\'edit\',\''+row.Code+'\')" data-target="#" data-toggle="modal"  type="button" class="editBtn editBtn-info"><i class="fa fa-pencil"></i>修改</button>&nbsp;';
				//删除按钮
				result += '<button type="button" onclick="del(\''
						+ row.Code
						+ '\')" class="deleteButton editBtn disableClick"><i class="fa fa-trash-o"></i>删除</button>';
				return result;
			}
		},
		{
			"data" : "Code",
			"class" : "text-center"
		},
		{
			"data" : "Name",
			"class" : "text-center"
		},
		{
			"data" : "InstitutionCode",
			"class" : "text-center",
		},
		{
			"data" : "InstitutionName",
			"class" : "text-center"
		},
		{
			"data" : "ParentName",
			"class" : "text-center"
		},
		{
			"data" : "Region",
			"class" : "text-center"
		},
		{
			"data":"UseType",
			"class":"text-center",
			render:function(data, type, row, meta){
				if(data==1){
					return "启用";
				}else{
					return "禁用";
				}
			}
			
		}
		];

	//表格setting
	var setting = {
		listUrl :wear+"Dep/list_info",
		editUrl : web_url+"DepartmentInfo/UpdateDepartment",
		deleteUrl : web_url+"DepartmentInfo/DelDepartment",
		deletemoreUrl : web_url+"DepartmentInfo/DeleteDepartmentList",
		columnDefs : columnDefs, //表格列定义
		columns : columns, //表格列
		dataTableDiv : 'dep', //表格
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
			'Codes' : checkedList
		});
	});
	
	function del(id){
			myTable.deleteItem({
				'Lic':lin,
				'LicKey':key,
				'Code':id
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
		$.fn.zTree.init($("#depaddztreeDemo_ins_index"), InstitutionCodeSetting);
	});
	//组织结构模糊搜索
		$("#search_condition").on("input oninput",function(){
				search_ztree('depaddztreeDemo_ins_index','search_condition','group');
		});
	
	
	//modal
	var windowId = "commonWin";
            
            $("#" + windowId).on("hidden.bs.modal", function() {
                $(this).removeData("modal");
            });
			var showModal=function(meth,id){
				//获取大类数据
				if(meth=='add'){
					var remote=wear+"Dep/Add";
					
				}else{
				
					var remote=wear+"Dep/Edit?update_code="+id;
					
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
	function showMenu2(){
		var contr=$("#zTreeContent_Ins");
		contr.toggle();
	}
	
	//验证