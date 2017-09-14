var lin=$("#lin").val();
var key=$("#key").val();
// 显示隐藏列
var menu_text = "";
var table = $("#fuelTank tr th:gt(2)");
menu_text += "<li data-stopPropagation=\"true\"><label><input type=\"checkbox\" checked=\"checked\" class=\"toggle-vis lan-checkbox\" data-column=\"" + parseInt(3) +"\" disabled />"+ table[0].innerHTML +"</label></li>"
for(var i = 1; i < table.length; i++){
    menu_text += "<li data-stopPropagation=\"true\"><label><input type=\"checkbox\" checked=\"checked\" class=\"toggle-vis lan-checkbox\" data-column=\"" + parseInt(i+3) +"\" />"+ table[i].innerHTML +"</label></li>"
};
// <!-- 让复选框停止事件传播 -->
$("ul.dropdown-menu").on("click","[data-stopPropagation]",function(e){
	e.stopPropagation();
});
$("#Ul-menu-text").html(menu_text);

		//ajax参数
	var ajaxDataParamFun = function(d) {
		d.simpleQueryParam = $('#simpleQueryParam').val(); //模糊查询	
	};

	//表格
	var myTable;
	//表格列定义
	var columnDefs = [ {
		//第一列，用来显示序号
		"searchable" : false,
		"orderable" : false,
		"targets" : 0
	}];
	var columns = [
		{"data":null},
		{"data":"Id","target":1,"visible":false},
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
				var editUrlPath =wear+"Clgl/Edit";//+"/edit/"+ row.Code+".html"; //修改地址
				var result = '';
			
				result += '<button  href="#" onclick="showModal(\'edit\',\''+row.Id+'\')" data-target="#" data-toggle="modal"  type="button" class="editBtn editBtn-info"><i class="fa fa-pencil"></i>修改</button>&nbsp;';
				
				//删除按钮
				result += '<button type="button" onclick="del(\''
						+ row.Code
						+ '\')" class="deleteButton editBtn disableClick"><i class="fa fa-trash-o"></i>删除</button>';
				return result;
			}
		},
		{
			"data":"Code",
			"class":"text-center"
		},
		{
			"data" : "Model",
			"class" : "text-center"
		},
		{
			"data" : "Shape",
			"class" : "text-center",
			render:function(data,type,row,meta){
				if(data==1){
					return "长方体";
				}else{
					return "圆柱形";
				}
				
			}
		},
		{
			"data" : "Len",
			"class" : "text-center"
		},
		{
			"data" : "Wid",
			"class" : "text-center"
		},
		{
			"data" : "Hig",
			"class" : "text-center"
			
		},
		{
			"data" : "Wall",
			"class" : "text-center"
		},
		{
			"data" : "TheoreVolume",
			"class" : "text-center"
		},
		{
			"data":"ActualVolume",
			"class":"text-center"
		},
		{
			"data":"FuleCalCode",
			"class":"text-center"
		}
		
		];

	//表格setting
	var setting = {
		listUrl :wear+"FuelTank/list_info",
		editUrl : web_url+"FuelTank/UpdateCarFuelInfo",
		deleteUrl : web_url+"FuelTank/DelCarFuelInfo",
		deletemoreUrl : web_url+"FuelTank/DelCarFuelInfoList",
		columnDefs : columnDefs, //表格列定义
		columns : columns, //表格列
		dataTableDiv : 'fuelTank', //表格
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
			'Codes' : checkedList
		});
	});
	
	function del(id){
			myTable.deleteItem({
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
		selectTreeId = "";
		
		// $('#simpleQueryParam').val("");
		myTable.filter();
		
	});
	//加载完成后执行
	$(function() {
		//表格初始化
		myTable.init();
		
	});

	//modal
	var windowId = "commonWin";
            
            $("#" + windowId).on("hidden.bs.modal", function() {
                $(this).removeData("modal");
            });
			var showModal=function(meth,id){
	
				if(meth=='add'){
					var remote=wear+"FuelTank/Add";
				}else{
					var remote=wear+"FuelTank/Edit?update_code="+id;
					
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
	
	
	