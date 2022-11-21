

var GLOBALS = GLOBALS || {};


function progress() {
    var win = $.messager.progress({
        title: '请稍后',
        msg: '正在加载数据...'
    });
    setTimeout(function () {
        $.messager.progress('close');
    }, 2400)
}
function confirm1() {
    $.messager.confirm('My Title', 'Are you confirm this?', function (r) {
        if (r) {
            alert('confirmed: ' + r);
        }
    });
}
function prompt1() {
    $.messager.prompt('请仔细确认', '请输入实际金额', function (r) {
        if (r) {
            var t = $('#thisMoney').html();
            var tt = $("#oneOrderID").val();
            if (r.indexOf(".")<0) {
                r=r+".00";
            }
            //alert(r);
            if (t == r) {

                GobalHub.server.orderBySelf(tt).done(function (result) {
                    if (result == 1) {
                        alert1('确认订单OK: ' + r);
                        $('#two').click()
                    } else {
                        alert3('确认订单失败: ' + r);
                    }

                });


               
            } else {
                alert3('金额不相同: ' + r+' 请仔细检查!');
            }
            
        }
    });
}


function alert1(str) {
    $.messager.alert('请注意', str);
}
function alert2(str) {
    $.messager.alert('请注意', str, 'error');
}
function alert3(str) {
    $.messager.alert('请注意', str, 'info');
}
function alert4(str) {
    $.messager.alert('请注意', str, 'question');
}
function alert5(str) {
    $.messager.alert('请注意', str, 'warning');
}


//******************************滚动广告***********
function autoScroll(obj) {
    $(obj).find("ul").animate({
        marginTop: "-39px"
    }, 500, function () {
        $(this).css({ marginTop: "0px" }).find("li:first").appendTo(this);
    })
}
function add() {

    var citys = new Array("上海", "江苏", "黑龙江", "重庆", "河北省", "山西省", "辽宁省", "吉林省", "黑龙江省", "江苏省", "浙江省", "安徽省", "福建省", "江西省", "山东省", "河南省", "湖北省", "湖南省", "广东省", "海南省", "四川省", "贵州省", "云南省", "陕西省", "甘肃省", "青海省");
    var qrkinds = new Array('聚合码', '云闪付', '支付宝', '微信', '赞呗', '原生H5');
    var ordersMoney = new Array('300元', '500元', '1500元', '3000元', '5000元', '4000元', '800元','2000元');
    $('#tmpUL').empty();
    let tdate = new Date(+new Date() + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');


    for (var i = 0; i <= 18; i++) {
        $('#tmpUL').append(' <li> <div>' + qrkinds[suijiNum(0, 5)] + '</div> <div>' + citys[suijiNum(0, 21)] + '</div> <div>' + ordersMoney[suijiNum(0, 7)] + '</div> <div>' + tdate+'</div> </li> ');
    }
}


function suijiNum(m,n) {
    var t = Math.floor(Math.random() * (m - n + 1)) + n;
    return t;
}

$(function () {
    setInterval('autoScroll(".maquee")', 2000);
    //setInterval('autoScroll(".apple")', 2000);
    setInterval('add()', 35000);
}) 


function checkbox(pram) {

    if (pram) {
        jqtoast('自动抢单开启成功...', 5000);
    } else {
        jqtoast('自动抢单关闭...', 5000);
    }
}
function checkboxTongCheng(pram) {

    if (pram) {
        jqtoast('同城专享开启成功...', 5000);
    } else {
        jqtoast('同城专享关闭...', 5000);
    }
}
