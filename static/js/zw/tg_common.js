var AccessToken="";	//AccessToken




$(function(){
	AccessToken=$("#AccessToken").val();
	// setPanelHeight();
	
	// alert(dataScrollHeight);

});






var Dep="";
var Charts= new Object();
// 弹出窗口
toastr.options = {
    closeButton : true,
    debug : false,
    progressBar : true,
    positionClass : 'toast-top-right',
    timeOut : 2000
};
// 操作成功
function tg_alertSuccess(title, message) {
    toastr.success(!title ? '操作成功' : title, !message ? '恭喜您，操作成功！' : message);
}
// 系统消息
function tg_alertInfo(title, message) {
    toastr.info(!title ? '系统消息' : title, !message ? '系统消息!' : message);
}
// 系统警告
function tg_alertWarning(title, message) {
    toastr.warning(!title ? '系统警告' : title, !message ? '系统警告!' : message);
}
// 系统错误
function tg_alertError(title, message) {
	tg_confirmDialog(!title ? '系统错误' : title, !message ? '对不起，操作失败！' : message);
  //  toastr.error(!title ? '系统错误' : title, !message ? '对不起，操作失败！' : message);
}
// tg_confirmDialog
function tg_confirmDialog(title, message, okCallbackFun, cancelCallbackFun) {

    layer.confirm(!message ? '您确定要执行该操作吗？！' : message, {
        title : !title ? '操作确认' : title,
        icon : 3, // 问号图标
        move : false,//禁止拖动
        btn : [ '确定', '取消' ]
    }, function() {
        // 确定按钮操作
        if (okCallbackFun) {
            okCallbackFun();
        }
        layer.closeAll(); // 关闭layer
    }, function() {
        // 取消按钮操作
        if (cancelCallbackFun) {
            cancelCallbackFun();
        }
    });
}
// 基本表单ajax 提交
function tg_baseFormAjaxSubmit(formId, rules, messages, sucCallbackFun, failCallbackFun) {
    var sucCallback = function(responseText, statusText) {
        if (responseText.success) {
            if (sucCallbackFun) {
                sucCallbackFun(); // 回调函数
            } else {
                tg_alertSuccess();
            }
        } else {
            form.attr("checkSubmitFlag", false);
            if (failCallbackFun) {
                failCallbackFun(); // 回调函数
            } else {
                tg_alertError('操作失败', responseText.msg);
            }
        }
    };
    var options = {
        success : sucCallback, // 提交后的回调函数
        dataType : 'json', // 接受服务端返回的类型
        clearForm : true, // 成功提交后，清除所有表单元素的值
        resetForm : true, // 成功提交后，重置所有表单元素的值
        timeout : 5000
    };
    var form = $("#" + formId);
    // 表单验证
    var validator = form.validate({
        rules : !rules ? {} : rules,
        messages : !messages ? {} : messages,
        // errorPlacement : function(error, element) {
        // error.insertBefore(element.parent());
        // },
        submitHandler : function(f) {
            if (!form.attr("checkSubmitFlag")) {
                form.attr("checkSubmitFlag", true);
                form.ajaxSubmit(options);
            }
        }
    });
    return false; // 阻止表单默认提交
}
// 表单窗口ajax 提交
function tg_formWinAjaxSubmit(formModalId, formId, rules, messages, sucCallbackFun, failCallbackFun) {
    var formModal = $("#" + formModalId);
    var form = $("#" + formId);
    var callbackFun = function() {
        tg_alertSuccess();
        form[0].reset();
        formModal.modal("hide");
        formModal.removeData("bs.modal");
        if (sucCallbackFun) {
            sucCallbackFun(); // 回调函数
        }
    };
    tg_baseFormAjaxSubmit(formId, rules, messages, callbackFun, failCallbackFun);
}
// 简单Ajax Post操作数据
function tg_simpleAjaxPost(url, parms, sucCallbackFun, failCallbackFun) {
	
    $.ajax({
        url : url,
        type : 'POST',
        data : JSON.stringify(parms),
		contentType:"application/json",
        error : function() {
            tg_alertError();
        },
		beforeSend: function(XMLHttpRequest){			//发送头部信息
					XMLHttpRequest.setRequestHeader("AccessToken",""+ AccessToken +"");
			  },
        success : function(d) {
				checkAuth(d);	//检查令牌是否过期
				var result=d;
            if (result.State==200) {
                if (sucCallbackFun) {
                    sucCallbackFun(d); // 回调函数
                } else {
                    tg_alertSuccess();
                }
            } else {
                if (failCallbackFun) {
                    failCallbackFun(d); // 回调函数
                } else {
                    tg_alertError('操作失败', result.Error);
                }
            }
        }
    });
}
// 删除
function tg_dleteItem(url, parms,sucCallbackFun, failCallbackFun) {

    var okCallbackFun = function() {

        tg_simpleAjaxPost(url, parms, sucCallbackFun, failCallbackFun);
    };
	tg_confirmDialog(null, "您确定要删除该条数据吗？", okCallbackFun);
}
//批量删除
function tg_dleteItems(url,parms, sucCallbackFun, failCallbackFun) {
    var okCallbackFun = function() {
        tg_simpleAjaxPost(url, parms, sucCallbackFun, failCallbackFun);
    };
 
 tg_confirmDialog(null, "您确定要删除所选数据吗？", okCallbackFun);
}
// 修改是否可用
function tg_changeEnabled(c, id, enableUrl, disableUrl, sucCallbackFun) {
    if (c.checked) {// 原来禁用 现在启用
        // 操作失败还原按钮状态
        var failCallbackFun1 = function() {
            // $(c).trigger("click");
            c.checked = false;
            $(c).bootstrapToggle('destroy');
            $(c).bootstrapToggle();
        };
        // 确定操作
        var okCallbackFun1 = function() {
            tg_simpleAjaxPost(enableUrl, null, sucCallbackFun, failCallbackFun1);
        };
        tg_confirmDialog(null, "您确定要启用该条数据吗？", okCallbackFun1, failCallbackFun1);
    } else { // 原来启用 现在停用
        // 操作失败还原按钮状态
        var failCallbackFun = function() {
            c.checked = true;
            $(c).bootstrapToggle('destroy');
            $(c).bootstrapToggle();
        };
        // 确定操作
        var okCallbackFun = function() {
            tg_simpleAjaxPost(disableUrl, null, sucCallbackFun, failCallbackFun);
        };
        tg_confirmDialog(null, "您确定要停用该条数据吗？", okCallbackFun, failCallbackFun);
    }
}
// 创建表格
var myDataTable;
var myDataTableSort;

function tg_createTable(tg_table) {
	layer.load(2, {
	  shade: [0.3,'#cccccc'] 
	});
    var pageable = tg_table.pageable;
    var lengthChange = true;
    var info = true;
    if (!pageable) {
        lengthChange = false;
        info = false;
    }
    myDataTable = $('#' + tg_table.dataTableDiv).on( 'init.dt', function () {
    	layer.closeAll('loading'); 
    } ).DataTable({
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
        "AutoWidth": true,  //是否自适应宽度
		'bScrollCollapse':true,
		 "scrollY":"500px",
		 "searching" : true, // 搜索
		 "bFilter":true,
        // 分页相关
        "paging" : pageable,
     //   "pagingType" : "full_numbers", // 分页样式
        "lengthChange" : lengthChange,// 切换每页数据大小
        "info" : true,
        "pageLength" : 10, // 默认每页数据量
        "lengthMenu" : [ 10, 20, 50, 100, 200 ],
        "ordering" : false, // 禁用排序
        // 服务端
        "processing" : true,
        "serverSide" : true,
        "ajax" : {
            "url" : tg_table.listUrl,
			"iDisplayLength":true,
            "type" : "POST", // post方式请求
            "data" : tg_table.ajaxDataParamFun,
            "dataFilter": function(data){


            var json = jQuery.parseJSON( data );
                if(tg_table.editUrl=="http://118.178.181.4:8001/api"){
                    Charts=json;
                    chartsAddyou(Charts);
                }
            json.recordsTotal= json.recordsTotal;
            json.recordsFiltered = json.recordsFiltered;
            json.data = json.data;
            return JSON.stringify( json ); // return JSON string
			}

			},
        "columnDefs" : tg_table.columnDefs,
        "columns" : tg_table.columns
        });
		
		
		
    // 把dataTable赋给tg_table
    tg_table.dataTable = myDataTable;

    // 渲染事件
    myDataTable.on('draw', function(e, settings, json) {
        // 修改是否可用
        if (tg_table.enabledChange) {
            $('.js-switch').bootstrapToggle();
        }
        // 第一列索引列
        if (tg_table.showIndexColumn) {
            var info = myDataTable.page.info();
            myDataTable.column(0, {
                search : 'applied',
                order : 'applied'
            }).nodes().each(function(cell, i) {
                cell.innerHTML = info.start + i + 1;
            });
        }
        // 回调
        if (tg_table.drawCallbackFun) {
            tg_table.drawCallbackFun();
        }
    });
    //显示隐藏列
    $('.toggle-vis').on('change', function (e) {
        e.preventDefault();
        /*console.log($(this).attr('data-column'));*/
        var column =  myDataTable.column($(this).attr('data-column'));
        column.visible(!column.visible());
    });
    //权限显示
    var flag =  $('#permission').val();
	 if(flag=="false"){
		 for(var i = 1; i< 3; i++){
				var columnTr = myDataTable.column(i);
				columnTr.visible(!columnTr.visible());
			};	
	 }
	/*$('#AddDelete').click(function() {
		
	});*/
   }
   
   // 第二个表格
   function tg_createTableSort(tg_table) {
	layer.load(2, {
	  shade: [0.3,'#cccccc'] 
	});
    var pageable = tg_table.pageable;
    var lengthChange = true;
    var info = true;
    if (!pageable) {
        lengthChange = false;
        info = false;
    }
    myDataTableSort = $('#' + tg_table.dataTableDiv).on( 'init.dt', function () {
    	layer.closeAll('loading'); 
    } ).DataTable({
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
		 "scrollY":"200px",
		 "searching" : true, // 搜索
		 "bFilter":true,
        // 分页相关
        "paging" : pageable,
     //   "pagingType" : "full_numbers", // 分页样式
        "lengthChange" : lengthChange,// 切换每页数据大小
        "info" : false,
        "pageLength" : 10, // 默认每页数据量
        "lengthMenu" : [ 10, 20, 50, 100, 200 ],
        "ordering" : false, // 禁用排序
        // 服务端
        "processing" : true,
        "serverSide" : true,
        "ajax" : {
            "url" : tg_table.listUrl,
			"iDisplayLength":true,
            "type" : "POST", // post方式请求
            "data" : tg_table.ajaxDataParamFun,
            "dataFilter": function(data){
            var json = jQuery.parseJSON( data );
            json.recordsTotal= json.recordsTotal;
            json.recordsFiltered = json.recordsFiltered;
            json.data = json.PersonData;
            return JSON.stringify( json ); // return JSON string
			}

			},
        "columnDefs" : tg_table.columnDefs,
        "columns" : tg_table.columns
        });
		
		
		
    // 把dataTable赋给tg_table
    tg_table.dataTable = myDataTableSort;

    // 渲染事件
    myDataTableSort.on('draw', function(e, settings, json) {
        // 修改是否可用
        if (tg_table.enabledChange) {
            $('.js-switch').bootstrapToggle();
        }
        // 第一列索引列
        if (tg_table.showIndexColumn) {
            var info = myDataTableSort.page.info();
            myDataTableSort.column(0, {
                search : '',
                order : ''
            }).nodes().each(function(cell, i) {
				
                cell.innerHTML = info.start + i + 1;
				cell.innerHTML =i + 1;
            });
        }
        // 回调
        if (tg_table.drawCallbackFun) {
            tg_table.drawCallbackFun();
        }
    });
    //显示隐藏列
    $('.toggle-vis').on('change', function (e) {
        e.preventDefault();
        /*console.log($(this).attr('data-column'));*/
        var column =  myDataTableSort.column($(this).attr('data-column'));
        column.visible(!column.visible());
    });
    //权限显示
    var flag =  $('#permission').val();
	 if(flag=="false"){
		 for(var i = 1; i< 3; i++){
				var columnTr = myDataTableSort.column(i);
				columnTr.visible(!columnTr.visible());
			};	
	 }
	/*$('#AddDelete').click(function() {
		
	});*/
   }
   
   // 第三个
   var myDataTableSortAth;
    // 第二个表格
   function tg_createTableSortAth(tg_table) {
	layer.load(2, {
	  shade: [0.3,'#cccccc'] 
	});
    var pageable = tg_table.pageable;
    var lengthChange = true;
    var info = true;
    if (!pageable) {
        lengthChange = false;
        info = false;
    }
    myDataTableSortAth = $('#' + tg_table.dataTableDiv).on( 'init.dt', function () {
    	layer.closeAll('loading'); 
    } ).DataTable({
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
		 "scrollY":"200px",
		 "searching" : true, // 搜索
		 "bFilter":true,
        // 分页相关
        "paging" : pageable,
     //   "pagingType" : "full_numbers", // 分页样式
        "lengthChange" : lengthChange,// 切换每页数据大小
        "info" : false,
        "pageLength" : 10, // 默认每页数据量
        "lengthMenu" : [ 10, 20, 50, 100, 200 ],
        "ordering" : false, // 禁用排序
        // 服务端
        "processing" : true,
        "serverSide" : true,
        "ajax" : {
                "url" : tg_table.listUrl,
                "iDisplayLength":true,
                "type" : "POST", // post方式请求
                "data" : tg_table.ajaxDataParamFun,
                "dataFilter": function(data){

                var json = jQuery.parseJSON( data );
                json.recordsTotal= json.recordsTotal;
                json.recordsFiltered = json.recordsFiltered;
                json.data = json.data;
                return JSON.stringify( json ); // return JSON string
                }

			},
        "columnDefs" : tg_table.columnDefs,
        "columns" : tg_table.columns
        });
		
		
		
    // 把dataTable赋给tg_table
    tg_table.dataTable = myDataTableSortAth;

    // 渲染事件
    myDataTableSortAth.on('draw', function(e, settings, json) {
        // 修改是否可用
        if (tg_table.enabledChange) {
            $('.js-switch').bootstrapToggle();
        }
        // 第一列索引列
        if (tg_table.showIndexColumn) {
            var info = myDataTableSortAth.page.info();
		
            myDataTableSortAth.column(0, {
                search : '',
                order : ''
            }).nodes().each(function(cell, i) {
				
                cell.innerHTML = info.start + i + 1;
				cell.innerHTML =i + 1;
            });
        }
		
        // 回调
        if (tg_table.drawCallbackFun) {
            tg_table.drawCallbackFun();
        }
    });
    //显示隐藏列
    $('.toggle-vis').on('change', function (e) {
        e.preventDefault();
        /*console.log($(this).attr('data-column'));*/
        var column =  myDataTableSortAth.column($(this).attr('data-column'));
        column.visible(!column.visible());
    });
    //权限显示
    var flag =  $('#permission').val();
	 if(flag=="false"){
		 for(var i = 1; i< 3; i++){
				var columnTr = myDataTableSortAth.column(i);
				columnTr.visible(!columnTr.visible());
			};	
	 }
	/*$('#AddDelete').click(function() {
		
	});*/
   }
   
   
   
   
   
// 创建公共表格
var TG_Tabel = {
    createNew : function(option) {
        var tg_table = {};
        tg_table.listUrl = option.listUrl; // 请求url
        tg_table.editUrl = option.editUrl; // 修改url
        tg_table.detailUrl=option.detailUrl;//详情
        tg_table.deleteUrl = option.deleteUrl; // 删除url
        tg_table.deletemoreUrl=option.deletemoreUrl//批量删除url
        tg_table.enableUrl = option.enableUrl; // 启用url
        tg_table.disableUrl = option.disableUrl; // 停用
        tg_table.columnDefs = option.columnDefs; // 列定义
        tg_table.columns = option.columns; // 列
        tg_table.ajaxDataParamFun = option.ajaxDataParamFun; // 列
        tg_table.dataTableDiv = option.dataTableDiv; // 渲染表格的div
        tg_table.showIndexColumn = option.showIndexColumn; // 是否显示第一列的索引列
        tg_table.pageable = option.pageable; // 是否分页
        tg_table.enabledChange = option.enabledChange; // 可用状态修改
        tg_table.suffix = !option.suffix ? '.php' : option.suffix; // 后缀，默认.gsp
        // 成功后回调
        var drawCallbackFun = function() {
            if (option.drawCallbackFun) {
                option.drawCallbackFun();
            }
        };
        tg_table.drawCallbackFun = drawCallbackFun;
        // 初始化
        tg_table.init = function() {
            tg_createTable(tg_table); // 创建表格
        };
		
		 // 初始化
        tg_table.initSort = function() {
            tg_createTableSort(tg_table); // 创建表格
        };
				 // 初始化
        tg_table.initSortAth = function() {
            tg_createTableSortAth(tg_table); // 创建表格
        };
		
        // 刷新
        tg_table.refresh = function() {
            tg_table.dataTable.ajax.reload(); // 重新加载数据
        };
		//选中行
		$('#dataTable tbody').on( 'click', 'button', function () {
			console.log( tg_table.dataTable.row( this ).data() );
		});
        // 过滤
        tg_table.filter = function() {
            tg_table.refresh(); // 重新加载数据
        };
        // 新增
        tg_table.add = function(windowId, formId, rules, messages) {
            tg_formWinAjaxSubmit(windowId, formId, rules, messages, tg_table.refresh);
        };
        // 删除p------>组
        tg_table.deleteGroup = function(id) {
		
			var parms={
				'Code':id
			};
            var deleteUrlPath = tg_table.deleteUrl;
            var sucCallbackfun = function() {
        		tg_alertSuccess();
        		tg_table.refresh();
            };
            
            tg_dleteItem(deleteUrlPath,parms,sucCallbackfun);
        };
		
		// 删除p------>配置
        tg_table.delConfig = function(id) {
			var parms={
				'Lic':lin,
				'LicKey':key,
				'Id':id
			};
            var deleteUrlPath = tg_table.deleteUrl;
            var sucCallbackfun = function() {
        		tg_alertSuccess();
        		tg_table.refresh();
            };
            
            tg_dleteItem(deleteUrlPath,parms,sucCallbackfun);
        };
		
		
		
		 // 删除---->公用
        tg_table.deleteItem = function(parms) {
            var deleteUrlPath = tg_table.deleteUrl;
            var sucCallbackfun = function() {
        		tg_alertSuccess();
        		tg_table.refresh();
            };
            
            tg_dleteItem(deleteUrlPath,parms,sucCallbackfun);
        };
		
		
		
        //批量删除
        tg_table.deleteItems = function(parms) {
            var deletemoreUrlPath = tg_table.deletemoreUrl;
            var sucCallbackfun = function() {
                tg_alertSuccess();
                tg_table.refresh();
            };
            tg_dleteItems(deletemoreUrlPath,parms, sucCallbackfun);
        };
        // 修改是否可用
        tg_table.changeEnabled = function(c, id) {
            var enableUrlPath = tg_table.enableUrl + id + tg_table.suffix;
            var disableUrlPath = tg_table.disableUrl + id + tg_table.suffix;
            tg_changeEnabled(c, id, enableUrlPath, disableUrlPath);
        };

		//点击行
		 tg_table.clickRow=function(id){
						 //给行绑定选中事件
						 var param=[];
				 $('#'+id+' tbody').on( 'click', 'tr', function () {
					 var info=myDataTable.rows(this).data();
						Dep=info[0]['Code'];
						// $("#ath_list").DataTable( {
							// destroy: true,
							// searching: false
						// });
						
						//rs();
					if ($(this).hasClass('selected')) {
						$(this).removeClass('selected');
					}
					else {
						myDataTable.$('tr.selected').removeClass('selected');
						$(this).addClass('selected');
					}
					
	
					
					
				}); 
				
		 }
        return tg_table;
    }
};
function lan(msg){
	console.log(msg);
}

// 锁定成功，弹出解锁对话框
var lockSucPrompt = function(logoutUrl, unlockUrl) {
    layer.prompt({
        formType : 1,
        closeBtn : 0,
        btn : [ '解除锁定', '重新登录' ], // 可以无限个按钮
        title : "系统已锁定，请输入密码解锁！",
        btn2 : function() {
            window.location.href = logoutUrl;
            return false;
        },
    }, function(value, index, elem) {
        if (value) {
            if (value.length < 6) {
                tg_alertError("解锁失败", "密码太短，请重新输入！");
            } else if (value.length > 25) {
                tg_alertError("解锁失败", "密码太长，请重新输入！");
            } else {
                var parms = {
                    userPass : value
                };
                tg_simpleAjaxPost(unlockUrl, parms, function() {
                    tg_alertSuccess("解锁成功", "密码正确，解锁成功！");
                    layer.close(index);
                }, function() {
                    tg_alertError("解锁失败", "密码不正确，请重新输入！");
                    return false;
                });
            }
        }
    });
};
// 锁定系统屏幕
function tg_lock(lockUrl, logoutUrl, unlockUrl) {
    // 成功回调操作
    var sucCallbackFun = function() {
        lockSucPrompt(logoutUrl, unlockUrl);
    };
    tg_simpleAjaxPost(lockUrl, null, sucCallbackFun, null);
}
// 检查锁定系统屏幕
function tg_checkLock(checkLockUrl, logoutUrl, unlockUrl) {
    // 锁定回调操作
    var sucCallbackFun = function() {
        lockSucPrompt(logoutUrl, unlockUrl);
    };
    // 未锁定回调操作
    var falseCallbackFun = function() {
    };
    tg_simpleAjaxPost(checkLockUrl, null, sucCallbackFun, falseCallbackFun);
}
//按钮自适应
var btnWhiteID = "";
$(".btn-white").click(function(){  
	btnWhiteID = $(this).parent().siblings("input").attr("id");
	var width = $(this).parent().parent().parent().width();
	var widthInput = $(this).parent().siblings("input").width() + 25;
	$('.dropdown-menu').css({
		"min-width": "0px",
		"width" : width + "px",
		"left" : -widthInput + "px"
	});
});
$(window).resize(function(){
	if(btnWhiteID == ""){
		return false;
	}
	setWidth(btnWhiteID,'dropdown-menu');
});
$("#toggle-left").bind("click",function(){
	if(btnWhiteID == ""){
		return false;
	}
	setTimeout(function(){setWidth(btnWhiteID,'dropdown-menu')},300)
});
//按钮自适应 end
//自适应宽度
function setWidth(classOne,classTwo){
	var width = $("#" + classOne).parent().width();
	var widthInput = $("#" + classOne).width() + 25;
	$('.' + classTwo).css({
		"min-width": "0px",
		"width" : width + "px",
		"left" : -widthInput + "px"
	});
}  

	//用户令牌过期检测
	function checkAuth(param){
		
		if(param['Error']=="用户令牌失效."){
			
				$.post(wear+"Login/logout");	//销毁服务端session;
			
				alert(param['Error']);
				
				window.location.href= wear+'Login/index?yan=409358034594';
				
			
		}else if(param['Error']=="用户令牌过期."){
			
				$.post(wear+"Login/logout"); //销毁服务端session;
				
				alert(param['Error']);
				
				window.location.href= wear+'Login/index?expire=89631259879349723';

			
		}
		return false;
	}