/**
 * Created by Tdz on 2016-11-24.
 */
function json_ajax(type,url,dataType,async,data,callback){
    $.ajax(
        {
            type:type,//通常会用到两种：GET,POST。默认是：GET
            url:url,//(默认: 当前页地址) 发送请求的地址
            dataType:dataType, //预期服务器返回的数据类型。"json"
            async:async, // 异步同步，true  false
            data:JSON.stringify(data),
			contentType:"application/json",
            timeout : 8000, //超时时间设置，单位毫秒
            beforeSend:beforeSend, //发送请求
            success:callback, //请求成功
            error:error,//请求出错
            complete:complete//请求完成
        });
}

function SubmitAjax(url,data,callback){
	$.ajax(
		{
			type:"POST",//通常会用到两种：GET,POST。默认是：GET
			url:url,//(默认: 当前页地址) 发送请求的地址
			dataType:"json", //预期服务器返回的数据类型。"json"
			async:true, // 异步同步，true  false
			data:JSON.stringify(data),
			contentType:"application/json",
			timeout : 8000, //超时时间设置，单位毫秒
			beforeSend:beforeSend, //发送请求
			success:callback, //请求成功
			error:error,//请求出错
			complete:complete//请求完成
		});
	}


function error(XMLHttpRequest, textStatus, errorThrown){
    layer.closeAll('loading');
    if(textStatus=="timeout"){
        layer.alert("加载超时，请重试");
    }else{
        /*alert(textStatus);*/
    }
}
function beforeSend(XMLHttpRequest){
    layer.load(2, {
        shade: [0.3,'#cccccc'] //0.1透明度的白色背景
    });
	// XMLHttpRequest.setRequestHeader("AccessToken",""+ AccessToken +"");
}
function complete(XMLHttpRequest, textStatus){
    layer.closeAll('loading');
}
