//数据格式化
function format (d) {
    return '<ul id="myTab" class="nav nav-tabs">'+
				'<li class="active">'+
					'<a href="#sigleCarRun'+ d +'" data-RequestUrl="/OilStatis/CarWorkingOilStatisResult"   data-toggle="tab">单车行驶</a>'+
				'</li>'+
				'<li><a href="#sigleCarSpin'+ d +'"  data-RequestUrl="/OilStatis/CarIdelOilStatisResult"  data-toggle="tab">单车空转</a></li>'+
				'<li><a href="#sigleCarNotNCon'+ d +'" data-RequestUrl="/OilStatis/CarExcetionalOilStatisResult"  data-toggle="tab">单车非正常消耗</a></li>'+
				'<li><a href="#sigleCarFuelFill'+ d +'" data-RequestUrl="/OilStatis/CarAddOilStatisResult"  data-toggle="tab">单车加油</a></li>'+
				'<li><a href="#sigleCarStop'+ d +'" data-RequestUrl="/OilStatis/CarStopStatisResult"  data-toggle="tab">单车停车</a></li>'+
			'</ul>'+
			'<div id="myTabContent" class="tab-content">'+
//单车行驶			
				'<div class="tab-pane fade in active" id="sigleCarRun'+ d +'">'+
					'<table id="sigleCarRun'+d+'Table" class="table table-striped table-bordered table-hover table-full-width" cellspacing=" style="text-align: center;">'+
						'<thead style="border:white">'+
							'<th style="min-width:120px;">开始时间</th>'+
							'<th style="min-width:120px;">结束时间</th>'+
							'<th style="min-width:120px;">行驶时间</th>'+
							'<th style="min-width:70px;">开始里程</th>'+
							'<th style="min-width:70px;">结束里程</th>'+
							'<th style="min-width:70px;">行驶里程</th>'+
							'<th style="min-width:60px;">油耗</th>'+
							'<th style="min-width:300px;">地图查看</th>'+
						'</thead>'+
						
					'</table>'+
				'</div>'+
//单车空转				
				'<div class="tab-pane fade" id="sigleCarSpin'+ d +'">'+
					'<table id="sigleCarSpin'+d+'Table" data-field="beginDateTime,endDateTime,IdelTime,Oil,Posinfo"  class="table table-striped table-bordered table-hover table-full-width" cellspacing=" style="text-align: center;">'+
						'<thead style="border:white">'+
							'<th style="min-width:120px;">开始时间</th>'+
							'<th style="min-width:120px;">结束时间</th>'+
							'<th style="min-width:120px;">空转时长</th>'+
							'<th style="min-width:60px;">油耗</th>'+
							'<th style="min-width:300px;">地图查看</th>'+
						'</thead>'+
						
					'</table>'+
				'</div>'+
//单车非正常消耗				
				'<div class="tab-pane fade" id="sigleCarNotNCon'+ d +'">'+
					'<table id="sigleCarNotNCon'+d+'Table" class="table table-striped table-bordered table-hover table-full-width" cellspacing=" style="text-align: center;">'+
						'<thead style="border:white">'+
							'<th style="min-width:120px;">开始时间</th>'+
							'<th style="min-width:120px;">结束时间</th>'+
							'<th style="min-width:120px;">持续时间</th>'+
							'<th style="min-width:70px;">开始油量</th>'+
							'<th style="min-width:70px;">结束油量</th>'+
							'<th style="min-width:100px;">异常消耗量</th>'+
							'<th style="min-width:300px;">地图查看</th>'+
						'</thead>'+
					'</table>'+
				'</div>'+
//单车加油				
				'<div class="tab-pane fade" id="sigleCarFuelFill'+ d +'">'+
					'<table id="sigleCarFuelFill'+d+'Table" class="table table-striped table-bordered table-hover table-full-width" cellspacing=" style="text-align: center;">'+
						'<thead style="border:white">'+
							'<th style="min-width:120px;">开始时间</th>'+
							'<th style="min-width:120px;">结束时间</th>'+
							'<th style="min-width:120px;">持续时间</th>'+
							'<th style="min-width:70px;">开始油量</th>'+
							'<th style="min-width:70px;">结束油量</th>'+
							'<th style="min-width:60px;">加油量</th>'+
							'<th style="min-width:300px;">地图查看</th>'+
						'</thead>'+
					'</table>'+
				'</div>'+
//单车停车				
				'<div class="tab-pane fade" id="sigleCarStop'+ d +'">'+
					'<table id="sigleCarStop'+d+'Table" class="table table-striped table-bordered table-hover table-full-width" cellspacing=" style="text-align: center;">'+
						'<thead style="border:white">'+
							'<th style="min-width:120px;">开始时间</th>'+
							'<th style="min-width:120px;">结束时间</th>'+
							'<th style="min-width:120px;">持续时长</th>'+
							'<th style="min-width:300px;">地图查看</th>'+
						'</thead>'+
					'</table>'+
				'</div>'+
			'</div>'
}