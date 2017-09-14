var lin=$("#lin").val();
var key=$("#key").val();

// 显示隐藏列
var menu_text = "";
var table = $("#dataTable tr th:gt(4)");
menu_text += "<li data-stopPropagation=\"true\"><label><input type=\"checkbox\" checked=\"checked\" class=\"toggle-vis lan-checkbox\" data-column=\"" + parseInt(5) +"\" disabled />"+ table[0].innerHTML +"</label></li>"
for(var i = 1; i < table.length; i++){
    menu_text += "<li data-stopPropagation=\"true\"><label><input type=\"checkbox\" checked=\"checked\" class=\"toggle-vis lan-checkbox\" data-column=\"" + parseInt(i+5) +"\" />"+ table[i].innerHTML +"</label></li>"
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
					enable :true,
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
				onClick : zTreeOnClick
			}
		};
//组织树预处理函数
	function ajaxDataFilter(treeId, parentNode, responseData) {
		var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
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

		if(treeId=="treeDemo"){
			
			$('#simpleQueryParam').val("");
			
			selectTreeId = treeNode.Code;
		
			myTable.filter();
		}
		if(treeId=="ztreeDemo"){
			
			selectName=treeNode.Name;
			var id=$("#ParentCode").val(treeNode.Code);
			$("#GroupName").val(selectName);
			showMenu();
		}
		

	};
	
		//ajax参数
	var ajaxDataParamFun = function(d) {
		d.simpleQueryParam = $('#simpleQueryParam').val(); //模糊查询
		d.groupId = selectTreeId;
	};
	
	//表格
	var myTable;
	//表格列定义
	var columnDefs = [ {
		//第一列，用来显示序号
		"searchable" : false,
		"orderable" : false,
		"targets" : 0
	},{"targets":1,"visible":false},{"targets":2,"visible":false},{"targets":3,"visible":false}];
	var columns = [
		{"data":null},
		{"data":"Id","targets":1,"visible":false},
		{"data":"ParentCode","targets":2,"visible":false},
		{"data":"Code","targets":3,"visible":false},
		
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
					//修改按钮
					result += '<button  href="#" onclick="showModal(\'edit\',\''+row.Id+'\')" data-target="#commonWin" data-toggle="modal"  type="button" class="editBtn editBtn-info"><i class="fa fa-pencil"></i>修改</button>&nbsp;';
					
					//删除按钮
					result += '<button type="button" onclick="myTable.deleteGroup(\''
							+ row.Code
							+ '\')" class="deleteButton editBtn disableClick"><i class="fa fa-trash-o"></i>删除</button>';
					return result;
				}
			},
			{
				"data" : "Name",
				"class" : "text-center"
			},
			{
				"data" : "GType",
				"class" : "text-center",
			},
			{
				"data" : "Industry",
				"class" : "text-center"
			},
			{
				"data" : "TelPhone",
				"class" : "text-center"
			},
			{
				"data" : "Address",
				"class" : "text-center"
			},
			{
				"data" : "Remark",
				"class" : "text-center"
			}
			
			];

	//表格setting
	var setting = {
		listUrl :wear+"Cdgl/list_info",
		editUrl : web_url+"CarGroup/UpdateGroup",
		deleteUrl : web_url+"CarGroup/DelGroup",
		deletemoreUrl : web_url+"CarGroup/DelGroupList",
		//enableUrl : "/clbs/c/user/enable_",
		//disableUrl : "/clbs/c/user/disable_",
		columnDefs : columnDefs, //表格列定义
		columns : columns, //表格列
		dataTableDiv : 'dataTable', //表格
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
	// 查询全部 
	$('#queryAll').click(function() {
		selectTreeId = "";
		$('#simpleQueryParam').val("");
		var zTree = $.fn.zTree.getZTreeObj("treeDemo");
		zTree.selectNode("");
		myTable.filter();
	});
	//search
	$('#search_button').click(function() {
		selectTreeId = "";
		//$('#simpleQueryParam').val();
		var zTree = $.fn.zTree.getZTreeObj("treeDemo");
		zTree.selectNode("");
		myTable.filter();
	});
	//加载完成后执行
	$(function() {
		//表格初始化
		myTable.init();
		$.fn.zTree.init($("#treeDemo"), treeSetting);
	});
	
	// 组织架构模糊搜索 
 
	$("#search_condition").on("input oninput",function(){
		search_ztree('treeDemo','search_condition','group');
	});
	
	
	//modal
	var windowId = "commonWin";
            
            $("#" + windowId).on("hidden.bs.modal", function() {
                $(this).removeData("modal");
            });
			var showModal=function(meth,id){
	
				if(meth=='add'){
					var remote=wear+"Cdgl/Add";
				}else{
					
					var remote=wear+"Cdgl/Edit?update_code="+id;
					
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
	
	