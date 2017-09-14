//数据格式化
function format ( d ) {
    
    return '<ul id="myTab" class="nav nav-tabs">'+
				'<li class="active">'+
					'<a href="#sigleCarRun" data-toggle="tab">单车行驶</a>'+
				'</li>'+
				'<li><a href="#sigleCarSpin" data-toggle="tab">单车空转</a></li>'+
				'<li><a href="#sigleCarNotNCon" data-toggle="tab">单车非正常消耗</a></li>'+
				'<li><a href="#sigleCarFuelFill" data-toggle="tab">单车加油</a></li>'+
				'<li><a href="#sigleCarStop" data-toggle="tab">单车停车</a></li>'+
			'</ul>'+
			'<div id="myTabContent" class="tab-content">'+
//单车行驶			
				'<div class="tab-pane fade in active" id="sigleCarRun">'+
					'<table class="table table-striped table-bordered table-hover table-full-width" cellspacing=" style="text-align: center;">'+
						'<thead style="border:white">'+
							'<th >开始时间</th>'+
							'<th >结束时间</th>'+
							'<th >行驶时间</th>'+
							'<th >开始里程</th>'+
							'<th >结束里程</th>'+
							'<th >行驶里程</th>'+
							'<th >油耗</th>'+
							'<th >地图查看</th>'+
						'</thead>'+
						'<tbody>'+
							'<tr style="text-align: center;">'+
								'<td>2017-1-11</td>'+
								'<td>2017-1-12</td>'+
								'<td>12</td>'+
								'<td>8922</td>'+
								'<td>9010</td>'+
								'<td>88</td>'+
								'<td>312e</td>'+
								'<td><a href="#">查看</a></td>'+
							'</tr>'+
							'<tr style="text-align: center;">'+
								'<td>2017-1-11</td>'+
								'<td>2017-1-12</td>'+
								'<td>12</td>'+
								'<td>8922</td>'+
								'<td>9010</td>'+
								'<td>88</td>'+
								'<td>312e</td>'+
								'<td><a href="#">查看</a></td>'+
							'</tr>'+
						'</tbody>'+
					'</table>'+
				'</div>'+
//单车空转				
				'<div class="tab-pane fade" id="sigleCarSpin">'+
					'<table class="table table-striped table-bordered table-hover table-full-width" cellspacing=" style="text-align: center;">'+
						'<thead style="border:white">'+
							'<th >开始时间</th>'+
							'<th >结束时间</th>'+
							'<th >空转时长</th>'+
							'<th >油耗</th>'+
							'<th >地图查看</th>'+
						'</thead>'+
						'<tbody>'+
							'<tr style="text-align: center;">'+
								'<td style="width:110px;">2017-1-11</td>'+
								'<td style="width:110px;">2017-1-12</td>'+
								'<td style="width:110px;">12</td>'+
								'<td style="width:110px;">312e</td>'+
								'<td><a href="#">查看</a></td>'+
							'</tr>'+
							'<tr style="text-align: center;">'+
								'<td>2017-1-11</td>'+
								'<td>2017-1-12</td>'+
								'<td>12</td>'+
								'<td>312e</td>'+
								'<td><a href="#">查看</a></td>'+
							'</tr>'+
						'</tbody>'+
					'</table>'+
				'</div>'+
//单车非正常消耗				
				'<div class="tab-pane fade" id="sigleCarNotNCon">'+
					'<table class="table table-striped table-bordered table-hover table-full-width" cellspacing=" style="text-align: center;">'+
						'<thead style="border:white">'+
							'<th >开始时间</th>'+
							'<th >结束时间</th>'+
							'<th >持续时间</th>'+
							'<th >开始油量</th>'+
							'<th >结束油量</th>'+
							'<th >异常消耗量</th>'+
							'<th >地图查看</th>'+
						'</thead>'+
						'<tbody>'+
							'<tr style="text-align: center;">'+
								'<td>2017-1-11</td>'+
								'<td>2017-1-12</td>'+
								'<td>12</td>'+
								'<td>8922</td>'+
								'<td>9010</td>'+
								'<td>88</td>'+
								'<td><a href="#">查看</a></td>'+
							'</tr>'+
							'<tr style="text-align: center;">'+
								'<td>2017-1-11</td>'+
								'<td>2017-1-12</td>'+
								'<td>12</td>'+
								'<td>8922</td>'+
								'<td>9010</td>'+
								'<td>88</td>'+
								'<td><a href="#">查看</a></td>'+
							'</tr>'+
						'</tbody>'+
					'</table>'+
				'</div>'+
//单车加油				
				'<div class="tab-pane fade" id="sigleCarFuelFill">'+
					'<table class="table table-striped table-bordered table-hover table-full-width" cellspacing=" style="text-align: center;">'+
						'<thead style="border:white">'+
							'<th >开始时间</th>'+
							'<th >结束时间</th>'+
							'<th >持续时间</th>'+
							'<th >开始油量</th>'+
							'<th >结束油量</th>'+
							'<th >加油量</th>'+
							'<th >地图查看</th>'+
						'</thead>'+
						'<tbody>'+
							'<tr style="text-align: center;">'+
								'<td>2017-1-11</td>'+
								'<td>2017-1-12</td>'+
								'<td>12</td>'+
								'<td>8922</td>'+
								'<td>9010</td>'+
								'<td>88</td>'+
								'<td><a href="#">查看</a></td>'+
							'</tr>'+
							'<tr style="text-align: center;">'+
								'<td>2017-1-11</td>'+
								'<td>2017-1-12</td>'+
								'<td>12</td>'+
								'<td>8922</td>'+
								'<td>9010</td>'+
								'<td>88</td>'+
								'<td><a href="#">查看</a></td>'+
							'</tr>'+
						'</tbody>'+
					'</table>'+
				'</div>'+
//单车停车				
				'<div class="tab-pane fade" id="sigleCarStop">'+
					'<table class="table table-striped table-bordered table-hover table-full-width" cellspacing=" style="text-align: center;">'+
						'<thead style="border:white">'+
							'<th >开始时间</th>'+
							'<th >结束时间</th>'+
							'<th >持续时长</th>'+
							'<th >地图查看</th>'+
						'</thead>'+
						'<tbody>'+
							'<tr style="text-align: center;">'+
								'<td>2017-1-11</td>'+
								'<td>2017-1-12</td>'+
								'<td>12</td>'+
								'<td><a href="#">查看</a></td>'+
							'</tr>'+
							'<tr style="text-align: center;">'+
								'<td>2017-1-11</td>'+
								'<td>2017-1-12</td>'+
								'<td>12</td>'+
								'<td><a href="#">查看</a></td>'+
							'</tr>'+
						'</tbody>'+
					'</table>'+
				'</div>'+
			'</div>'
}