
//表单转化为json
$.fn.serializeObject = function()
{
	var o = {};
	var a = this.serializeArray();
	$.each(a, function() {
		if (o[this.name] !== undefined) {
			if (!o[this.name].push) {
				o[this.name] = [o[this.name]];
			}
			o[this.name].push(this.value || '');
		} else {
			o[this.name] = this.value || '';
		}
	});
	return o;
};


var AccessToken="";	//AccessToken

$(function(){
	AccessToken=$("#AccessToken").val();
});

function lanSubmit(id,url,modalId="commonWin",treeobj=""){
		$("#"+modalId).modal("hide");	//隐藏modal
		$("#" + modalId).on("hidden.bs.modal", function() {
			$(this).removeData("bs.modal");
		});
		
		if(id || url){
				$.ajax({
				   type: "POST",
				   url: web_url+url,
				   contentType: "application/json",
				   data: JSON.stringify($("#"+id).serializeObject()),
				   beforeSend: function(XMLHttpRequest){			//发送头部信息
                        XMLHttpRequest.setRequestHeader("AccessToken",""+ AccessToken +"");
                  },
				   success: function(msg){
					 checkAuth(msg);	//检查令牌是否过期
					 if(msg.State==200){
						 myTable.filter();
						 if(treeobj!==''){
							  var zTreeObj = $.fn.zTree.getZTreeObj(treeobj);
							zTreeObj.destroy();
							$.fn.zTree.init($("#"+treeobj), treeSetting);
						 }
						
						 layer.alert("操作成功");
						 return msg.Result;
					 }else{
						 layer.alert(msg.Error);
						 return;
					 }
					 
				   }
				});
		}
	
	
}


function lanSubmitMenu(id,param,url,modalId="commonWin"){
		$("#"+modalId).modal("hide");	//隐藏modal
		$("#" + modalId).on("hidden.bs.modal", function() {
				$(this).removeData("bs.modal");
			});
		if(id || url){
				$.ajax({
				   type: "POST",
				   url: web_url+url,
				   data:JSON.stringify(param),
				   contentType: "application/json",
				   beforeSend: function(XMLHttpRequest){			//发送头部信息
                        XMLHttpRequest.setRequestHeader("AccessToken",""+ AccessToken +"");
                  },
				   success: function(msg){
					 checkAuth(msg);	//检查令牌是否过期
					 if(msg.State==200){
						 myTable.filter();
						 layer.alert("操作成功");
					 }else{
						 layer.alert(msg.Error);
						 return;
					 }
					 
				   }
				});
				
		}
	
	
}

//无弹框	报表
function lanSubmitParam(param,url){
	if(url){
		$.ajax({
			type: "POST",
			url: charts+url,
			contentType: "application/json",
			data:JSON.stringify(param),
			beforeSend: function(XMLHttpRequest){			//发送头部信息
                        XMLHttpRequest.setRequestHeader("AccessToken",""+ AccessToken +"");
                  },
			success: function(msg){
				checkAuth(msg);	//检查令牌是否过期
				
				dataTab("#addyouBb",msg['Result'][0]);
			}
		});

	}


}




	$(".actions").on("click",function(){
			var rs=$(this).parent().next().next().next();
			var res=$(this).parent().next();
			var aa=$(this).parent().next().next();
			if($(this).children("i").hasClass("fa-chevron-down")){
				$(this).children("i").toggleClass("fa-chevron-down");
				$(this).children("i").toggleClass("fa-chevron-up");
			}else{
				$(this).children("i").toggleClass("fa-chevron-up");
				$(this).children("i").toggleClass("fa-chevron-down");
				
			}
			aa.toggle();
			rs.toggle();
			res.toggle();
	});
	
	
	//字典
function onMenu(arr,url,tree){
	var formdata=$("#"+arr).find("form").serializeObject();
		$("#"+arr).modal("hide");	//隐藏modal
		$("#" + arr).on("hidden.bs.modal", function() {
			$(this).removeData("bs.modal");
		});
			$.ajax({
				   type: "POST",
				   url: web_url+url,
				   data:JSON.stringify(formdata), 
				   contentType: "application/json",
				   beforeSend: function(XMLHttpRequest){			//发送头部信息
                        XMLHttpRequest.setRequestHeader("AccessToken",""+ AccessToken +"");
                  },
				   success: function(msg){
					  checkAuth(msg);	//检查令牌是否过期
					 if(msg.State==200){
						 layer.alert("操作成功");
						 var zTreeObj = $.fn.zTree.getZTreeObj("SjzdtreeDemo");
							zTreeObj.destroy();
							$.fn.zTree.init($("#"+tree), treeSetting);
					 }else{
						 layer.alert(msg.Error);
					 }
					 
				   }
				});
	}
	
//表单验证
function validform(id,mc,mes){
 
  return $("#"+id).validate({
		rules : !mc ? {} : mc ,
        messages : !mes ? {} : mes 
  });
}
//点击按钮刷新
$("button[name='refresh']").on("click",function(){
	
	window.location.reload();
});
