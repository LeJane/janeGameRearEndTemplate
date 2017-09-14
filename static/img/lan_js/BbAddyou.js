//油耗信息
var Oil=[
['','川运98971','20','3'],
['','川运98972','20','3'],
['','川运98973','20','3'],
['','川运98974','20','3'],
['','川运98975','20','3'],
['','川运98976','20','3'],
['','川运98977','20','3'],
['','川运98978','20','3'],
['','川运98979','20','3'],
['','川运98979','20','3'],
['','川运98979','20','3'],
['','川运98979','20','3'],
['','川运98979','20','3'],
['','川运98979','20','3'],
['','川运98979','20','3'],
['','川运98979','20','3'],
];
		
		
		
		//表格数据
		var DataTable=$('#yhtjbb').DataTable({
		"data": Oil,
        // 语言
        "language" : {
            "search" : "搜索:",
            "processing" : "处理中...",
            "loadingRecords" : "加载中...",
            "lengthMenu" : "每页 _MENU_ 条记录",
            "info" : "第 _START_ 至 _END_ 条记录，共 _TOTAL_  条",
            "infoEmpty" : "无记录",
            "infoFiltered" : "(从 _TOTAL_ 条记录中过滤)",
            "emptyTable" : "没有数据可以展示",
            "zeroRecords" : "没有数据可以展示",
            "paginate" : {
                "first" : "首页",
                "previous" : "上一页",
                "next" : "下一页",
                "last" : "末页"
            }
        },
        "dom" : "t" + "<'row'<'col-md-3 col-sm-12 col-xs-12'l><'col-md-4 col-sm-12 col-xs-12'i><'col-md-5 col-sm-12 col-xs-12'p>>",
         "scrollX": "auto",
		 "ScrollXInner":"110%",
        "bAutoWidth": true,  //是否自适应宽度
		'bScrollCollapse':true,
		 // "scrollY":"400px",
		 "searching" : true, // 搜索
		 "bFilter":true,
        // 分页相关
        "paging" : true,
     //   "pagingType" : "full_numbers", // 分页样式
        "lengthChange" : 10,// 切换每页数据大小
        "info" : false,
        "pageLength" : 10, // 默认每页数据量
        "lengthMenu" : [ 10, 20, 50, 100, 200 ],
        "ordering" : false, // 禁用排序
        // 服务端
        "processing" : "正在加载数据...",
        "serverSide" : false,
        // "ajax" : {
                // "url" : tg_table.listUrl,
                // "iDisplayLength":true,
                // "type" : "POST", // post方式请求
                // "data" : tg_table.ajaxDataParamFun,
                // "dataFilter": function(data){

                // var json = jQuery.parseJSON( data );
                // json.recordsTotal= json.recordsTotal;
                // json.recordsFiltered = json.recordsFiltered;
                // json.data = json.data;
                // return JSON.stringify( json ); // return JSON string
                // }

			// },
			// "columns": [
				// { "title": "CarNo" },
				// { "title": "AddOilSum" },
				// { "title": "AddOilTotal" },
				// { "title": "ExcetionalOilExpendSum", "class": "center" },
				// { "title": "ExcetionalOilExpendTotal", "class": "center" },
				// { "title": "WorkingOilExpendSum" },
				// { "title": "WorkingDistance" },
				// { "title": "IdleTime" },
				// { "title": "IdleOilExpendTotal", "class": "center" },
				// { "title": "StopTime", "class": "center" },
				// { "title": "HundredKilmeteOilExpend" },
				// { "title": "WorkingTime" },
				// { "title": "WorkingThan" },
				// { "title": "IdleThan", "class": "center" },
				// { "tsoe.itle": "StopThan", "class": "center" },
			// ]
			//多语言配置
           // set the initial value
           "fnCreatedRow": function(nRow, aData, iDataIndex) {
               $('td:eq(0)', nRow).html("<span class='row-details row-details-close' data_id='" + aData[1] + "'></span>&nbsp;" + aData[0]);
           }
			
       
        });
		$('.table').on('click', 'tbody td .row-details',
		   function() {
			   
			   var nTr = $(this).parents('tr')[0];
			   console.log(nTr);
			   
			    var tr = $(this).closest('tr');
				var row = DataTable.row( tr );
			   if ($(this).hasClass("row-details-open")) //判断是否已打开
			   {
				   row.child.hide();
				   /* This row is already open - close it */
				   $(this).addClass("row-details-close").removeClass("row-details-open");
			   } else {
				   /* Open this row */
				   row.child( format(row.data()) ).show();
				   $(this).addClass("row-details-open").removeClass("row-details-close");

			   }
		   });
			
		//表格数据
//$(function(){
//	  $("#StartDate").val(tYear+"-"+tMonth+"-"+tDate + " "+"00:00:00");
//	  $("#EndDate").val(tYear+"-"+tMonth+"-"+tDate +" "+"23:59:59");
//});


//数据格式化
function format ( d ) {
    
    return '<ul id="myTab" class="nav nav-tabs">'+
				'<li class="active"><a href="#sigleCarRun" data-toggle="tab">单车加油</a></li>'+
			'</ul>'+
			'<div id="myTabContent" class="tab-content">'+
//单车行驶			
				'<div class="tab-pane fade in active" id="sigleCarRun">'+
					'<table class="table table-striped table-bordered table-hover table-full-width" cellspacing=" style="text-align: center;">'+
						'<thead style="border:white">'+
							'<th >开始时间</th>'+
							'<th >结束时间</th>'+
							'<th >持续时间</th>'+
							'<th >开始油量</th>'+
							'<th >结束油量</th>'+
							'<th >变化量</th>'+
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
			'</div>'
}