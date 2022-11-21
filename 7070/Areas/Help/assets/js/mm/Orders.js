
var tableListData;
var whichOderCmd = 1;//订单类型,默认是全部
var orderSearch = 0;//是否按下搜索按钮,默认为0,不是
var autoReload = 1;//默认自动刷新
var myUserKind = -2;//表明身份类型，有些东西进行隐藏，但是后台是校验的 3=ad
var GobalDealOrderID;
var xtipMsg = '<h1 class="myOrangered" >订单维护:</h1>' +
    '<div><label for="sltOrder">操作类型</label><select style="width: 100%;" class="form-control input-fixed" name="sltOrder" id="sltOrder"><option value="buhuidiao">--补回调--</option><option value="budan">--补单--</option><option value="zhongcaixiuzheng">--仲裁修正--</option><option value="zhongcaiwuxiao">--仲裁无效--</option></select></div>' +

    '<div class= "form-group" > <label for="fuckMoney">订单金额</label> <input type="text" class="form-control" id="fuckMoney" placeholder="请输入实际金额..."></div>';
function manage_win(oderid, orderImg) {

    var tmpLength = orderImg.indexOf('UploadPZ');
    //alert(tmpLength);
    if (myUserKind == 3&tmpLength>0) {
        xtipMsg = '<h1 class="myOrangered" >银行转账订单，没啥好维护的！</h1>';
    }
    if (myUserKind == 3 & tmpLength ==-1) {
        '<h1 class="myOrangered" >订单维护:</h1>' +
            '<div><label for="sltOrder">操作类型</label><select style="width: 100%;" class="form-control input-fixed" name="sltOrder" id="sltOrder"><option value="buhuidiao">--补回调--</option><option value="budan">--补单--</option><option value="zhongcaixiuzheng">--仲裁修正--</option><option value="zhongcaiwuxiao">--仲裁无效--</option></select></div>' +

            '<div class= "form-group" > <label for="fuckMoney">订单金额</label> <input type="text" class="form-control" id="fuckMoney" placeholder="请输入实际金额..."></div>';
    }

    if (myUserKind == 2) {//shop work
        xtipMsg = '<h1 class="myOrangered" >订单维护:</h1>' +
            '<div><label for="sltOrder">操作类型</label><select style="width: 100%;" class="form-control input-fixed" name="sltOrder" id="sltOrder"><option value="cuidan">--催单--</option></div>' +

            '<div class= "form-group" > <label for="fuckMoney">催单内容</label> <input type="text" class="form-control" id="fuckMoney" placeholder="请输入内容...，限75个字内，禁止问询非订单信息"></div>';
    }
    if (myUserKind == 1) { //runner
        xtipMsg = '<h1 class="myOrangered" >订单维护:</h1>' +
            '<div><label for="sltOrder">操作类型</label><select style="width: 100%;" class="form-control input-fixed" name="sltOrder" id="sltOrder"><option value="cuidan">--回复催单--</option><option value="daozhang">--确认到账--</option><option value="weidaozhang">--未到账--</option><option value="dongjie">--司法冻结(10分钟内)--</option><option value="jiedong">--已解冻--</option></div>' +

            '<div class= "form-group" > <label for="fuckMoney">内容</label> <input type="text" class="form-control" id="fuckMoney" placeholder="请输入内容...,禁止问询非订单信息"></div>';
      }

    GobalDealOrderID = oderid;
    xtip.win({
        type: 'confirm', //alert 或 confirm
        // btn: ['确认添加'],
        tip: xtipMsg + '<img style="margin-top:30px;width:330px" src=../../' + orderImg + '>'
        ,

        icon: 'a',
        title: "订单操作",
        min: false,
        width: '900px',
        maxWidth: '100%',
        shade: true,
        shadeClose: false,
        lock: false,
        btn1: function () {
            if (myUserKind == 3) {
                dealOrderCmd();
            } else {
                dealOrderCmd2();
            }
            
        },

        zindex: 9999999,
    });
   // $("#runKey").val(guid());

}

//修正订单
function dealOrderCmd() {
    var m = $('#fuckMoney').val();
    var s = $('#sltOrder').val();
   // alert(s);
    //alert(GobalDealOrderID);
   
    //获取信息
    hub.server.changeOrderInfo(GobalDealOrderID, s,m).done(function (result) {
        if (result == "ok") {
            alert('恭喜：操作成功...');
           

        } else {
            alert('失败：'+result);
           
        }


    })
        .fail(function (err) {
            alert('错误：' + err);
        });


}
//处理订单，runner shoper订单
function dealOrderCmd2() {
    var m = $('#fuckMoney').val();
    var s = $('#sltOrder').val();
    // alert(s);
    //alert(GobalDealOrderID);

    //获取信息
    hub.server.dealOrdersByAllUsers(GobalDealOrderID, s, m).done(function (result) {
        if (result == "ok") {
            alert('恭喜：操作成功...');


        } else {
            alert('失败：' + result);

        }


    })
        .fail(function (err) {
            alert('错误：' + err);
        });


}


$(document).ready(function () {


   


    //自动刷新
    setInterval(function () {
        if (autoReload == 1) {
            loadOrdersData();
        }
    }, 15000);


    //Notify


    $('#btnSearch').on("click", function () {
        orderSearch = 1;//改为1
        loadOrdersData();
        orderSearch = 0;//改回来
    });

    //给每一行添加展开或收起的监听
    $('#basic-datatables tbody').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = tableListData.row(tr);

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

    var okFl = "";
    /*根据条目数据返回需要显示的详情*/
    function format(d) {

        if (myUserKind == 3) {
            okFl = '<td>商家费率:</td>' +
                '<td>' + d.ShopFL + '</td>' +
                '<td>' + d.ShopFL + '</td>' +
                '<td>通道费率:</td>' +
                '<td>' + d.RunFL + '</td>' +
                '<td>' + d.ShopFL + '</td>' 
        }
        return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
            '<tr>' +
            '<td>二维码编号:</td>' +
            '<td>' + d.AppID + '</td>' +
            '<td>订单状态:</td>' +
            '<td>' + d.OrderState + '</td>' +
            okFl+
            '</tr>' +
            '<tr>' +
            '<td>二维码内容(备注):</td>' +
            '<td>' + d.QrcodeUrl + '</td>' +
            '<td>二维码备注:</td>' +
            '<td>' + d.CName + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>该会员合计出码次数:</td>' +
            '<td>' + d.VipUseTimes + '</td>' +
            '</tr>' +
            '</table>';
    }
    tableListData = $('#basic-datatables').DataTable({
        //stateSave: true,

        "lengthMenu": [[15, 25, 50, 2000], ["15条", "25条", "50条", "2000条"]],
        "processing": false,
        "serverSide": true,
        "bSort": false, //排序功能
        "bAutoWidth": false,//自动宽度
        "iDisplayLength": 15, // 每页显示多少行
        columns: [
            //{ "defaultContent": "" },   //注意：当查出来的数据有的为null时，dataTable每次加载会弹窗警告，非常烦人，这个设置为空字符串，就不会警告了


            {
                "className": 'details-control',
                "orderable": false,
                "defaultContent": ''
            },

            { "data": "OrderID" },
            { "data": "OrderType" },
            { "data": "OrderNo" },
            { "data": "PosUid" },
            { "data": "OrderMoney" },
            { "data": "OrderState" },
            { "data": "OrderInTime" }
            ,
            { "data": "CName" }
            ,
            { "data": "VipUseTimes" }
            ,
            { "data": "OrderPrice" }
            ,
            { "data": "USER_ID" }
            ,
            { "data": "QrChannel" }
            ,
            { "data": "QrcodeUrl" }

        ],
        "columnDefs": [//列定义
            {
                // "name": "myOrderID",
                "targets": 1,// 编辑

                "orderable": false,
                "bSortable": false,
                "render": function (data, type, row, meta) {
                    //alert(JSON.stringify(data));
                    tableListData.myID = data;

                    return data;
                }
            },
            {
                

                // "name": "myOrderID", 
                "targets": [13],
               
                "render": function (data, type, row, meta) {
                    //alert(data);
                    var HTML = "<button style='height:50%' data-id=" + tableListData.myID + " data-img="+data+ " class='btn btn-icon btn-link budan' type='button'><i class='fa fa-link'></i></button>";
                    return HTML
                }
            },
            {
                // "name": "myOrderID", 
                "targets": [2],

                "render": function (data, type, row, meta) {

                    // alert(JSON.stringify(data));
                    //类型替换成图片
                    var tmpImgUrl;
                    if (data == "unionpay") {
                        var HTML = '<img class="myPayKindImg" src="/images/unionpay.png" />';
                        return HTML

                    } else if (data == "alipay") {
                        var HTML = '<img class="myPayKindImg" src="/images/alipay.png" />';
                        return HTML
                    } else if (data == "wechat") {

                        var HTML = '<img class="myPayKindImg" src="/images/wechat.png" />';
                        return HTML
                    } else {
                        var HTML = '<img class="myPayKindImg" src="/images/zanbei.png" />';
                        return HTML
                    }


                }
            }
        ],
        "ajax": {
            "url": "/api/help/GetOrderState",
            "type": "POST",
            "data": function (d) {
                return $.extend({}, d, {
                    beginTime: $('#datetimepicker').val(),
                    endTime: $('#datetimepicker2').val(),
                    orderCmd: whichOderCmd, //这个是哪个类型的订单
                    searchBtn: orderSearch
                });
                //console.log("请求的参数：", d);
                /*"data": function (param) {
               // param.toke = "http://localhost:7070"
                console.log("请求的参数：", param);
                return param;*/
            }
            //,
            //"success": function (t) {

            //    // console.log("返回的数据：", param);
            //   // return t;
            //},

        },
        "rowCallback": function (row, data, index) {
            // row : tr dom
            // data: row data
            // index:row data's index
            var table = $('#basic-datatables').DataTable();
            myUserKind = data.UKind;
            if (data.UKind != 3) {
                // var column = table.column(13);
                 //13当前为显示状态则将其隐藏，否则则将其显示,后台有权限校验
                // column.visible(!column.visible());
            }

           // alert(index);
            // alert(JSON.stringify(data));
            if (index == 0) {
                $('#payOKLbl').html(0);
                $('#payHandbl').html(0);
                $('#payRunLbl').html(0);
                $('#payOKLbl').html(data.TotalPayMoney);
                $('#payHandbl').html(data.TotalHandMoney);
                $('#payRunLbl').html(data.TotalOutMoney);
            }

            if (data.OrderState == 3) {

                $('td:eq(6)', row).html('<span style="color:green"><b>' + '已支付' + '</b></span>');
            } else if (data.OrderState == 1 || data.OrderState == 4) {

                //获取当前时间
                var now = new Date;
                now.setMinutes(now.getSeconds() - 20);
                //自定义时间
                var customTime = data.OrderInTime;
                customTime = customTime.replace("-", "/");//替换字符，变成标准格式  
                customTime = new Date(Date.parse(customTime));
                if (now < customTime) {
                    $('td:eq(6)', row).html('<span style="color:red"><b>' + '出码中' + '</b></span>');

                } else {
                    $('td:eq(6)', row).html('<span style="color:red"><b>' + '码未出' + '</b></span>');

                }
               
            } else if (data.OrderState == 2) {

                $('td:eq(6)', row).html('<span style="color:red"><b>' + '未回调' + '</b></span>');
            }

            else if(data.OrderState == 6) {

                $('td:eq(6)', row).html('<span style="color:blue"><b>' + '已补单' + '</b></span>');
             } 

            else if (data.OrderState == 7) {

                $('td:eq(6)', row).html('<span style="color:blue"><b>' + '补回调' + '</b></span>');
            } 

            else if (data.OrderState == 5) {

                //获取当前时间
                var now = new Date;
                now.setMinutes(now.getMinutes() - 6);
                //自定义时间
                var customTime = data.OrderInTime;
                customTime = customTime.replace("-", "/");//替换字符，变成标准格式  
                customTime = new Date(Date.parse(customTime));
                if (now < customTime) {
                    $('td:eq(6)', row).html('<span style="color:darkviolet"><b>' + '已出码' + '</b></span>');

                } else {
                    $('td:eq(6)', row).html('<span style="color:dark"><b>' + '已超时' + '</b></span>');

                }
                

            } else if (data.OrderState == 9) {

                $('td:eq(6)', row).html('<span style="color:blue"><b>' + '待通道确认' + '</b></span>');
            } else if (data.OrderState == 14) {

                $('td:eq(6)', row).html('<span style="color:blue"><b>' + '申请仲裁' + '</b></span>');
            } else if (data.OrderState == 66) {

                $('td:eq(6)', row).html('<span style="color:green"><b>' + '仲裁完毕' + '</b></span>');
            }
            else if (data.OrderState == 77) {

                $('td:eq(6)', row).html('<span style="color:black"><b>' + '无效订单' + '</b></span>');
            } else if (data.OrderState == 15) {

                $('td:eq(6)', row).html('<span style="color:red"><b>' + '未到账' + '</b></span>');
            } else if (data.OrderState == 16) {

                $('td:eq(6)', row).html('<span style="color:red"><b>' + '冻结' + '</b></span>');
            } else if (data.OrderState == 18) {

                $('td:eq(6)', row).html('<span style="color:red"><b>' + '预付不足' + '</b></span>');
            }
            else {

                $('td:eq(6)', row).html('<span style="color:dark"><b>' + '异&nbsp;&nbsp;&nbsp;&nbsp;常' + '</b></span>');
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


//行点击事件
$('#basic-datatables').on('click', '.budan',
    function () {


        var tmpid = $(this).attr("data-id");
        var tmpImg = $(this).attr("data-img");
        if (tmpImg.indexOf("UploadPZ") == -1) {
            //不存在
            tmpImg = '../../images/zzx.png';
        }
       // alert(tmpid);
        manage_win(tmpid, tmpImg);
       // alert(tmpid);
        //var table = $('#basic-datatables').DataTable();
        //table.ajax.reload(function (json) {
        //    //alert(JSON.stringify(data));
        //    // JSONToExcelConvertor(JSON.stringify(table.data()), "report");
        //    // console.log(json);
        //}, true);

        //// table.row.add(["000", "隐藏人物", '8888', '8888', '8888', '8888', '8888', '8888', '8888', '8888', '8888', '8888', '8888']).draw();
        ////获取第二列
        //var column = table.column(13);
        ////如果第二列当前为显示状态则将其隐藏，否则则将其显示
        //column.visible(!column.visible());



    });


//日期
var localeDate = getNowFormatDate();
//  alert(localeDate);
$('#datetimepicker').datetimepicker();
$('#datetimepicker').datetimepicker({ value: localeDate, step: 30 });



$('#datetimepicker2').datetimepicker();
$('#datetimepicker2').datetimepicker({ value: getNowOnlyDate(), step: 30 });

// 获取当前系统时间戳
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + "00" + seperator2 + "00"
    return currentdate;
}
function getNowOnlyDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + date.getHours() + seperator2 + date.getMinutes()
    return currentdate;
}


function notifyMsg(p1, p2, p3, p4) {
    $.notify({
        icon: p1,
        title: p2,
        message: p3,
    }, {
        type: p4,
        placement: {
            from: "bottom",
            align: "right"
        },
        time: 2000,
    });
}

function testMsg() {
    // alert('hi');
    // tableListData.ajax.url('/api/help/GetOrderState2').load();
}

function loadOrdersData() {

    // loadid = xtip.load();

    //alert(hi);
    try {


        var showTitle = "全部订单";

        switch (whichOderCmd) {
            case 1: showTitle = '全部订单';
                break;
            case 2: showTitle = '已付订单';
                break;
            case 3: showTitle = '未付订单';
                break;
            case 4: showTitle = '人工补单';
                break;
            case 5: showTitle = '手动回调';
                break;
            case 6: showTitle = '出马失败';
                break;
            case 7: showTitle = '客户分析';
                break;
            case 8: showTitle = '屏蔽订单';
                break;
            case 9: showTitle = '风控订单';
                break;
            default: showTitle = '未知错误';
        }

        $('#orderTitle').html(showTitle)
        var table = $('#basic-datatables').DataTable();
        table.ajax.reload(function (json) {
            //  xtip.close(loadid);
            //console.log(json);
        }, false);


    } catch (e) {
        notifyMsg('flaticon-cross', '提示', '请先浏览全部订单!', 'info');
    }
    
}

//行点击事件
$('#ExcelForOrders').on('click',
    function () {

        var table = $('#basic-datatables').DataTable();
        table.ajax.reload(function (json) {
            // xtip.alert('提示:请使用谷歌浏览器...', 'w');
            // xtip.msg('提示:请使用谷歌浏览器...');
            try {

                /*   //自定义标题栏
                   var title = ['用户名', '性别', '城市', '签名', '经验']
                   //自定义过滤栏（不需要导出的行）
                   var filter = ['id', 'logins']
   
                   //原始导出
                   // JSONToExcelConvertor(data3, "report");
                   //自定义导出
                   JSONToExcelConvertor(data3, "report", title, filter);*/

                JSONToExcelConvertor(JSON.stringify(table.data()), "report");
            } catch (e) {
                xtip.alert('导出失败!提示:请使用谷歌浏览器...', 'w');
            }

            // console.log(json);
        }, true);
    });