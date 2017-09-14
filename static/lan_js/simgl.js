var lin=$("#lin").val();
var key=$("#key").val();
// 显示隐藏列
var menu_text = "";
var table = $("#simgl tr th:gt(2)");
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
	    var treeObj = $.fn.zTree.getZTreeObj("simtreeDemo");
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
		//console.log(treeId);
		
		if(treeId=="simtreeDemo"){
			selectTreeId = treeNode.Code;
			$('#simpleQueryParam').val("");
			myTable.filter();
		}
		if(treeId=="simztreeDemo"){
			
			selectName=treeNode.Name;
			var id=$("#GroupCode").val(treeNode.Code);
			$("#GroupName").val(selectName);
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
				result += '<input  type="checkbox" name="subChk" class="lan-checkbox"  value="' + row.SimNo + '" />';
				return result;
			}
		},
		{
			"data" : null,
			"class" : "text-center", //最后一列，操作按钮
			render : function(data, type, row, meta) {
				var editUrlPath =wear+"Simgl/Edit";//+"/edit/"+ row.Code+".html"; //修改地址
				var result = '';
				//修改按钮
	
				result += '<button  href="#" onclick="showModal(\'edit\',\''+row.Id+'\')" data-target="#commonWin" data-toggle="modal"  type="button" class="editBtn editBtn-info"><i class="fa fa-pencil"></i>修改</button>&nbsp;';
				
				//删除按钮
				result += '<button type="button" onclick="del(\''
						+ row.SimNo
						+ '\')" class="deleteButton editBtn disableClick"><i class="fa fa-trash-o"></i>删除</button>';
				return result;
			}
		},
		{
			"data":"SimNo",
			"class":"text-center"
		},
		{
			"data" : "SimSN",
			"class" : "text-center"
		},
		
		{
			"data" : "Nsp",
			"class" : "text-center"
		},
		{
			"data" : "GroupCode",
			"class" : "text-center",
			"visible":false,
		},
		{
			"data" : "GroupName",
			"class" : "text-center"
		},
		{
			"data" : "NetWorkType",
			"class" : "text-center"
		},
		{
			"data" : "PackageFlow",
			"class" : "text-center"
		},
		{
			"data":"AlarmFlow",
			"class":"text-center"
		},
		{
			"data" : "OpenedTime",
			"class" : "text-center"
		}
		];

	//表格setting
	var setting = {
		listUrl :wear+"Simgl/list_info",
		editUrl : web_url+"sim/UpdateSimInfo",
		deleteUrl : web_url+"sim/DelSimInfo",
		deletemoreUrl : web_url+"sim/DelSimInfoList",
		//enableUrl : "/clbs/c/user/enable_",
		//disableUrl : "/clbs/c/user/disable_",
		columnDefs : columnDefs, //表格列定义
		columns : columns, //表格列
		dataTableDiv : 'simgl', //表格
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
			'SimNos' : checkedList
		});
	});
	
	function del(id){
			myTable.deleteItem({
				'Lic':lin,
				'LicKey':key,
				'SimNo':id
				});
	}
	// 查询全部 
	$('#queryAll').click(function() {
		selectTreeId = "";
		$('#simpleQueryParam').val("");
		var zTree = $.fn.zTree.getZTreeObj("simtreeDemo");
		zTree.selectNode("");
		myTable.filter();
	});
		//search
	$('#search_button').click(function() {
		selectTreeId = "";
		//$('#simpleQueryParam').val();
		var zTree = $.fn.zTree.getZTreeObj("simtreeDemo");
		zTree.selectNode("");
		myTable.filter();
	});
	
	$('#UnSim').click(function() {
		ajaxDataParamFun({"unsim":"UnSim"});
	});
	
	// wei
	$('#queryAll').click(function() {
		selectTreeId = "";
		$('#simpleQueryParam').val("");
		var zTree = $.fn.zTree.getZTreeObj("simtreeDemo");
		zTree.selectNode("");
		myTable.filter();
	});
	
	
	//加载完成后执行
	$(function() {
		//表格初始化
		myTable.init();
		$.fn.zTree.init($("#simtreeDemo"), treeSetting);
	});
	
	// 组织架构模糊搜索 
    $("#search_condition").on("input oninput",function(){
		search_ztree('simtreeDemo','search_condition','group');
	});
	
	
	
	//modal
	var windowId = "commonWin";
            
            $("#" + windowId).on("hidden.bs.modal", function() {
                $(this).removeData("modal");
            });
			var showModal=function(meth,id){
	
				if(meth=='add'){
					var remote=wear+"Simgl/Add";
				}else{
					
					var remote=wear+"Simgl/Edit?update_code="+id;
					
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
	
	
	