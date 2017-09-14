/***
*	autor  兰子奇
*	date	2017/2/17
*	code	地图自定义函数
**/

//返回id
 var $$=function(id){
	 return document.getElementById(id);
 }
 
 //根据后台传输的数据转换成高德的经纬度
 
 function jsonConvertToMaplnglat(json){
	 if(json=="[]"){
		 return;
	 }
	 
	 //json数据转换一组坐标
	 
	  var points=new Array();
	 
	 if(json.indexOf("[") > -1 && json.indexOf("]") >-1){
		 //临时数组
		 var tempArray=eval(json);
		 
		
		 
		 for(var i=0;i<tempArray.length;i++){
			var obj=tempArray[i];
			 //判断是否存在属性x,和属性y
			 if(obj.hasOwnProperty('I') && obj.hasOwnProperty('L')){
				 points[i]=new AMap.LngLat(tempArray[i].I,tempArray[i].L);
			 }else{		//反之则以,号分割
				 var arr=new Array();
				 arr=obj.split(',');
				 points[i]=new AMap.LngLat(arr[0],arr[1]);
			 }
		 }
		 return points;
	 }else{
		 //判断是否为空
		 if(json=="[]"){
			 return;
		 }
		 
		 var sigle=eval("("+ json +")");
		 if(sigle.hasOwnProperty("I") && sigle.hasOwnProperty("L")){
			 points[i]=new AMap.LngLat(sigle.I,sigle.L);
		 }else{
			 var arr=new Array();
			 arr=sigle.split(",");
			 points[i]=new AMap.LngLat(arr[0],arr[1]);
		 }
		 return points;
	 }
 }
 
 
 
 //根据坐标绘制线路
 function setPolyLine(json){
	 // polygon=new AMap.Polygon({
		 // map:map,
		 // path:json,
		 // zIndex:10,
		 // strokeColor:"blue",
		 // strokeOpacity:0.9,
		 // strokeWeight:3,
		 // strokeStyle:"solid"
	 // });
	 polyline=new AMap.Polyline({
			map:map,
			path:lineArr,
			strokeColor:'blue',
			strokeOpacity:0.9,	//线透明度
			strokeWeight:3,	//线宽
			strokeStyle:'solid'	//线样式
		});
		
		return json;

 }