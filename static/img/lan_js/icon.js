var lin=$("#lin").val();
var key=$("#key").val();
// 显示隐藏列
var menu_text = "";
var table = $("#icon tr th:gt(2)");
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
		//	var lin=$("#lin").val();
		//var key=$("#key").val();
		var selectName="";
		var treeSetting = {
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
					pIdKey:"Children",
					rootPId:"null"
				},
				key:{
					enable:true,
					name:"Text"
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
	    var treeObj = $.fn.zTree.getZTreeObj("compaddztreeDemo");
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
		
		// if(treeId=="compaddztreeDemo"){
		// selectTreeId = treeNode.Code;
		// $('#simpleQueryParam').val("");
			// myTable.filter();
		// }
		if(treeId=="compaddztreeDemo"){
			
			selectName=treeNode.Text;
			var id=$("#ParentCode").val(treeNode.Code);
			var name=$("#GroupName").val(selectName);
			showMenu();
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
			"data" : null,
			"class" : "text-center",
			render:function(data,type,row,meta){
				var result='';
				result+="<img src="+ pic+row.PathName +" width='50px' />";
				
				return result;
			}
			
		},
		{
			"data" : "Model",
			"class" : "text-center",
		},
		{
			"data" : "Status",
			"class" : "text-center",
			render:function(data,type,row,meta){
				switch(data){
					case 0:
						return "空载";
						break;
					case 2:
						return "满载";
						break;
					case 4:
						return "工作";
						break;
					case 6:
						return "非工作";
						break;
					case 8:
						return "未连接";
						break;
					case 10:
						return "断线";
						break;
					case 12:
						return "视频";
						break;
				}
				
			}
		}
		];

	//表格setting
	var setting = {
		listUrl :wear+"Icon/list_info",
		editUrl : web_url+"IconResouce/UpdateIconResouce",
		deleteUrl : web_url+"IconResouce/DeleteIconResouce",
		deletemoreUrl : web_url+"IconResouce/DeleteIconResouces",
		columnDefs : columnDefs, //表格列定义
		columns : columns, //表格列
		dataTableDiv : 'icon', //表格
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
	});
	
	
	//modal
	var windowId = "commonWin";
            
            $("#" + windowId).on("hidden.bs.modal", function() {
                $(this).removeData("modal");
            });
			var showModal=function(meth,id){
				//获取大类数据
				if(meth=='add'){
					var remote=wear+"Icon/Add";
			
				}else{
					
					var remote=wear+"Icon/Edit.html?update_code="+id;
					
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
	//验证