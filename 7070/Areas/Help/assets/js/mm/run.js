//商户脚本

var tableListData3;

$(document).ready(function () {

   
   
    //给每一行添加展开或收起的监听
    $('#run-datatables tbody').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = tableListData3.row(tr);

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
            '<td>名称:</td>' +
            '<td>' + d.RunName + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>密码:</td>' +
            '<td>' + d.RunPassword + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>支付地址:</td>' +
            '<td>' + d.OrderNotify + '</td>' +
            '</tr>' +
            '</table>';
    }
    tableListData3 = $('#run-datatables').DataTable({
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

            { "data": "RunName" },
            { "data": "RunGood" },            
            { "data": "RunUid" },
            { "data": "wechatF" },
            { "data": "alipayF" },
            { "data": "ysfF" },            
           
            { "data": "RunTpye" },
            { "data": "RunUid" },
            { "data": "OKTime" },
             { "data": "jhF" }   

        ],
        "columnDefs": [//列定义

            {
                // "name": "myOrderID",
                "targets": 1,// 编辑

                "orderable": false,
                "bSortable": false,
                "render": function (data, type, row, meta) {
                    //alert(JSON.stringify(data));
                  //  tableListData3.myID = data;

                    return data;
                }
            },
            {
                // "name": "myOrderID",
                "targets": 3,// 编辑

                "orderable": false,
                "bSortable": false,
                "render": function (data, type, row, meta) {
                    // alert(JSON.stringify(data));
                   tableListData3.myID = data;

                    return data;
                }
            },
            {
                // "name": "myOrderID", 
                "targets": [8],
                //// "data": "myOrderID",
                "render": function (data, type, row, meta) {
                    var HTML = "<button style='height:50%' data-id=" + tableListData3.myID + " class='btn btn-icon btn-link budan' type='button'><i class='far fa-edit'></i></button>" +
                        "<button style='height:50%' data-id=" + tableListData3.myID + " class='btn btn-icon btn-link budan myRunBuy' type='button'><i class='fas fa-hand-holding-usd'></i></button> ";
                    return HTML
                }

            }
        ],
        "ajax": {
            "url": "/api/help/GetRuns",
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
        tip: '<h1 class="myOrangered" >添加通道:</h1><div class="form-group"><label for="RunName">通道名称</label><input type="text" class="form-control" id="RunName" placeholder="例:张三支付"></div>' +
            '<div class="form-group"><h5 class="myOrangered" >通道代号</h5><input type="text" class="form-control" id="RunGood" placeholder="3个数字,后期用来支持通道混跑"></div>' +
            ' <div class="form-group"><label for="RunUid">UID</label><input type="text" class="form-control" id="RunUid" placeholder="对方给的账号"></div>	' +
            '<div class="form-group"><label for="RunPassword">登录密码</label><input type="password" class="form-control" id="RunPassword" placeholder="对方给的密码"></div>'
            + '<div class="form-group"><h4 class="myGreen">支付宝通道</h4><input type="text" class="form-control" id="alipayF" placeholder="通道费率"><input type="text" class="form-control" id="alipayT" placeholder="通道参数,比如alipay|h5"><h4 class="myGreen">微信通道</h4><input type="text" class="form-control" id="wechatF" placeholder="通道费率"><input type="text" class="form-control" id="wechatT" placeholder="通道参数,比如wechat|h4"><h4 class="myGreen">云闪付通道</h4><input type="text" class="form-control" id="ysfF" placeholder="通道费率"><input type="text" class="form-control" id="ysfT" placeholder="通道参数,比如unionpay|h5">' +
            '<h4 class="myGreen">聚合码通道</h4><input type="text" class="form-control" id="jhF" placeholder="通道费率"><input type="text" class="form-control" id="jhT" placeholder="通道参数,比如juhe|h4">'+
            '<h4 class="myGreen">总代理设置</h4><input type="text" class="form-control" id="topUserID" placeholder="账号id"><input type="text" class="form-control" id="topUserT" value="0.0|0.0|0.0" placeholder="依次为 云闪付 支付宝 微信"  >' +
            '<h4 class="myGreen">上级代理设置</h4><input type="text" class="form-control" id="lastUserID" placeholder="账号id"><input type="text" class="form-control" id="lastUserT" value="0.0|0.0|0.0" placeholder="依次为 云闪付 支付宝 微信" >' +
            '</div>'

            + '<hr style="background-color:red" />'
            +'<h5 class="myOrangered" >*特别注意:内部通道请把Key清空,以下均不填写</h5>'
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

//去掉自动刷新
autoReload = 0;
function xtip_agent() {
    xtip.win({
        type: 'confirm', //alert 或 confirm
        // btn: ['确认添加'],
        tip: '<h1 class="myOrangered" >添加中介账号:</h1><div class="form-group"><label for="RunName2">中介名称</label><input type="text" class="form-control" id="RunName2" placeholder="例:张三"></div>' +
           
            ' <div class="form-group"><label for="RunUid2">UID</label><input type="text" class="form-control" id="RunUid2" placeholder="账号"></div>	' +
            '<div class="form-group"><label for="RunPassword2">登录密码</label><input type="password" class="form-control" id="RunPassword2" placeholder="密码"></div>'

            
        ,

        icon: 'a',
        title: "添加中介账号",
        min: false,
        width: '900px',
        maxWidth: '100%',
        shade: true,
        shadeClose: false,
        lock: false,
        btn1: function () {
            add_RunAgent();
        },

        zindex: 9999999,
    });
    $("#runKey").val(guid());

}

//添加中间人
function add_RunAgent() {
    var t1 = $("#RunName2").val().trim();
   
    var t3 = $("#RunUid2").val().trim();
    var t4 = $("#RunPassword2").val().trim();
    
  
   


    
   
    if (getStrEmpty(t1) || getStrEmpty(t3) || getStrEmpty(t4)  ) {

        alert("有空项未填写，请检查！");
        return;
    }


   // var postData = {  RunName: t1,RunUid: t3, RunPassword: t4 };
    hub.server.addRunsAgent(t1,t3,t4).done(function (result) {
        if (result == "ok") {
            alert('操作成功!');
            loadRunsData();
        } else {
            alert('失败!'+result);
        }
    }).fail(function (err) {
        alert('错误：' + err);
    });
}
//添加通道
function add_Run() {
    var t1 = $("#RunName").val().trim();
    var t2 = $("#RunGood").val().trim();
    var t3 = $("#RunUid").val().trim();
    var t4 = $("#RunPassword").val().trim();
    var t5 = $("#alipayF").val().trim();
    var t6 = $("#alipayT").val().trim();
    var t7 = $("#wechatF").val().trim();
    var t8 = $("#wechatT").val().trim();
    var t9 = $("#ysfF").val().trim();
    var t10 = $("#ysfT").val().trim();
    var t11 = $("#runKey").val().trim();
    var t12 = $("#OrderNotify").val().trim();
    var t13= $("#MoreParm").val().trim();
    var t14 = $("#BackParm").val().trim();
    var t15 = $("#jhF").val().trim();
    var t16 = $("#jhT").val().trim();

    var t17 = $("#topUserID").val().trim();
    var t18 = $("#topUserT").val().trim();
    var t19 = $("#lastUserID").val().trim();
    var t20 = $("#lastUserT").val().trim();


    if (getStrToIntWrong(t2)) {

        alert("通道代号只能是3个数字！");
        return;
    }
    if (getStrToFloatWrong(t5) || getStrToFloatWrong(t7) || getStrToFloatWrong(t9) || getStrToFloatWrong(t15)) {

        alert("错误，请检查费率是否正确！");
        return;
    }
    if (getStrEmpty(t1) || getStrEmpty(t3) || getStrEmpty(t4) || getStrEmpty(t6) || getStrEmpty(t8)
        || getStrEmpty(t10) || getStrEmpty(t16) 
       ) {

        alert("有空项未填写，请检查！");
        return;
    }


    var postData = { TopAgentUID: t17, TopAgentPT: t18, LastAgentUID: t19, LastAgentPT: t20,RunName: t1, RunGood: t2, RunUid: t3, RunPassword: t4, alipayF: t5, alipayT: t6, wechatF: t7, wechatT: t8, ysfF: t9, ysfT: t10, jhF: t15, jhT: t16, Key: t11, OrderNotify: t12, MoreParm: t13, BackParm: t14 };
    hub.server.addRuns(postData).done(function (result) {
        if (result == 1) {
            alert('添加成功!');
            loadRunsData();
        }  else {
            alert('添加失败!');
        }
    }).fail(function (err) {
        alert('错误：' + err);
    });
}
function loadRunsData() {

   // loadid = xtip.load();    
    var table = $('#run-datatables').DataTable();
    table.ajax.reload(function (json) {
       // xtip.close(loadid);
        //console.log(json);
    }, false);
}

//添加码入库
function add_Qrcode() {

    var isH5 = '';
    $.each($('input:checkbox'), function () {
        if (this.checked && $(this).val() =='qrH5') {
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
    
    var postData = { maType: t1, qrH5: t2, maUid: t3, maPwd: t4, maName: t5, maXianEr: t6, maXiaoShi: t7, maYiRi: t8, maXiaJia: t9, qrCodeAndMoney:t10 };
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


