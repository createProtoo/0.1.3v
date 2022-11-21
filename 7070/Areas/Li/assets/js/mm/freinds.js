//商户脚本

var tableListData2;

$(document).ready(function () {

    $('#ExcelForOrders').on('click',
        function () {
           // alert("hahaha");
            var table = $('#shop-datatables').DataTable();
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
    // alert(whichOderCmd);

    tableListData2 = $('#shop-datatables').DataTable({
        //stateSave: true,
        "searching": false,  //不显示搜索框
        "lengthMenu": [[100, 500, 5000,], ["100条", "500条", "5000条"]],
        "processing": true,
        "serverSide": true,
        "bSort": false, //排序功能
        "bAutoWidth": false,//自动宽度
        "iDisplayLength": 100, // 每页显示多少行
        columns: [
            //{ "defaultContent": "" },   //注意：当查出来的数据有的为null时，dataTable每次加载会弹窗警告，非常烦人，这个设置为空字符串，就不会警告了




            { "data": "name" },
            { "data": "phone" }


        ],
        "columnDefs": [//列定义

            {
                // "name": "myOrderID",
                "targets": 0,// 编辑

                "orderable": false,
                "bSortable": false,
                "render": function (data, type, row, meta) {
                    //alert(data);
                  

                    return data;
                }
            }




        ],
        "ajax": {
            "url": "/api/li/GetFreinds",
            "type": "POST",
            "data": function (d) {
                return $.extend({}, d, {

                    orderCmd: whichOderCmd //这个是哪个类型的订单

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



function GetOKTime(tmpDateTime) {
    var date = new Date(tmpDateTime);
    var localeString = date.toLocaleString();
    return localeString;
}

function getTime(timestamp) {
    var unixTimestamp = new Date(timestamp);
    commonTime = unixTimestamp.toLocaleString();
    console.log(commonTime)

    return commonTime;

}

