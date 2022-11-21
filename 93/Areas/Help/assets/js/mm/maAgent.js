//添加码入库

var autoReload2 = 1;//默认自动刷新
var tableListData4;
var tableListData5;
$(document).ready(function () {

    //添加账号
    $(document).on("click", "#addAgentUser", function () {
        var FenUid = $('#FenUid').val();
        var FenNote = $('#FenNote').val();
        var FenPwd = $('#FenPwd').val();
        var FenZfbTotal = ($('#FenZfbTotal').val() * 0.01).toFixed(6);
        var FenZfbAgent = ($('#FenZfbAgent').val() * 0.01).toFixed(6);
        var FenZfbNewer = ($('#FenZfbNewer').val() * 0.01).toFixed(6);
        var FenWechatTotal = ($('#FenWechatTotal').val() * 0.01).toFixed(6);
        var FenWechatAgent = ($('#FenWechatAgent').val() * 0.01).toFixed(6);
        var FenWechatNewer = ($('#FenWechatNewer').val() * 0.01).toFixed(6);
        var FenJuheTotal = ($('#FenJuheTotal').val() * 0.01).toFixed(6);
        var FenJuheAgent = ($('#FenJuheAgent').val() * 0.01).toFixed(6);
        var FenJuheNewer = ($('#FenJuheNewer').val() * 0.01).toFixed(6);
        var YesMaShang =1;
        if ($('#YesMaShang').is(':checked')) {
            YesMaShang = 2;
        }      

        msgtxt = {
            USER_ID: FenUid, USER_NAME: FenNote, Password: FenPwd,
            alipayFl: FenZfbTotal, alipayAgentFl: FenZfbAgent, alipayNewUserFl: FenZfbNewer,
            wechatFl: FenWechatTotal, wechatAgentFl: FenWechatAgent, wechatNewUserFl: FenWechatNewer,
            juheFl: FenJuheTotal, juheAgentFl: FenJuheAgent, juheNewUserFl: FenJuheNewer,
            UserKind: YesMaShang
        };

        hub.server.addAgentUserInfo(msgtxt).done(function (result) {
            if (result == "ok") {
                alert('添加成功!');
                loadRunsData();
            } else {
                alert('添加失败:'+result);
            }
        }).fail(function (err) {
            alert('添加错误错误：' + err);
        });

     

    });

    //激活跑分账号
    $(document).on("click", ".jihuoRunner", function () {     
        var myid = $(this).attr('data-id');
        xtip_win_runner(myid);
    });
    //处理充值列表
    $(document).on("click", ".dealBankOrders", function () {
        var myid = $(this).attr('data-id');
        xtip_win_BankOrders(myid);
    });
/*
    //给每一行添加展开或收起的监听
    $('#maKu-datatables tbody').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = tableListData4.row(tr);

        if (row.child.isShown()) {
            //如果该行已经打开，则关闭
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            //关闭这已行
            row.child(format(row.data())).show();
            tr.addClass('shown');
        }
    });


    *//*根据条目数据返回需要显示的详情*//*
    function format(d) {
        return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
            '<tr>' +
            '<td>Uid:</td>' +
            '<td>' + d.RunUid + '</td>' +
            '<td>码限额:</td>' +
            '<td>' + d.maXianEr + '</td>' +
            '<td>连续下架:</td>' +
            '<td>' + d.maXiaJia + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>密码:</td>' +
            '<td>' + d.maPwd + '</td>' +
            '<td>时码次数:</td>' +
            '<td>' + d.maXiaoShi + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>码内容:</td>' +
            '<td>' + d.qrCodeAndMoney + '</td>' +
            '<td>日码次数:</td>' +
            '<td>' + d.maYiRi + '</td>' +
            '</tr>' +
            '</table>';
    }

*/


    //跑分账号管理
    tableListData4 = $('#maKu-datatables').DataTable({
        //stateSave: true,

        "lengthMenu": [[10, 25, 50,], ["10条", "25条", "50条"]],
        "processing": true,
        "serverSide": true,
        "bSort": false, //排序功能
        "bAutoWidth": false,//自动宽度
        "iDisplayLength": 10, // 每页显示多少行
        columns: [
            //{ "defaultContent": "" },   //注意：当查出来的数据有的为null时，dataTable每次加载会弹窗警告，非常烦人，这个设置为空字符串，就不会警告了


            {
                "className": 'details-control',
                "orderable": false,
                "defaultContent": ''
            },

            { "data": "USER_ID" },
            { "data": "USER_NAME" },
            { "data": "Password" },
            { "data": "TotalMoney" },
            { "data": "CanUseMoney" },
            { "data": "FreezeMoney" },
            { "data": "TakeUserID" },
            { "data": "TopUserID" },
            { "data": "UserState" },

            { "data": "UserKind" },
            { "data": "RegTime" },
            {

                "orderable": false,
                "defaultContent": '-'
            }

        ],
        "columnDefs": [//列定义

            {
                // "name": "myOrderID",
                "targets": 1,// 编辑

                "orderable": false,
                "bSortable": false,
                "render": function (data, type, row, meta) {
                      //alert(JSON.stringify(data));
                      tableListData4.myID = data;

                    return data;
                }
            },
            {
                // "name": "myOrderID",
                "targets": 3,// 编辑

                "orderable": false,
                "bSortable": false,
                "render": function (data, type, row, meta) {
                   //  alert(JSON.stringify(data));
                   // tableListData4.myID = data;

                    return data;
                }
            },
            {
                // "name": "myOrderID", 
                "targets": [9],
                //// "data": "myOrderID",
                "render": function (data, type, row, meta) {
                   // alert(data);
                    //var iii = data.indexOf('|');
                    var tmpColor = "blue";
                    var tmpState = "未激活";
                    if (data == 1) {
                        tmpState = "已激活";
                        tmpColor = "green";
                    }
                    if (data == 2) {
                        tmpState = "已封号";
                        tmpColor = "red";
                    }
                    var HTML = "<span style='color:" + tmpColor +"'>" + tmpState +"</span>";
                    return HTML
                }

            }
            ,
            {
                // "name": "myOrderID", 
                "targets": [10],
                //// "data": "myOrderID",
                "render": function (data, type, row, meta) {
                    // alert(data);
                    //var iii = data.indexOf('|');
                    var tmpColor = "blue";
                    var tmpState = "普通用户";
                    if (data == 1) {
                        tmpState = "代理";
                        tmpColor = "green";
                    }
                    if (data == 2) {
                        tmpState = "马商总号";
                        tmpColor = "red";
                    }
                    if (data == 3) {
                        tmpState = "马商子号";
                        tmpColor = "red";
                    }
                    var HTML = "<span style='color:" + tmpColor + "'>" + tmpState + "</span>";
                    return HTML
                }

            },
            {
                // "name": "myOrderID", 
                "targets": [12],
                //// "data": "myOrderID",
                "render": function (data, type, row, meta) {
                    var HTML = "<button style='height:50%' data-id=" + tableListData4.myID + " class='btn btn-icon btn-link jihuoRunner' type='button'><i class='fa fa-link'></i></button>";
                    return HTML
                }
            }
        ],
        "ajax": {
            "url": "/api/help/GetRunners",
            "type": "POST",
            "data": function (d) {
                return $.extend({}, d, {

                    // orderCmd: whichOderCmd //这个是哪个类型的订单

                });
                //console.log("请求的参数：", d);
                /*"data": function (param) {
               // param.toke = "http://localhost:7070"
                console.log("请求的参数：", param);
                return param;*/
            },
        },
        "rowCallback": function (row, data, index) {
            //alert(data.huabeiState);
          

            if (data.RegTime != null) {

                $('td:eq(11)', row).html('<span>' + GetOKTime(data.RegTime)+ '</span>');
            }

        },


        language: {      //配置中文

            processing: '处理中',

            lengthMenu: ' 显示_MENU_项结果',

            zeroRecords: ' 没有匹配结果',

            info: ' 显示第_START_ 至_END_项结果,共_TOTAL_项 ',
            infoEmpty: '显示第0项至0项结果，共0项 ',

            infoFiltered: '(由_MAX_项结果过滤)',

            infoPostFix: ' ',

            search: ' 搜索 ',

            emptyTable: ' 表中数据为空 ',

            loadingRecords: ' 载入中 ',

            paginate: {

                first: ' 首页',

                previous: ' 上一页 ',

                next: ' 下一页 ',

                last: ' 尾页 '

            },

            aria: {

                sortAscending: ' 升序 ',

                sortDescending: ' 降序 '

            }
        }

    });


    //银行订单信息
    tableListData5 = $('#bankOrders-datatables').DataTable({
        //stateSave: true,

        "lengthMenu": [[10, 25, 50,], ["10条", "25条", "50条"]],
        "processing": true,
        "serverSide": true,
        "bSort": false, //排序功能
        "bAutoWidth": false,//自动宽度
        "iDisplayLength": 10, // 每页显示多少行
        columns: [
            //{ "defaultContent": "" },   //注意：当查出来的数据有的为null时，dataTable每次加载会弹窗警告，非常烦人，这个设置为空字符串，就不会警告了


            {
                "className": 'details-control',
                "orderable": false,
                "defaultContent": ''
            },

            { "data": "OrderID" },
            { "data": "USER_ID" },
            { "data": "OrderMoney" },
            { "data": "TotalOldMoney" },
            { "data": "TotalOldFrzMoney" },
            { "data": "bkUserName" },
            { "data": "bkNumber" },
            { "data": "bkName" },
            { "data": "DealState" },

            { "data": "AddTime" },
            { "data": "OrderID" }

        ],
        "columnDefs": [//列定义

            {
                // "name": "myOrderID",
                "targets": 1,// 编辑

                "orderable": false,
                "bSortable": false,
                "render": function (data, type, row, meta) {
                    //alert(JSON.stringify(data));
                    tableListData5.myID = data;

                    return data;
                }
            },
            {
                // "name": "myOrderID",
                "targets": 3,// 编辑

                "orderable": false,
                "bSortable": false,
                "render": function (data, type, row, meta) {
                    //  alert(JSON.stringify(data));
                    // tableListData5.myID = data;

                    return data;
                }
            },
            {
                // "name": "myOrderID", 
                "targets": [9],
                //// "data": "myOrderID",
                "render": function (data, type, row, meta) {
                    // alert(data);
                    //var iii = data.indexOf('|');
                    var tmpColor = "blue";
                    var tmpState = "-";
                    if (data == 1) {
                        tmpState = "确认通过";
                        tmpColor = "green";
                    }
                    if (data == 0) {
                        tmpState = "待确认";
                        tmpColor = "red";
                    }
                    var HTML = "<span style='color:" + tmpColor + "'>" + tmpState + "</span>";
                    return HTML
                }

            },
            {
                // "name": "myOrderID", 
                "targets": [11],
                //// "data": "myOrderID",
                "render": function (data, type, row, meta) {
                    var HTML = "<button style='height:50%' data-id=" + tableListData5.myID + " class='btn btn-icon btn-link dealBankOrders' type='button'><i class='fa fa-link'></i></button>";
                    return HTML
                }
            }
            
        ],
        "ajax": {
            "url": "/api/help/GetBankOrders",
            "type": "POST",
            "data": function (d) {
                return $.extend({}, d, {

                    // orderCmd: whichOderCmd //这个是哪个类型的订单

                });
                //console.log("请求的参数：", d);
                /*"data": function (param) {
               // param.toke = "http://localhost:7070"
                console.log("请求的参数：", param);
                return param;*/
            },
        },
        "rowCallback": function (row, data, index) {
            //alert(data.huabeiState);


            if (data.AddTime != null) {

                $('td:eq(10)', row).html('<span>' + GetOKTime(data.AddTime) + '</span>');
            }

        },


        language: {      //配置中文

            processing: '处理中',

            lengthMenu: ' 显示_MENU_项结果',

            zeroRecords: ' 没有匹配结果',

            info: ' 显示第_START_ 至_END_项结果,共_TOTAL_项 ',
            infoEmpty: '显示第0项至0项结果，共0项 ',

            infoFiltered: '(由_MAX_项结果过滤)',

            infoPostFix: ' ',

            search: ' 搜索 ',

            emptyTable: ' 表中数据为空 ',

            loadingRecords: ' 载入中 ',

            paginate: {

                first: ' 首页',

                previous: ' 上一页 ',

                next: ' 下一页 ',

                last: ' 尾页 '

            },

            aria: {

                sortAscending: ' 升序 ',

                sortDescending: ' 降序 '

            }
        }

    });



});




function xtip_win_runner(myID) {
    xtip.win({
        type: 'confirm', //alert 或 confirm
        // btn: ['确认添加'],
        tip: '<h1 class="myOrangered" >跑分账号维护:</h1>' +
            '<div><label for="sltOrder">操作类型</label><select style="width: 100%;" class="form-control input-fixed" name="sltOrder" id="sltOrder"><option value="pass">--激活--</option><option value="die">--封号--</option><option value="live">--解封--</option></select></div>' +

            '<div class= "form-group" > <label for="激活费">订单金额</label> <input type="text" class="form-control" id="fuckMoney" placeholder="请输入金额...，可以输入0"></div>'


        ,

        icon: 'a',
        title: "跑分账号维护",
        min: false,
        width: '900px',
        maxWidth: '100%',
        shade: true,
        shadeClose: false,
        lock: false,
        btn1: function () {
            dealRunner(myID);
        },

        zindex: 9999999,
    });
   

}


function xtip_win_BankOrders(myID) {
    xtip.win({
        type: 'confirm', //alert 或 confirm
        // btn: ['确认添加'],
        tip: '<h1 class="myOrangered" >预付押金订单:</h1>' +
            '<div><label for="sltOrder2">操作类型</label><select style="width: 100%;" class="form-control input-fixed" name="sltOrder2" id="sltOrder2"><option value="pass">--到账--</option><option value="die">--未到账--</option></select></div>' +

            '<div class= "form-group" > <label for="激活费">订单金额</label> <input type="text" class="form-control" id="fuckMoney2" placeholder="请输入金额..."></div>'


        ,

        icon: 'a',
        title: "预付订单维护",
        min: false,
        width: '900px',
        maxWidth: '100%',
        shade: true,
        shadeClose: false,
        lock: false,
        btn1: function () {
            dealBankOrders(myID);
        },

        zindex: 9999999,
    });


}



function dealRunner(myID) {
    
    var m = $('#fuckMoney').val();
    var s = $('#sltOrder').val();
    hub.server.jihuoRunner(myID, m, s).done(function (result) {
        if (result == "ok") {
            alert('操作成功!');
            loadRunsData();
        } else {
            alert('操作失败:' + result);
        }
    }).fail(function (err) {
        alert('操作错误：' + err);
    });
}


function dealBankOrders(myID) {
    var m = $('#fuckMoney2').val();
    var s = $('#sltOrder2').val();
    hub.server.dealBankOrders(myID, m, s).done(function (result) {
        if (result == "ok") {
            alert('操作成功!');
            loadBankData();
        } else {
            alert('操作失败:' + result);
        }
    }).fail(function (err) {
        alert('操作错误：' + err);
    });
}



function loadRunsData() {

    // loadid = xtip.load();    
    var table = $('#maKu-datatables').DataTable();
    table.ajax.reload(function (json) {
        // xtip.close(loadid);
        //console.log(json);
    }, false);
}
function loadBankData() {

    // loadid = xtip.load();    
    var table = $('#bankOrders-datatables').DataTable();
    table.ajax.reload(function (json) {
        // xtip.close(loadid);
        //console.log(json);
    }, false);
}
//添加码入库
function add_Qrcode() {

    var isH5 = '';
    $.each($('input:checkbox'), function () {
        if (this.checked && $(this).val() == 'qrH5') {
            isH5 = 'qrH5';
        }
    });


    var t1 = $("#maType").val().trim();
    var t2 = isH5;
    var t3 = $("#maUid").val().trim();
    var t4 = $("#maPwd").val().trim();
    var t5 = $("#maName").val().trim();
    var t6 = $("#maXianEr").val().trim();
    var t7 = $("#maXiaoShi").val().trim();
    var t8 = $("#maYiRi").val().trim();
    var t9 = $("#maXiaJia").val().trim();
    var t10 = Gobal_Qr;
   // alert(t3);
    var postData = { maType: t1, qrH5: t2, maUid: t3, maPwd: t4, maName: t5, maXianEr: t6, maXiaoShi: t7, maYiRi: t8, maXiaJia: t9, qrCodeAndMoney: t10 };
   // alert(postData);
    hub.server.addQrcode(postData).done(function (result) {
        if (result == 1) {
            alert('添加成功!');
            loadRunsData();
        } else {
            alert('添加失败!');
        }
    }).fail(function (err) {
        alert('错误：' + err);
    });
}


