//商户脚本

var tableListData2;

$(document).ready(function () {


    //给每一行添加展开或收起的监听
    $('#shop-datatables tbody').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = tableListData2.row(tr);

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
            '<td>商户名称:</td>' +
            '<td>' + d.ShopName + '</td>' +
            '<td>微信通道:</td>' +
            '<td>' + d.sltWeChat + '</td>' +
            '<td>聚合码费率:</td>' +
            '<td>' + d.jhF + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>密码:</td>' +
            '<td>' + d.Password + '</td>' +
            '<td>支付宝通道:</td>' +
            '<td>' + d.sltAlipay + '</td>' +
            '<td>聚合码浮动:</td>' +
            '<td>' + d.jhFuDong + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>回调地址:</td>' +
            '<td>' + d.OrderNotify + '</td>' +
            '<td>云闪付通道:</td>' +
            '<td>' + d.sltYsf + '</td>' +
            '<td>聚合码通道:</td>' +
            '<td>' + d.sltJH + '</td>' +
            '</tr>' +
            '</table>';
    }
    tableListData2 = $('#shop-datatables').DataTable({
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

            { "data": "ShopName" },
            { "data": "PosUid" },
            { "data": "alipayF" },
            { "data": "wechatF" },
            { "data": "ysfF" },
            { "data": "wechatFuDong" },
            { "data": "alipayFuDong" },

            { "data": "ysfFuDong" },
            ,

            { "data": "OKTime" }

        ],
        "columnDefs": [//列定义

            {
                // "name": "myOrderID",
                "targets": 1,// 编辑

                "orderable": false,
                "bSortable": false,
                "render": function (data, type, row, meta) {
                    //alert(JSON.stringify(data));
                    tableListData2.myID = data;

                    return data;
                }
            },
            {
                // "name": "myOrderID",
                "targets": 2,// 编辑

                "orderable": false,
                "bSortable": false,
                "render": function (data, type, row, meta) {
                    // alert(JSON.stringify(data));
                    tableListData2.myID = data;

                    return data;
                }
            },
            {
                // "name": "myOrderID", 
                "targets": [9],
                //// "data": "myOrderID",
                "render": function (data, type, row, meta) {
                    var HTML = "<button style='height:50%' data-id=" + tableListData2.myID + " class='btn btn-icon btn-link budan' type='button'><i class='far fa-edit'></i></button>"
                        + "<button style='height:50%' data-id=" + tableListData2.myID + " class='btn btn-icon btn-link budan myAgent' type='button'><i class='fas fa-hand-holding-usd'></i></button> "  ;
                    return HTML
                }

            }
        ],
        "ajax": {
            "url": "/api/help/GetShops",
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
        tip: '<h1 class="myOrangered" >添加新商户:</h1><div class="form-group"><label for="ShopName">商户名称</label><input type="text" class="form-control" id="ShopName" placeholder="不超过3个字"></div>' +
            ' <div class="form-group"><label for="PosUid">商户UID</label><input type="text" class="form-control" id="PosUid" placeholder="6位数字"></div>	' +
            '<div class="form-group"><label for="password">登录密码</label><input type="password" class="form-control" id="Password" placeholder="密码"></div>'
            + '<div class="form-group"><label for="Key">Key</label><input type="text" class="form-control" id="Key" placeholder="秘钥"></div>' +
            '<div class="form-group"><label for="OrderNotify">回调地址</label><input type="text" class="form-control" id="OrderNotify" placeholder="可不填写"></div>	' +
            '<div class="form-group"><h4 class="myGreen">支付宝通道</h4><input type="text" class="form-control" id="alipayF" placeholder="商家费率,不是通道费率"><select style="width: 100%;" class="form-control input-fixed" name="sltAlipay" id="sltAlipay"><option value="-1">--请选择通道,混跑请勿选择--</option></select><input type="text" class="form-control" id="alipayMoreRun" placeholder="混跑格式:333|555|666"><input type="text" class="form-control" id="alipayFuDong" placeholder="金额增减范围"><h4 class="myGreen">微信通道</h4><input type="text" class="form-control" id="wechatF" placeholder="商家费率,不是通道费率"><select style="width: 100%;" class="form-control input-fixed" name="sltWeChat" id="sltWeChat"><option value="-1">--请选择通道,混跑请勿选择--</option></select><input type="text" class="form-control" id="wechatMoreRun" placeholder="混跑格式:333|555|666"><input type="text" class="form-control" id="wechatFuDong" placeholder="金额增减范围"><h4 class="myGreen">云闪付通道</h4><input type="text" class="form-control" id="ysfF" placeholder="商家费率,不是通道费率"><select style="width: 100%;" class="form-control input-fixed" name="sltYsf" id="sltYsf"><option value="-1">--请选择通道,混跑请勿选择--</option></select><input type="text" class="form-control" id="ysfMoreRun" placeholder="混跑格式:333|555|666"><input type="text" class="form-control" id="ysfFuDong" placeholder="金额增减范围">' +
            '<h4 class="myGreen">聚合码通道</h4><input type="text" class="form-control" id="jhF" placeholder="商家费率,不是通道费率"><select style="width: 100%;" class="form-control input-fixed" name="sltJH" id="sltJH"><option value="-1">--请选择通道,混跑请勿选择--</option></select><input type="text" class="form-control" id="jhMoreRun" placeholder="混跑格式:333|555|666"><input type="text" class="form-control" id="jhFuDong" placeholder="金额增减范围">'+

            '<h4 class="myGreen">支付宝原生通道</h4><input type="text" class="form-control" id="yuanSheng" placeholder="商家费率,不是通道费率">' +
            '<h4 class="myGreen">红包通道</h4><input type="text" class="form-control" id="hongBao" placeholder="商家费率,不是通道费率">' +
            '<h4 class="myGreen">红包2通道</h4><input type="text" class="form-control" id="xianYu" placeholder="商家费率,不是通道费率">' +
            '<h4 class="myGreen">非常规通道</h4><input type="text" class="form-control" id="greenWay" placeholder="商家费率,不是通道费率">' +

            '</div>'

        ,

        icon: 'a',
        title: "添加商户",
        min: false,
        width: '900px',
        maxWidth: '100%',
        shade: true,
        shadeClose: false,
        lock: false,
        btn1: function () {
            add_shop();
            loadData();
        },

        zindex: 9999999,
    });

    $("#Key").val(guid());

    hub.server.getRuns().done(function (result) {
        var data = $.parseJSON(result);
        for (var i = 0; i < data.length; i++) {
            var option = document.createElement("option");
            $(option).val(data[i].RunUid);
            $(option).text(data[i].RunName + "-" + data[i].RunUid);
            $('#sltAlipay,#sltWeChat,#sltYsf,#sltJH').append(option);
        }

    }).fail(function (err) {
        alert('错误：' + err);
    });

}

//去掉自动刷新
autoReload = 0;

function loadData() {

    //loadid = xtip.load();
    var table = $('#shop-datatables').DataTable();
    table.ajax.reload(function (json) {
        //  xtip.close(loadid);
        //console.log(json);
    }, false);
}

//添加商户
function add_shop() {
    var t1 = $("#PosUid").val().trim();
    var t2 = $("#ShopName").val().trim();
    var t3 = $("#Password").val().trim();
    var t4 = $("#Key").val().trim();
    var t5 = $("#OrderNotify").val().trim();
    var t6 = $("#alipayF").val().trim();
    var t7 = $("#sltAlipay").val().trim();
    var t8 = $("#alipayMoreRun").val().trim();
    var t9 = $("#alipayFuDong").val().trim();
    var t10 = $("#wechatF").val().trim();
    var t11 = $("#sltWeChat").val().trim();
    var t12 = $("#wechatMoreRun").val().trim();
    var t13 = $("#wechatFuDong").val().trim();
    var t14 = $("#ysfF").val().trim();
    var t15 = $("#sltYsf").val().trim();
    var t16 = $("#ysfMoreRun").val().trim();
    var t17 = $("#ysfFuDong").val().trim();
    var t18 = $("#jhF").val().trim();
    var t19 = $("#sltJH").val().trim();
    var t20 = $("#jhMoreRun").val().trim();
    var t21 = $("#jhFuDong").val().trim();
    //新增三方接口
    var t22 = $("#yuanSheng").val().trim();
    var t23 = $("#hongBao").val().trim();
    var t24 = $("#xianYu").val().trim();
    var t25 = $("#greenWay").val().trim();

    if (getStrToIntWrong(t1)) {

        alert("商户UID只能是数字！");
        return;
    }

    if (getStrToFloatWrong(t6) || getStrToFloatWrong(t10) || getStrToFloatWrong(t14) || getStrToFloatWrong(t18)) {

        alert("错误，请检查费率是否正确！");
        return;
    }

    if (getStrEmpty(t2) || getStrEmpty(t3) || getStrEmpty(t4) || getStrEmpty(t6) || getStrEmpty(t7)
        || getStrEmpty(t9) || getStrEmpty(t10) || getStrEmpty(t11) || getStrEmpty(t13) || getStrEmpty(t14)
        || getStrEmpty(t15) || getStrEmpty(t17) || getStrEmpty(t18) || getStrEmpty(t19) || getStrEmpty(t21)
        ) {

        alert("有空项未填写，请检查！");
        return;
    }
   

    var hiData = {
        PosUid: t1, ShopName: t2, Password: t3, Key: t4, OrderNotify: t5,
        alipayF: t6, sltAlipay: t7, alipayMoreRun: t8, alipayFuDong: t9,
        wechatF: t10, sltWeChat: t11, wechatMoreRun: t12, wechatFuDong: t13,
        ysfF: t14, sltYsf: t15, ysfMoreRun: t16, ysfFuDong: t17,
        jhF: t18, sltJH: t19, jhMoreRun: t20, jhFuDong: t21
        , yuanShengF: t22, hongBaoF: t23, xianYuF: t24, greenWayF:t25
    };
    $.ajax({
        url: "/Help/Shop/AddShop",
        type: "post",
        // Form数据
        data: hiData,
        cache: false,
        success: function (data) {
            if (data == 'ok')
                xtip.alert('添加成功...', 's')
        }
    });
}