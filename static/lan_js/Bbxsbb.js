//数据格式化
function format ( d ) {
    return '<ul id="myTab" class="nav nav-tabs">'+
				'<li class="active">'+
					'<a id="" href="#sigleCarRun'+ d +'" data-RequestUrl="/OilStatis/CarWorkingOilStatisResult"   data-toggle="tab">单车行驶</a>'+
				'</li>'+
			'</ul>'+
			'<div id="myTabContent" class="tab-content">'+
//单车行驶			
				'<div class="tab-pane fade in active" id="sigleCarRun'+ d +'">'+
					'<table id="sigleCarRun'+d+'Table" class="table table-striped table-bordered table-hover table-full-width" cellspacing=" style="text-align: center;">'+
						'<thead style="border:white">'+
							'<th style="min-width:120px">开始时间</th>'+
							'<th style="min-width:120px">结束时间</th>'+
							'<th style="min-width:100px">持续时间</th>'+
							'<th style="min-width:50px">里程</th>'+
							'<th style="min-width:50px">消耗</th>'+
							'<th style="min-width:320px">地图查看</th>'+
						'</thead>'+
					'</table>'+
				'</div>'+
			'</div>'
}