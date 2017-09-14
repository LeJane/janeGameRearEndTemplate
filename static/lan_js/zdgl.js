var lin=$("#lin").val();
var key=$("#key").val();
// 显示隐藏列
var menu_text = "";
var table = $("#zdgl tr th:gt(2)");
menu_text += "<li data-stopPropagation=\"true\"><label><input type=\"checkbox\" checked=\"checked\" class=\"toggle-vis lan-checkbox\" data-column=\"" + parseInt(3) +"\" disabled />"+ table[0].innerHTML +"</label></li>"
for(var i = 1; i < table.length; i++){
    menu_text += "<li data-stopPropagation=\"true\"><label><input type=\"checkbox\" checked=\"checked\" class=\"toggle-vis lan-checkbox\" data-column=\"" + parseInt(i+3) +"\" />"+ table[i].innerHTML +"</label></li>"
};
// <!-- 让复选框停止事件传播 -->
$("ul.dropdown-menu").on("click","[data-stopPropagation]",function(e){
	e.stopPropagation();
});
$("#Ul-menu-text").html(menu_text);
		//	var lin=$("#lin").val();
		//var key=$("#key").val();
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
		if(treeId=="ZdgltreeDemo"){
		selectTreeId = treeNode.Code;
		$('#simpleQueryParam').val("");
			myTable.filter();
		}
		if(treeId=="zdgladdztreeDemo"){
			
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
				result += '<input  type="checkbox" name="subChk" class="lan-checkbox"  value="' + row.TerCode + '" />';
				return result;
			}
		},
		{
			"data" : null,
			"class" : "text-center", //最后一列，操作按钮
			render : function(data, type, row, meta) {
				var editUrlPath =wear+"Zdgl/Edit";//+"/edit/"+ row.Code+".html"; //修改地址
				var result = '';
				//修改按钮
				//console.log(row);
			
				result += '<button  href="#" onclick="showModal(\'edit\',\''+row.Id+'\')" data-target="#" data-toggle="modal"  type="button" class="editBtn editBtn-info"><i class="fa fa-pencil"></i>修改</button>&nbsp;';
				
				//删除按钮
				result += '<button type="button" onclick="del(\''
						+ row.TerCode
						+ '\')" class="deleteButton editBtn disableClick"><i class="fa fa-trash-o"></i>删除</button>';
				return result;
			}
		},
		{
			"data":"TerCode",
			"class":"text-center"
		},
		{
			"data" : "GroupCode",
			"class" : "text-center"
		},
		{
			"data" : "GroupName",
			"class" : "text-center",
		},
		{
			"data" : "SN",
			"class" : "text-center"
		},
		{
			"data" : "HasVideo",
			"class" : "text-center",
			render:function(data,type,row,meta){
				var res="";
				if(data){
					res+="是";
				}else{
					res+="否";
				}
				return res;
			}
		},
		{
			"data" : "IsOpen",
			"class" : "text-center",
			render:function(data,type,row,meta){
				var val="";
				if(data){
					val+="是";
				}else{
					val+="否";
				}
				return val;
			}
		},
		{
			"data":"TerType",
			"class":"text-center"
		},
		{
			"data" : "ChanelCount",
			"class" : "text-center"
		},
		{
			"data" : "Remark",
			"class" : "text-center",
		},
		{
			"data":"Installer",
			"class":"text-center"
		},
		{
			"data":"UpdateReason",
			"class":"text-center"
		}
		];

	//表格setting
	var setting = {
		listUrl :wear+"zdgl/list_info",
		editUrl : web_url+"Terminal/UpdateTerInfo",
		deleteUrl : web_url+"Terminal/DelTerInfo",
		deletemoreUrl : web_url+"Terminal/DelTerInfoList",
		//enableUrl : "/clbs/c/user/enable_",
		//disableUrl : "/clbs/c/user/disable_",
		columnDefs : columnDefs, //表格列定义
		columns : columns, //表格列
		dataTableDiv : 'zdgl', //表格
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
			'TerCodes' : checkedList
		});
	});
	
	function del(id){
			myTable.deleteItem({
				'Lic':lin,
				'LicKey':key,
				'TerCode':id
				});
	}
	// 查询全部 
	$('#queryAll').click(function() {
		selectTreeId = "";
		$('#simpleQueryParam').val("");
		var zTree = $.fn.zTree.getZTreeObj("ZdgltreeDemo");
		zTree.selectNode("");
		myTable.filter();
	});
	//search
	$('#search_button').click(function() {
	
		selectTreeId = "";
		//$('#simpleQueryParam').val();
		var zTree = $.fn.zTree.getZTreeObj("ZdgltreeDemo");
		zTree.selectNode("");
		myTable.filter();
	});
	
	
	
	
	//加载完成后执行
	$(function() {
		//表格初始化
		myTable.init();
		$.fn.zTree.init($("#ZdgltreeDemo"), treeSetting);
	});
	
	// 组织架构模糊搜索 
	$("#search_condition").on("input oninput",function(){
		search_ztree('ZdgltreeDemo','search_condition','group');
	});
	
	
	//modal
	var windowId = "commonWin";
            
            $("#" + windowId).on("hidden.bs.modal", function() {
                $(this).removeData("modal");
            });
			var showModal=function(meth,id){
	
				if(meth=='add'){
					var remote=wear+"Zdgl/Add";
				}else{
					
					var remote=wear+"Zdgl/Edit?update_code="+id;
					
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
		var contr=$("#ConfigMenuTer");
		contr.toggle();
	}
	//验证
	
	
	