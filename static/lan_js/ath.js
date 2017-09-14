var lin=$("#lin").val();
var key=$("#key").val();
// 显示隐藏列
var menu_text = "";
var table = $("#ath tr th:gt(3)");
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

		var selectName="";
		
	
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
		{"data":"Code","targets":1,"visible":false},
		{
			"data" : null,
			"class" : "text-center",
			render : function(data, type, row, meta) {
			//console.log(data);
				var result = '';
				result += '<input  type="checkbox" name="subChk" class="lan-checkbox"  value="' + row.Code + '" />';
				return result;
			}
		},
		{
			"data" : null,
			"class" : "text-center", //最后一列，操作按钮
			render : function(data, type, row, meta) {
				var editUrlPath =wear+"Ath/Edit.html?update_code="+row.Code;"";//+"/edit/"+ row.Code+".html"; //修改地址
				var result = '';
			
				result += '<button  href="'+editUrlPath+'"  data-target="#lanziqi" data-toggle="modal"  type="button" class="editBtn editBtn-info"><i class="fa fa-pencil"></i>修改</button>&nbsp;';
				//删除按钮
				result += '<button type="button" onclick="del(\''
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
			"data" : "RType",
			"class" : "text-center",
			render:function(data,type,row,meta){
					if(data==0){
						return "用户";
					}else{
						return "超级管理员";
					}
				
			}
		}

		];

	//表格setting
	var setting = {
		listUrl :wear+"Ath/list_info",
		editUrl : web_url+"DepartmentInfo/UpdateDepartment",
		deleteUrl : web_url+"RoleInfo/DelRole",
		deletemoreUrl : web_url+"RoleInfo/DeleteRoleList",
		columnDefs : columnDefs, //表格列定义
		columns : columns, //表格列
		dataTableDiv : 'ath', //表格
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
	
		myTable.clickRow("ath");
		
	});

	
			
	function showMenu(){
		var contr=$("#zTreeContent");
		contr.toggle();
	}
	function showMenu2(){
		var contr=$("#zTreeContent_Ins");
		contr.toggle();
	}
	
	function lanModalShow(id,Modal){
	
			var remote="";
			if(id=="Person"){
				remote=wear+"Ath/PersonAdd";
				
			}else if(id="RoleAdd"){
				remote=wear+"Ath/Add";
			}else{
				remote=wear+"Ath/AthAdd";
			}
			
			$("#"+Modal).load(remote,function(){
					
				$("#"+Modal).modal("show");
			
			});
		
	}
	
	//验证
	var windowId = "commonSmWin";
	$("#" + windowId).on("hidden.bs.modal", function() {
		$(this).removeData("modal");
	});
	var showModal=function(meth,id){
		var rs;

		$("#ath tbody tr").each(function(k,v){
			if($(v).hasClass("selected")){
				rs=$(v).length;
			}
		});
		//判断是否选中角色行
		if(rs != 1){
			layer.alert("角色不能为空");
			return false;
		}
		//弹框
		if(meth=='PersonAdd'){
			var remote=wear+"Ath/PersonAdd";
		}else{
			var remote=wear+"Ath/AthAdd";
		}

		//显示
		if(remote!==''){
			$("#"+windowId).load(remote,function(){

				$("#"+windowId).modal("show");
			});
		}
	}