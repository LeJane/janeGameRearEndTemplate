var dataScrollHeight=0;

//设置panel-body的动态高度
function setPanelHeight(){
	var TotalHeight=$(window).height();		//窗体高度

	SetH=TotalHeight-220;
	
	url=window.location.href;		//网页路径
	
	var patt1=new RegExp("/Ath/index");
	
	if(parseInt($(window).width())>1400){
	
		
		$(".panel-body").css({"min-height":SetH+"px"});
		
		$(".panel-body").css({"max-height":SetH+"px"});
		
		$(".panelCarBg").css({"height":SetH-129+"px"})
		$(".panelCarBg ul").css({"height":SetH-129+"px"})
		dataScrollHeight=SetH-155;
		$(".dataTables_scrollBody").css({"max-height":dataScrollHeight+"px"})
	}else{
		
		$(".panel-body").css({"min-height":SetH+"px"});
		$(".panel-body").css({"max-height":SetH+"px"});
		
		$(".panelCarBg").css({"height":SetH-129+"px"})
		$(".panelCarBg ul").css({"height":SetH-129+"px"})
		dataScrollHeight=SetH-155;
		
		$(".dataTables_scrollBody").css({"max-height":dataScrollHeight+"px"})
	}
	
	if(patt1.test(url)){

		SetH=TotalHeight;		//总高度
		var one=((SetH-20)/2);
		var two=one-38;
		
		// 角色表格
		$(".panel-body").css({"min-height":SetH+"px"});
		$(".panel-body").css({"max-height":SetH+"px"});
		
		// one
		$("#AthOne .panel-body").css({"min-height":one+"px"});
		$("#AthOne .panel-body").css({"max-height":one+"px"});
		
		// two
		$("#AthTwo .panel-body").css({"min-height":two+"px"});
		$("#AthTwo .panel-body").css({"max-height":two+"px"});
		
		dataScrollHeight=two-133;
		$("#AthTwo .dataTables_scrollBody").css({"max-height":dataScrollHeight+"px"})
		$("#AthOne .dataTables_scrollBody").css({"max-height":dataScrollHeight+"px"})
		
		
	}
	

}

$(function(){
	setPanelHeight();
})