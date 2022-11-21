//添加码入库


var tableListData4;

$(document).ready(function () {

    $("#maType02").change(
        function () {
            var selcetStr = $("#maType02").val();
            if (selcetStr == "自己") {
                $("#mySayBankDiv").show();
            } else {
                $("#mySayBankDiv").hide();
            }

        }

    )
    //设置为花呗码
    $(document).off("click", ".maDie").on("click", ".maDie", function () {
        var tmpId = $(this).attr('data-id');


        hub.server.setRunQrcodeIsDie(tmpId).done(function (result) {
            if (result == 1) {
                alert('设置成功!');
                loadRunsData();
            } else {
                alert('设置失败!');
            }
        }).fail(function (err) {
            alert('设置错误：' + err);
        });

    });


    //设置为花呗码
    $(document).off("click", ".huabei").on("click", ".huabei", function () {
        var tmpId = $(this).attr('data-id');
       

        hub.server.setRunQrcodeIsHuaBei(tmpId,true).done(function (result) {
            if (result == 1) {
                alert('设置成功!');
                loadRunsData();
            } else {
                alert('设置失败!');
            }
        }).fail(function (err) {
            alert('设置错误：' + err);
        });

    });
    //弹出二维码
    $(document).off("click", ".qrcodeImg").on("click", ".qrcodeImg", function () {

       var tmpUrl=  $(this).attr('data-id');

        window.open('http://qr.liantu.com/api.php?text=' + tmpUrl);

    });

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


    /*根据条目数据返回需要显示的详情*/
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

            { "data": "QrId" },
            { "data": "RunUid" },
            { "data": "maUid" },
            { "data": "maType" },
            { "data": "maName" },
            { "data": "qrHourUseTimes" },

            { "data": "qrDayUseTimes" },
            { "data": "qrLostTimes" },
            {
                "data": "qrCodeAndMoney",
                "orderable": false,
                "defaultContent": ''
            },

            { "data": "qrState" },
            { "data": "AddTime" }

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
                    //alert(data);
                    var iii = data.indexOf('|');
                    var tmpQrcodeUrl = data;
                    if (iii > -1) {
                        tmpQrcodeUrl= tmpQrcodeUrl.substring(0, iii);
                       // alert(tmpQrcodeUrl);
                    }
                    var HTML ="<button style='height:50%' data-id=" + tableListData4.myID + " class='btn btn-icon btn-link maDie' type='button'><i class='far flaticon-cross'></i></button>" +
                        "<img style='height:18px' data-id=" + tableListData4.myID + " class='huabei' type='button' src='/images/hb.png' />" +
                        "<img  style='margin: 0px 10px; height: 19px;' data-id=" + tmpQrcodeUrl + " class='qrcodeImg' type='button' src='/images/ewm.png' />";
                    return HTML
                }

            }
        ],
        "ajax": {
            "url": "/api/help/GetMaKus",
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
            if (data.huabeiState == 1) {

                $('td:eq(4)', row).html(  '<img  style="margin: 0px 10px; height: 19px;"    src="/images/hbOK.png" />');
            }
            if (data.qrState == 0) {
                $('td:eq(10)', row).html('<span style="color:green">正常</span>');

            } else {
                $('td:eq(10)', row).html('<span style="color:red">下架</span>');
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




function xtip_win() {
    xtip.win({
        type: 'confirm', //alert 或 confirm
        // btn: ['确认添加'],
        tip: '<h1 class="myOrangered" >添加通道:</h1><div class="form-group"><label for="RunName">通道名称</label><input type="text" class="form-control" id="RunName" placeholder="例:张三支付"></div>' +
            '<div class="form-group"><h5 class="myOrangered" >通道代号</h5><input type="text" class="form-control" id="RunGood" placeholder="3个数字,后期用来支持通道混跑"></div>' +
            ' <div class="form-group"><label for="RunUid">UID</label><input type="text" class="form-control" id="RunUid" placeholder="对方给的账号"></div>	' +
            '<div class="form-group"><label for="RunPassword">登录密码</label><input type="password" class="form-control" id="RunPassword" placeholder="对方给的密码"></div>'
            + '<div class="form-group"><h4 class="myGreen">支付宝通道</h4><input type="text" class="form-control" id="alipayF" placeholder="通道费率"><input type="text" class="form-control" id="alipayT" placeholder="通道参数,比如alipay|h5"><h4 class="myGreen">微信通道</h4><input type="text" class="form-control" id="wechatF" placeholder="通道费率"><input type="text" class="form-control" id="wechatT" placeholder="通道参数,比如wechat|h4"><h4 class="myGreen">云闪付通道</h4><input type="text" class="form-control" id="ysfF" placeholder="通道费率"><input type="text" class="form-control" id="ysfT" placeholder="通道参数,比如unionpay|h5"></div>'

            + '<hr style="background-color:red" />'
            + '<h5 class="myOrangered" >*特别注意:内部通道请把Key清空,以下均不填写</h5>'
            + '<div class="form-group"><label for="Key">Key</label><input id="runKey" type="text"  class="form-control" id="Key" placeholder="对方给的秘钥"></div>' +
            '<div class="form-group"><label for="OrderNotify">支付接口地址</label><input type="text" class="form-control" id="OrderNotify" placeholder="对方给的支付网址"></div>	' +

            '<div class="form-group"><h4 class="myGreen">支付参数</h4><textarea id="MoreParm" class="form-control" rows="3" style="width:100%">{"OrderNo":"t1","OrderMoney":"t2","PosUid":"t3","TimeStamp":"time","All":"0"}*{"Sign":"t5","OrderType":"t6","OrderNotify":"t7","OrderName":"t8","MD5":"0"}</textarea></div>'
            + '<div class="form-group"><h4 class="myGreen">回调参数</h4><textarea id="BackParm" class="form-control" rows="3" style="width:100%">{"PosUid":"t1","OrderNo":"t2","OrderID":"t3","OrderMoney":"t4","OrderPrice":"t5","Sign":"t6"}*SUCCESS</textarea></div>'

        ,

        icon: 'a',
        title: "添加通道",
        min: false,
        width: '900px',
        maxWidth: '100%',
        shade: true,
        shadeClose: false,
        lock: false,
        btn1: function () {
            add_Run();
        },

        zindex: 9999999,
    });
    $("#runKey").val(guid());

}





function loadRunsData() {

    // loadid = xtip.load();    
    var table = $('#maKu-datatables').DataTable();
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



//添加卡入库
function add_KaCode() {

    var isH5 = '';
    $.each($('input:checkbox'), function () {
        if (this.checked && $(this).val() == 'qrH5') {
            isH5 = 'qrH5';
        }
    });


    var t1 = $("#maType02").val().trim();

    
    if (t1 == "自己") {
       t1= $("#mySayBank").val();
    } 
    alert(t1);

    var t2 = "bank";
    var t3 = $("#maUid02").val().trim();
    var t4 = $("#maPwd02").val().trim();
    var t5 = $("#maName02").val().trim();
    var t6 = $("#maXianEr02").val().trim();
    var t7 = $("#maXiaoShi02").val().trim();
    var t8 = $("#maYiRi02").val().trim();
    var t9 = $("#maXiaJia02").val().trim();
    var t10 ="";
    // alert(t3);
    var postData = { maType: t1, qrH5: t2, maUid: t3, maPwd: t4, maName: t5, maXianEr: t6, maXiaoShi: t7, maYiRi: t8, maXiaJia: t9, qrCodeAndMoney: t10 };
    // alert(postData);
    hub.server.addKaCode(postData).done(function (result) {
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

