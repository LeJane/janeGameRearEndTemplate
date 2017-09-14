
/*
 *	编写:兰子奇
 *创建日期:2017-2-17
 * 说明:地图初始化
 */

var map;
var toolBar;

function initialize() {
//	var position = new AMap.LngLat(104.758545, 31.474781);
	map = new AMap.Map("container", {
		view: new AMap.View2D({ //创建地图二维视口
			center: [104.758545, 31.474781], //创建中心点坐标
			zoom: 10, //设置地图缩放级别
			rotation: 0, //设置地图旋转角度
			resizeEnable: true
		}),
		lang: "zh_cn" //设置地图语言类型，默认：中文简体
	}); //创建地图实例

	
	// map=new AMap.Map('container',{
		// resizeEnable:true,
		// scrollWheel: true,
		// zoom:10
	// });
  //实例化3D楼块图层
	buildings = new AMap.Buildings();
	// 在map中添加3D楼块图层
	buildings.setMap(map);
	
AMap.plugin(['AMap.ToolBar','AMap.Scale','AMap.OverView'],
    function(){
        map.addControl(new AMap.ToolBar());		//工具栏

        map.addControl(new AMap.Scale());		//加载标尺

        map.addControl(new AMap.OverView({isOpen:true}));		//加载鹰眼
});
	


	//加载地图类型切换插件
	map.plugin(["AMap.MapType"], function() {
		//地图类型切换
		var mapType = new AMap.MapType({
			defaultType: 0, //默认显示画布地图
			showRoad: true //叠加路网图层
		});
		map.addControl(mapType);
	});

}
//创建右键菜单
function addMenu(){
	
	//创建右键菜单
	var contextMenu = new AMap.ContextMenu();
	//右键放大
	contextMenu.addItem("放大一级", function() {
		map.zoomIn();
	}, 0);
	//右键缩小
	contextMenu.addItem("缩小一级", function() {
		map.zoomOut();
	}, 1);
	//右键显示全国范围
	contextMenu.addItem("缩放至全国范围", function(e) {
		map.setZoomAndCenter(4, new AMap.LngLat(108.946609, 34.262324));
	}, 2);

	//地图绑定鼠标右击事件——弹出右键菜单
	AMap.event.addListener(map, 'rightclick', function(e) {
		contextMenu.open(map, e.lnglat);
		contextMenuPositon = e.lnglat;
	});
}

function addToolBar()
{
		//加载ToolBar插件
	map.plugin(["AMap.ToolBar"], function() {
		toolBar = new AMap.ToolBar();
		map.addControl(toolBar);
	});
}