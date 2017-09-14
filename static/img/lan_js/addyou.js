var lin=$("#lin").val();
var key=$("#key").val();
// 显示隐藏列
var menu_text = "";
var table = $("#addyouBb tr th:gt(2)");
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
			url : web_url+"CarGroup/GroupCarsInfo",
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
			nameIsHTML: true,
			dblClickExpand: false
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
			beforeClick:beforeClick,
			onClick : zTreeOnClick,
			onCheck:zTreeOnClick
		}
	};
	//组织树预处理函数
	function ajaxDataFilter(treeId, parentNode, responseData) {
		var nodes=responseData.Result;
		var ArrData=[];
		if (nodes) {
			for (var i = 0; i < nodes.length; i++) {
				nodes[i]['ParentCode']="";
				var CarNos=nodes[i]['CarNos'];
				for(var b=0;b<CarNos.length;b++){
					CarNos[b]['ParentCode']=nodes[i]['Code'];
					CarNos[b]['iconSkin']="assignmentSkin";	//分组类名
					CarNos[b]['GroupFlag']="assignment";	//分组标记，用于选择时只能选择分组，而不能选择企业
					CarNos[b]['type']="group";		//用于搜索时的标记
					ArrData.push(CarNos[b]); //压入子节点
				}
				nodes[i]['type']="group";
				nodes[i].open=true;
				ArrData.push(nodes[i]);
			}
		}
		return ArrData;
	};

	/*
	*	FUNCTION beforClick 点击节点之前
	*	author	 兰子
	*/
	
	function beforeClick(treeId,treeNode,clickFlag){
		var node=$.fn.zTree.getZTreeObj("addyou");
		node.checkNode(treeNode,!treeNode.checked,treeNode,true);
		return false;
	}
/**
 * 点击节点
 */
function zTreeOnClick(event, treeId, treeNode) {


    // if(treeId=="addyou"){

        // selectName=treeNode.Name;
       // /* var id=$("#GroupCode").val(treeNode.Code);
        // var name=$("#zTreeCitySel").val(selectName);
        // showMenu();*/
    // }
	
	var zTree = $.fn.zTree.getZTreeObj("addyou");
            nodes = zTree.getCheckedNodes(true);	//获得选中的节点数据
            v = "";	
            t = "";
            nodes.sort(function compare(a,b){return a.Id-b.Id;});	//排序
            
            
            for (var i=0, l=nodes.length; i<l; i++) {
            	if (nodes[i].GroupFlag == "assignment") { // 选择的是分组，才组装值
            		if (nodes[i].Code, nodes[i].Name) {
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
           	var cityObj = $("#CarNosName");
            cityObj.attr("value", t);
			//赋值
            $("#CarNos").val(v);


};

//ajax参数
var ajaxDataParamFun = function(d) {

    d.simpleQueryParam = $('#simpleQueryParam').val(); //模糊查询
    d.groupId = selectTreeId;
    var rs=$("#field").val();
    if(rs=='Code'){
        d.Code=d.simpleQueryParam;
    }else if(rs=='keyword'){
        d.keyword=d.simpleQueryParam;
    }

};
var CarNos=new Object();

function Addyou(){

    var startDate=$("#StartDate").val();	//起始时间
    var endDate=$("#EndDate").val();	//结束时间
    var start=new Date(startDate);
    var end=new Date(endDate);
    if(startDate==''){
        layer.alert("请选择开始时间");
        return false;
    }
    if(endDate==''){
        layer.alert("请选择结束时间");
        return false;
    }
    start = start.getTime();
    end = end.getTime();
    if(end < start){
        layer.alert("结束时间不能小于起始时间");
        return false;
    }
    var treeObj = $.fn.zTree.getZTreeObj("addyou");
    var nodes = treeObj.getCheckedNodes(true);
    if( nodes.length < 1 ){
        layer.alert("请选择车辆");
        return false;
    }

    //车辆集合
    var CarNos=new Array();


    for(i=0;i<nodes.length;i++){
        if(nodes[i]['children']){
            var carNO=nodes[i]['children'];
            for(b=0;b<carNO.length;b++){
                if(carNO[b]['checked']){
                   CarNos.push(carNO[b]['Name']);
                }
            }
        }
    }
    // CarNos.push("运川B34593");
    // CarNos.push("工川B60003");
    // CarNos.push("运川BMZ779");
    // CarNos.push("运川B34593");
    // CarNos.push("工川B60008");
    CarNos={
        "CarNos":CarNos,
        "StartDate":startDate,
        "EndDate":endDate
    };

    //表格
    var myTable;
//表格列定义
    var columnDefs = [{
        //第一列，用来显示序号
        "searchable" : false,
        "orderable" : false,
        "targets" : 0
    }];
    var columns = [
        {"data":null},
        {
            "data" : null,
            "class" : "text-center", //最后一列，操作按钮
            render : function(data, type, row, meta) {
                var result = '';

                result += '<button  href="#" onclick="showModal(\'edit\',\''+row.Code+'\')" data-target="#commonWin" data-toggle="modal"  type="button" class="editBtn editBtn-info"><i class="fa fa-pencil"></i>详情</button>&nbsp;';
                return result;
            }
        },
        {
            "data":"CarNo",
            "class":"text-center"
        },
        {
            "data" : "AddNummber",
            "class" : "text-center"
        },
        {
            "data" : "AddOilSum",
            "class" : "text-center",
        }
    ];

//表格setting
    var setting = {
        listUrl :wear+"Addyou/list_info",
        editUrl : charts,
        deleteUrl : web_url+"UserInfo/DelUser",
        deletemoreUrl : web_url+"UserInfo/DelUserList",
        columnDefs : columnDefs, //表格列定义
        columns : columns, //表格列
        dataTableDiv : 'addyouBb', //表格
        ajaxDataParamFun :CarNos , //ajax参数
        pageable : true, //是否分页
        showIndexColumn : true, //是否显示第一列的索引列
        enabledChange : true
    };

//创建表格
    myTable = new TG_Tabel.createNew(setting);
    //表格初始化

    myTable.init();

}

function chartsAddyou(param){

    //报表
    var Carno=new Array();       //车牌号
    var AddNummber=new Array();  //加油次数
    var AddOilSum=new Array();   //加油量
    for(var i=0;i<param['data'].length;i++){
        Carno.push(param['data'][i]['CarNo']);
        AddNummber.push(param['data'][i]['AddNummber']);
        AddOilSum.push(param['data'][i]['AddOilSum']);
    }

    // console.log(param);

    var params={};
    var params={
        "SubTitle":"绵阳世平科技有限公司",
        "Title":"",
        "X":Carno,
        "Y":"",
        "Name":"加油量",
        "data":AddOilSum,
        "Name2":"加油次数",
        "data2":AddNummber
    }
    chartsTotal("#home12",params);
}


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
    var zTree = $.fn.zTree.getZTreeObj("addyou");
    zTree.selectNode("");
    myTable.filter();
});
//加载完成后执行
$(function() {
    //表格初始化
    //myTable.init();
    $.fn.zTree.init($("#addyou"), treeSetting);
});

// 组织架构模糊搜索
$("#search_add_condition").on("input oninput",function(){
    search_ztree('addyou','search_add_condition','group');
});




//modal
var windowId = "commonWin";

$("#" + windowId).on("hidden.bs.modal", function() {
    $(this).removeData("modal");
});
var showModal=function(meth,id){
	return false;

    if(meth=='add'){
        var remote=wear+"Yhgl/Add";
    }else{
        var rs=[];
        var table = $('#yhgl').DataTable();
        $("#yhgl tbody tr").on("click",'td',function(){
            var info=table.rows(this).data();
            var all=table.rows().data();
            


        });
        var remote=wear+"Yhgl/Edit";

    }


    if(remote!==''){
        $("#"+windowId).load(remote,function(){

            $("#"+windowId).modal("show");
            //赋值--->增强交互性
        


        });
    }
}

function showMenu(){
    var contr=$("#zTreeContent");
    contr.toggle();
}
//验证


