/***********
 *编写:李肖阳
 *创建日期:2015-8-10
 * 说明:本节代码主要提供关于地图的基本常用功能 区域设置等
 ***********/

var polygon;

function $$(id)
{
    return document.getElementById(id);
}


//根据后台发送的json坐标字符 转换成高度经纬度对象
function jsonConvertToMapLngLat(json)
{

    if (json === "[]")
    {
        return;
    }

    //json数组转换一组坐标点
    if (json.indexOf('[') > -1 && json.indexOf(']') > -1 )
    {
		
        var temparray = eval(json);

        var points = new Array();

        for (var i = 0; i < temparray.length; i++)
        {
            var obj = temparray[i];
			if (obj.hasOwnProperty('GoogleLatitude') && obj.hasOwnProperty('GoogleLongitude')){

					points[i] = new AMap.LngLat(obj.GoogleLongitude, obj.GoogleLatitude);
			}else{
				var arr=new Array();
				arr=obj.split(",");
				points[i] = new AMap.LngLat(arr[0],arr[1]);
				
			}			
        }
        return points;
    }
    else
    {

        if (json === "{}")
        {
            return;
        }

        // json转单个坐标点
        var pt = eval("(" + json + ")");
		if (pt.hasOwnProperty('X') && pt.hasOwnProperty('Y'))
            var point = new AMap.LngLat(pt.X, pt.Y);
		else{
			var arr=new Array();
			arr=pt.split(",");
			var point = new AMap.LngLat(arr[0], arr[1]);
		}     
        //alert(point);
        return point;
    }
}




//根据一组坐标点 在地图上绘制行政区域
function setAreaByLngLat(pts)
{
    var bounds = jsonConvertToMapLngLat(pts);

    polygon = new AMap.Polygon({
        map: map,
        strokeWeight: 1,
        path: bounds,
        fillOpacity: 0.2,//透明度
        fillColor: '#CCF3FF',
        strokeColor: '#CC66CC'
    });
}


//根据区域名 在地图上绘制行政区域
function setAreaByAreaName(areaName)
{
    //加载云图层插件
    AMap.service('AMap.DistrictSearch', function ()
    {
        var opts = {
            subdistrict: 1,   //返回下一级行政区
            extensions: 'all',  //返回行政区边界坐标组等具体信息
            level: 'city'  //查询行政级别为 市
        };


        district = new AMap.DistrictSearch(opts); //实例化DistrictSearch

        district.setLevel('district');     //搜索的区域

        //获取行政区
        district.search(areaName, function (status, result)
        {
            var bounds = result.districtList[0].boundaries;

            if (bounds)
            {
                //生成行政区划polygon
                 polygon = new AMap.Polygon({
                    map: map,
                    strokeWeight: 1,
                    path: bounds,
                    fillOpacity: 0.2,//透明度
                    fillColor: '#CCF3FF',
                    strokeColor: '#CC66CC'
                });

            }

            map.setFitView();//地图自适应

        });
    });
}



//启用编辑区域
function editOpenArea()
{
    //添加编辑控件
    map.plugin(["AMap.PolyEditor"], function ()
    {
        editorTool = new AMap.PolyEditor(map, polygon);
    });

    editorTool.open();
}



//在地图上显示用户车辆
function carDisplayOnMap(listCarInfo) {


    //没一次刷新先清除地图上所有覆盖物
    map.clearMap();

    var infos = eval(listCarInfo);

    var markers = [];

    for (var i = 0; i < infos.length; i++) {

        //验证对象信息是否包含经纬度
        if (!infos[i].hasOwnProperty('X') || !infos[i].hasOwnProperty('Y'))
            throw new error("当前车辆信息未包含X,Y经纬度坐标");


        var point = new AMap.LngLat(infos[i].X, infos[i].Y);

        //开始打点(车辆图标)
        marker = new AMap.Marker({
            icon: "http://code.mapabc.com/images/car_03.png",
            position: point,
            map: map
        });

        markers.push(marker);//把所有覆盖物加进集合,提供聚合功能使用

    }

    mapCluster(markers); //地图聚合

    map.setFitView();//地图大小自适应


}

//地图聚合
var cluster;
function mapCluster(markers) {

    //防止聚合重复在地图上显示车辆
    if (cluster) {
        cluster.setMap(null);
    }

    //显示热聚合 
    map.plugin(["AMap.MarkerClusterer"], function () {
        cluster = new AMap.MarkerClusterer(map, markers, {
            minClusterSize: 1,//聚合的最小数量
            maxZoom: 10 //当地图缩放至指定级别 才显示聚合

        });

    });

}

//设置Marker图标的偏移量
function setOffset(url,marker1){
	var img=new Image();
	img.src=url;
	img.onload = function(){
		marker1.setOffset(new AMap.Pixel(-img.width/2,-img.height/2));
	}
}


