var lin=$("#lin").val();
var key=$("#key").val();
// 显示隐藏列
var menu_text = "";
var table = $("#sjzd tr th:gt(3)");
menu_text += "<li data-stopPropagation=\"true\"><label><input type=\"checkbox\" checked=\"checked\" class=\"toggle-vis lan-checkbox\" data-column=\"" + parseInt(4) +"\" disabled />"+ table[0].innerHTML +"</label></li>"
for(var i = 1; i < table.length; i++){
    menu_text += "<li data-stopPropagation=\"true\"><label><input type=\"checkbox\" checked=\"checked\" class=\"toggle-vis lan-checkbox\" data-column=\"" + parseInt(i+4) +"\" />"+ table[i].innerHTML +"</label></li>"
};
// <!-- 让复选框停止事件传播 -->
$("ul.dropdown-menu").on("click","[data-stopPropagation]",function(e){
	e.stopPropagation();
});

$("#Ul-menu-text").html(menu_text);
	var selectTreeId = '';
	var treeSetting = {
		async : {
			url : web_url+"Dic/DicTypes",
			type : "post",
			enable : true,
			autoParam : [ "Code" ],
			otherParam : {
					"Lic" : lin,
					"LicKey":key
				},
			dataFilter: ajaxDataFilter
		},
		view : {
			//addHoverDom : addHoverDom,
			//removeHoverDom : removeHoverDom,
			selectedMulti : false,
			nameIsHTML: true
			// fontCss:{color:"#ff0011", background:"blue"}
		},
		edit : {
			enable : true,
			editNameSelectAll : true,
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
			}
		},
		
		callback : {
			beforeClick:beforeClick,
			onRightClick: OnRightClick,
			onClick : zTreeOnClick
		}
	};
	//组织树预处理函数
	function ajaxDataFilter(treeId, parentNode, responseData) {
	    var treeObj = $.fn.zTree.getZTreeObj("SjzdtreeDemo");
	    if (responseData.Result) {
	        for (var i = 0; i < responseData.Result.length; i++) {
					responseData.Result[i]['type']="group";
	                // responseData.Result[i].open = false;
	        }
	    }

	    return responseData.Result;
	};
	//右击节点
	function OnRightClick(event, treeId, treeNode) {
    if (!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0) {
        showRMenu("root", event.clientX, event.clientY);
    } else if (treeNode && !treeNode.noR) {
        showRMenu("node", event.clientX, event.clientY);
    }
}
//显示右键菜单
function showRMenu(type, x, y) {
    $("#rMenu").show();
    rMenu.css({"top":y+"px", "left":x+"px", "visibility":"visible"}); //设置右键菜单的位置、可见
    $("body").bind("mousedown", onBodyMouseDown);
}
//隐藏右键菜单
function hideRMenu() {
    if (rMenu) rMenu.css({"visibility": "hidden"}); //设置右键菜单不可见
    $("body").unbind("mousedown", onBodyMouseDown);
}
//鼠标按下事件
function onBodyMouseDown(event){
    if (!(event.target.id == "rMenu" || $(event.target).parents("#rMenu").length>0)) {
        rMenu.css({"visibility" : "hidden"});
    }
}
function beforeClick(event,treeId,treeNode){
	
}


	function addTreeNode() {
			hideRMenu();
			var remote=wear+"Sjzd/AddGen";
			
			//modal
			var windowId = "lanModal";
            
            $("#" + windowId).on("hidden.bs.modal", function() {
                $(this).removeData("modal");
            });
				if(remote!==''){
					$("#"+windowId).load(remote,function(){
					
						$("#"+windowId).modal("show");
						
						
					});
				}

		
			
	}

	function addSonTreeNode(){
		hideRMenu();
	
		 var tree=zTree.getSelectedNodes()[0];
			//modal
			var windowId = "lanModal";
            $("#" + windowId).on("hidden.bs.modal", function() {
                $(this).removeData("modal");
            });	
		 var tree=zTree.getSelectedNodes()[0];
			if(zTree.getSelectedNodes().length!=1){
				layer.alert("请选择一个根节点");
				return false;
			}else{
				var remote=wear+"Sjzd/Add?TypeCode="+tree['Code'];
				if(remote!==''){
					$("#"+windowId).load(remote,function(){
					
						$("#"+windowId).modal("show");
						
						
					});
				}
			}
			
		
		
			
	}
	
	   function updateTreeNode(){
        
			hideRMenu();
			 var tree=zTree.getSelectedNodes()[0];
			//modal
			var windowId = "lanModal";
            $("#" + windowId).on("hidden.bs.modal", function() {
                $(this).removeData("modal");
            });	
			var tree=zTree.getSelectedNodes()[0];
			if(zTree.getSelectedNodes().length!=1){
				layer.alert("请选择一个根节点");
				return false;
			}else{
				var remote=wear+"Sjzd/Edit?TypeCode="+tree['Code'];
				if(remote!==''){
					$("#"+windowId).load(remote,function(){
					
						$("#"+windowId).modal("show");
						
						
					});
				}
			}

        }

	

	
	
	
	
	
	var zNodes = null;
	var log, className = "dark";
	function beforeDrag(treeId, treeNodes) {
		return false;
	}
	
	/**
	 * 点击节点 
	 */

	
	// 组织架构模糊搜索 
	// $("#search_condition").on("input oninput",function(){
    	// search_ztree('treeDemo', 'search_condition','group');
	// });


		/**
	 * 点击节点 
	 */
	function zTreeOnClick(event, treeId, treeNode) {
			
	
		if(treeId=="SjzdtreeDemo"){
		selectTreeId = treeNode.Code;
			myTable.filter();
		}
		if(treeId=="ztreeDemo"){
			
			selectName=treeNode.Name;
			var id=$("#ParentCode").val(treeNode.Code);
			var name=$("#zTreeCitySel").val(selectName);
			showMenu();
		}
		  window.returnValue ={code:treeNode.Code,name:treeNode.Name};   //子窗体向父窗体传值

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
		{"data":"TypeCode","targets":2,"visible":false},
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
			
				result += '<button  href="#" onclick="showModal(\'edit\',\''+row.Id+'\')" data-target="#commonWin" data-toggle="modal"  type="button" class="editBtn editBtn-info"><i class="fa fa-pencil"></i>修改</button>&nbsp;';
				return result;
			}
		},
		
		{
			"data" : "TypeName",
			"class" : "text-center"
		},
		{
			"data" : "Name",
			"class" : "text-center",
		},
		{
			"data" : "Value",
			"class" : "text-center"
		},
		{
			"data" : "CreatePerson",
			"class" : "text-center"
		},
		{
			"data" : "Remark",
			"class" : "text-center"
		}
		];

	//表格setting
	var setting = {
		listUrl :wear+"Sjzd/list_info",
		editUrl : web_url+"Dic/UpdateDicItem",
		//deleteUrl : web_url+"UserInfo/DelUser",
		//deletemoreUrl : web_url+"UserInfo/DelUserList",
		columnDefs : columnDefs, //表格列定义
		columns : columns, //表格列
		dataTableDiv : 'sjzd', //表格
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
		var zTree = $.fn.zTree.getZTreeObj("SjzdtreeDemo");
		zTree.selectNode("");
		myTable.filter();
	});
	//加载完成后执行
	var zTree, rMenu , nodes;
	$(function() {
		//表格初始化
		myTable.init();
		$.fn.zTree.init($("#SjzdtreeDemo"), treeSetting);
		zTree = $.fn.zTree.getZTreeObj("SjzdtreeDemo");
		rMenu = $("#rMenu");
	});
	
	// 组织架构模糊搜索 
	$("#search_condition").on("input oninput",function(){
		search_ztree('SjzdtreeDemo','search_condition','group');
	});
	
	//modal
	var windowId = "commonWin";
            
            $("#" + windowId).on("hidden.bs.modal", function() {
                $(this).removeData("modal");
            });
			var showModal=function(meth,id){
				
				
				
				if(meth=='add'){
					var tree=zTree.getSelectedNodes()[0];
					if(tree=="undefined" || zTree.getSelectedNodes().length!=1){
						layer.alert("请选择一个大类");
						return false;
					}
					
					var remote=wear+"Sjzd/itemAdd?typeCodeAdd="+tree['Code'];
			
				}else{
				
					var remote=wear+"Sjzd/itemEdit?update_code="+id;
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
	
	
	