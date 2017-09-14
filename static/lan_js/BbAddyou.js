
//数据格式化
function format ( d ) {
    return '<ul id="myTab" class="nav nav-tabs">'+
				'<li class="active"><a href="#sigleCarFuelFill'+ d +'" data-RequestUrl="/OilStatis/CarAddOilStatisResult"  data-toggle="tab">单车加油</a></li>'+
			'</ul>'+
			'<div id="myTabContent" class="tab-content">'+
//单车加油
			'<div class="tab-pane fade in active" id="sigleCarFuelFill'+ d +'">'+
				'<table id="sigleCarFuelFill'+d+'Table" class="table table-striped table-bordered table-hover table-full-width" cellspacing=" style="text-align: center;">'+
					'<thead style="border:white">'+
						'<th style="min-width:120px">开始时间</th>'+
						'<th style="min-width:120px">结束时间</th>'+
						'<th style="min-width:120px">持续时间</th>'+
						'<th style="min-width:70px">开始油量</th>'+
						'<th style="min-width:70px">结束油量</th>'+
						'<th style="min-width:70px">变化量</th>'+
						'<th style="min-width:140px">地图查看</th>'+
					'</thead>'+
				'</table>'+
			'</div>'+
		'</div>'
}