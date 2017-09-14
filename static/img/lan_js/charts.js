function chartsTotal(id,param){
    // console.log(param);
    var title={	//标题
        text:param["SubTitle"]
    }
    var subtitle={	//子标题
        text:param["Title"]
    }

    var chart= {
        backgroundColor: '#f7f7f7',
        type: 'line'
    };

    var xAxis={	//X轴
        categories:param['X']

    };

    var yAxis={	//Y轴
        title:{
            text:param['Y']
        },

        plotLines:[{
            value:0,
            width:1,
            color:"#808080"

        }]
    };
	
    var tooltip={
        crosshairs: {
            width: 2,
            color: 'rgb(144, 237, 125)',
            dashStyle: ''
        },
        shared:true
    }

    var legend={
        layout:'vertical',
        align:'right',
        verticalAlign:'middle',
        borderWidth:0,

    };
    var plotOptions={
        series: {
            cursor: 'pointer'
        }
    };

    var series =  [
        {
            name:param['Name'],
            data: param['data']
        },
        {
            name: param['Name2'],
            data: param['data2']
        }
    ];
    var json = {};
    json.chart=chart;
    json.plotOptions= plotOptions;
    json.title = title;
    json.subtitle = subtitle;
    json.xAxis = xAxis;
    json.yAxis = yAxis;
    json.tooltip = tooltip;
    json.legend = legend;
    json.series = series;
    $("#home12").highcharts(json);
};