//日历高亮

var GroupCode=$("#GroupCode").val();
var treeSettingMap = {
		async : {
			url : web_url+"AppUserInfo/UserCarList",
			type : "post",
			enable : true,
			autoParam :['Code'],
			dataType : "json",
			dataFilter: ajaxDataFilter
		},
		view : {
			selectedMulti : false,
			nameIsHTML: true,
			dblClickExpand: false
		},
		check : {
				enable : true,
				chkStyle: "checkbox",
				autoCheckTrigger: true
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
			beforeClick:beforeClickMap,
			onClick : zTreeOnClickMap,
			onCheck:zTreeOnClickMap,
			beforeCheck: zTreeBeforeCheckMap
		}
	};
	//组织树预处理函数
	function ajaxDataFilter(treeId, parentNode, responseData) {
		var nodes=responseData.Result;
		
		var ArrData=new Array();
		if (nodes) {
			for (var i = 0; i < nodes.length; i++) {
				fGroup=nodes[i]['FleetGroupList'];
					for (var f=0; f < fGroup.length; f++){
						//处理code重复问题
						fGroup[f]['Code']=fGroup[f]['Code']+"fGroup";		//避免code重复
						fGroup[f]['ParentCode']=nodes[i]['Code'];
						fGroup[f].open=true;
						fGroup[f]['iconSkin']="assignmentSkin";	//分组类名
						ArrData.push(fGroup[f]); //压入子节点	分组
						
						//车辆循环
						CarNos=fGroup[f]['CarList'];
						for(var c=0;c<CarNos.length;c++){
														//处理code重复问题
							if(CarNos[c] && CarNos[c] !=null){
								CarNos[c]['ParentCode']=fGroup[f]['Code'];
								CarNos[c]['Name']=CarNos[c]['Carno'];
								CarNos[c]['iconSkin']="vehicleSkin";	//分组类名
								CarNos[c]['GroupFlag']="assignment";	//分组标记，用于选择时只能选择分组，而不能选择企业
								CarNos[c]['type']="group";		//用于搜索时的标记
								ArrData.push(CarNos[c]); //压入子节点	车辆
							}
							
						}
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
	
	function beforeClickMap(treeId,treeNode,clickFlag){
		var node=$.fn.zTree.getZTreeObj("treeDemoRealMap");
		node.checkNode(treeNode,!treeNode.checked,treeNode,true);
		return false;
	}
	
	//勾选回调函数
	function zTreeBeforeCheckMap(treeId, treeNode){
            var treeObj = $.fn.zTree.getZTreeObj("treeDemoRealMap");
            var nodes = treeObj.getCheckedNodes(true);
            // for(var i = 0; i < nodes.length; i++){
                // treeObj.checkNode(nodes[i], false, true);
            // }
        }
/**
 * 点击节点
 */
function zTreeOnClickMap(event, treeId, treeNode) {
	
	var zTree = $.fn.zTree.getZTreeObj("treeDemoRealMap");
            nodes = zTree.getCheckedNodes(true);	//获得选中的节点数据
            v = "";	
            // nodes.sort(function compare(a,b){return a.Id-b.Id;});	//排序
            
            for (var i=0, l=nodes.length; i<l; i++) {
            	if (nodes[i].GroupFlag == "assignment") { // 选择的是分组，才组装值
            		if (nodes[i].Code, nodes[i].Name) {
		                v += nodes[i].Name + ",";
            		} else {
            			nodes[i].checked = false;
            			amtNames = nodes[i].Name;
            		}
            	}
            }
			if (v.length > 0) v = v.substring(0, v.length-1);	//去掉多余的逗号
           	var cityObj = $("#CarNoName");
            cityObj.attr("value", v);
			//赋值
            $("#CarNos").val(v);
			// getActive(v,nowMonth,afterMonth)		//获得历史信息
};



//坐标点
 
$(function(){

	
	//车辆信息
	setTimeout({
			$.fn.zTree.init($("#treeDemoRealMap"), treeSettingMap);
	},800)
	
	 
	 // 组织架构模糊搜索
	$("#CarNo").on("input oninput",function(){
		search_ztree('treeDemoRealMap','CarNo','group');
	});
	
	initialize();
	
	addMenu();
	
	
	
});
	
	//播放
	function PlayMap(){
		
		if(!isPlaying && !isresumeMove){
			$("#playIcon").removeClass("playIcon").addClass("suspendedIcon");	//播放
			moveAlong()
		}else if(isPlaying){
			$("#playIcon").removeClass("suspendedIcon").addClass("playIcon");
								//暂停播放
			pauseMove()
			
		}else if(!isPlaying && isresumeMove ){
						//继续播放
			$("#playIcon").removeClass("playIcon").addClass("suspendedIcon");
			resumeMove() 
		}
	}
	
	//停止播放
	function Restart(){
		if(isPlaying){
			$("#playIcon").removeClass("suspendedIcon").addClass("playIcon");
		}
		stopMove();
	}
	
	
	//当车辆点击时请求数据
	function getActive(CarNo,nowMonth,afterMonth){
		var dataTime = nowMonth.split("-")[0] + nowMonth.split("-")[1];
          
	
	}


	
