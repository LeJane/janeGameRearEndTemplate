//数据格式化
function format ( d ) {
    
    return '<ul id="myTab" class="nav nav-tabs">'+
				'<li class="active"><a id="DefaultsigleCarRun" href="#sigleCarRun'+ d +'"  data-RequestUrl="/OilStatis/CarIdelOilStatisResult"  data-toggle="tab">单车空转</a></li>'+
			'</ul>'+
			'<div id="myTabContent" class="tab-content">'+
//单车空转		
				'<div class="tab-pane fade in active" id="sigleCarSpin'+ d +'">'+
					'<table id="sigleCarSpin'+d+'Table" class="table table-striped table-bordered table-hover table-full-width" cellspacing=" style="text-align: center;">'+
						'<thead style="border:white">'+
							'<th style="min-width:120px">开始时间</th>'+
							'<th style="min-width:120px">结束时间</th>'+
							'<th style="min-width:120px">持续时间</th>'+
							'<th style="min-width:100px">油量消耗</th>'+
							'<th style="min-width:400px">地图查看</th>'+
						'</thead>'+
					'</table>'+
				'</div>'+
			'</div>'
}