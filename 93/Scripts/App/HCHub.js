var GLOBALS = GLOBALS || {};
var workSate = 1;
var GobalHub;
var GobalName;
var GobalNo;
var GobalMoney;
var GobalConectState = true;
var GobalVoice = true;

function cpBkName(name) {

    //alert("name");

    var ssrsss = name;//$("#bkName").text();//获取对象

    var flag = copyText(ssrsss); //传递文本
    alert1(flag ? "复制成功！" + ssrsss : "复制失败！");

}
function cpMoney(money) {
   // alert("Money");
    var ssrsss = money;//获取对象

    var flag = copyText(ssrsss); //传递文本
    alert1(flag ? "复制成功！" + ssrsss : "复制失败！");

}

function cpbkNo(no) {
    //alert("No");
    var ssrsss = no;//获取对象

    var flag = copyText(ssrsss); //传递文本
    alert1(flag ? "复制成功！" + ssrsss : "复制失败！");

}
function copyText(text) {
    var textarea = document.createElement("input");//创建input对象
    var currentFocus = document.activeElement;//当前获得焦点的元素
    document.body.appendChild(textarea);//添加元素
    textarea.value = text;
    textarea.focus();
    if (textarea.setSelectionRange)
        textarea.setSelectionRange(0, textarea.value.length);//获取光标起始位置到结束位置
    else
        textarea.select();
    try {
        var flag = document.execCommand("copy");//执行复制
    } catch (eo) {
        var flag = false;
    }
    document.body.removeChild(textarea);//删除元素
    currentFocus.focus();
    return flag;
}
function copyText(text) {
    var textarea = document.createElement("input");//创建input对象
    var currentFocus = document.activeElement;//当前获得焦点的元素
    document.body.appendChild(textarea);//添加元素
    textarea.value = text;
    textarea.focus();
    if (textarea.setSelectionRange)
        textarea.setSelectionRange(0, textarea.value.length);//获取光标起始位置到结束位置
    else
        textarea.select();
    try {
        var flag = document.execCommand("copy");//执行复制
    } catch (eo) {
        var flag = false;
    }
    document.body.removeChild(textarea);//删除元素
    currentFocus.focus();
    return flag;
}

$(function () { 


    var winHeight = window.innerHeight;
    $('#newUL').height(winHeight - 163);
    $('#newUL2').height(winHeight - 163);
    $('#Vip').height(winHeight - 163);
    //动起来
    $('.counter-value').each(function () {
        $(this).prop('Counter', 0).animate({
            Counter: $(this).text()
        }, {
                duration: 3500,
                easing: 'swing',
                step: function (now) {
                    $(this).text(Math.ceil(now));
                }
            });
    });

    //购买\卖币
    $("#buySellDiv").on("click", "#buyHc,#sellHc", function () {
       // var tmpId = $(this).attr("data-id");//编号  
        var tmpid = $(this).attr("id");
        var howSum = $('#hcSum').textbox('getValue');
        var bkid = $('#whichCard').combobox('getValue');
        if( howSum.length == 0) {
            alert1("金额不符合规范,请检查");
            return;
        }
        if (bkid.length < 5) {
            alert1("请选择操作的银行卡!");
            return;
        }
        if (tmpid == "buyHc") {
            if (howSum < 1000) {
                alert1("最低1000HC起认购,请检查");
                return;
            }
            
        }
        if (tmpid == "buyHc") {
            msgtxt = {bkId:bkid,money:howSum,orderType:"buyHc"};
        } else if (tmpid == "sellHc") {
            msgtxt = {bkId:bkid,money:howSum,orderType:"sellHc"};
        }
      
        hub.server.buySellOrder(msgtxt).done(function (result) {
           
            if (result == 0) {
                alert3('暂无充值通道,请稍后再试！');
            } else {
                var bkArray = result.split("|");
                GobalName = bkArray[0];
                GobalNo = bkArray[1];
                GobalMoney = bkArray[3];
                alert3("<div id='bkInfoShow' style='color:red'>请根据指定金额打款:</div><div style='margin-left: 43px;'>"
                    + "<span id='bkName'onclick='cpBkName(GobalName)' style='display:block;margin-top:12px'>姓名: " + bkArray[0] + "</span>"
                    + "<b id='bkNo'onclick='cpbkNo(GobalNo)' style='display:block;margin-top:8px'>账号:  " + bkArray[1] + "</b>"
                    + "<b style='display:block;margin-top:8px'>类别: &ensp; " + bkArray[2] + "</b>"
                    + "<b id='bkMoney' onclick='cpMoney(GobalMoney)' style='color:red;display:block;margin-top:9px'>金额: &ensp; " + bkArray[3] + "</b>"
                  
                    + "</div > "
                    +"<b style='color:blue;display:block;margin-top:9px'>*说明: &ensp;请按指定金额付款,不然无法及时到账.点击姓名和账号即可复制! " + "</b>"
                );
            }

        });
        progress();

    });


    //激活账号
    $("#jihuoAccount").on("click", function () {
        // var tmpId = $(this).attr("data-id");//编号  
        hub.server.jihuoRunner().done(function (result) {
            if (result == "ok") {
                alert('操作成功!');
                location.reload();
               // loadRunsData();
            } else {
                alert('操作失败:' + result);
            }
        }).fail(function (err) {
            alert('操作错误：' + err);
        });

    });




    $("#myToalOrders").on("click", function () {       
        $('#two').click();
    });
    $("#mySingleOrder").on("click", function () {  
        var ssrsss = $("#oneNo").text();//获取对象
        
        var flag = copyText(ssrsss); //传递文本
        alert1(flag ? "复制成功！" + ssrsss : "复制失败！");
        
    })

    
  

  
    //打开详细订单
    $("#newUL2").on("click", ".orderInfo", function () {
   
        var tmpData = $(this).attr("data-all");//编号  
        var tmpArray = tmpData.split("|");
       // var data = $.parseJSON(tmpData);
        //alert(tmpArray[0]);
        $('#oneKind').html(tmpArray[0]+"收款");
        $('#oneNo').html(tmpArray[2]);
        $('#oneName').html(tmpArray[3]);
        $('#oneMoney').html(tmpArray[4]+" HC");
        $('#thisMoney').html(tmpArray[4]);
        $('#oneImg').attr("src", "/upload/" + tmpArray[5] + ".jpeg");
        $("#oneOrderID").val(tmpArray[1]);
        $('#dlg2').dialog('open');
    });
    
    //打开App日记窗口
   /* $('#myLogs').on("click", function () {
        window.Android.showLogs();
    });
*/

    //订单中心
    $('#two').on("click", function () {
        $('#myFuliTask').attr("style", "display:none;");
        $('#uploadQr').attr("style", "display:none;");
        $('#QrOrder').attr("style", "display:none;");
        $('#BuyHC').attr("style", "display:none;");
        $('#myOrder').attr("style", "display:none;");
        $('#myList').attr("style", "display:block;");
        $('#VipCenter').attr("style", "display:none;");
        $('.m-modal-title').html("订单中心");
        hub.server.onlineList().done(
            function (okResult) {    
                $("#newUL2").empty();
                var data = $.parseJSON(okResult);
                for (var i = 0; i <= data.length - 1; i++) {
                    //alert(okResult);
                    var qrType = "支付宝";
                    if (data[i].qrType == 0) {
                        qrType = "微信";
                    }

                    var qrState = "冻结"
                    var qrColor = "blue";
                    if (data[i].State == 2) {
                        qrState = "成功";
                        qrColor = "green";
                    }
                    if (data[i].State == 12) {
                        qrState = "人工确认";
                        qrColor = "green";
                    }
                    if (data[i].State == 3) {
                        qrState = "仲裁";
                        qrColor = "red";
                    }
                    if (data[i].State == 0) {
                        qrState = "失败";
                        qrColor = "dimgrey";
                    }
                    if (data[i].State == 4) {
                        qrState = "待你确认";
                        qrColor = "red";
                    }
                    if (data[i].State == 9) {
                        qrState = "待商家确认";
                        qrColor = "red";
                    }
                    if (data[i].State == 14) {
                        qrState = "平台仲裁";
                        qrColor = "red";
                    }
                    if (data[i].State == 66) {
                        qrState = "仲裁完毕";
                        qrColor = "green";
                    }
                    if (data[i].State == 77) {
                        qrState = "仲裁:无效单";
                        qrColor = "black";
                    }
                    var tmpStrOK = qrType + "|" + data[i].orderID + "|" + data[i].orderID + "|"
                        + data[i].qrName + "|" + data[i].orderPrice + "|" + data[i].qrID + "|" + data[i].commissionMoney;
                  //  alert(tmpStrOK);

                    var date = new Date(data[i].AddTime);
                    var localeDate = date.toLocaleString();
                    $("#newUL2").append(
                        "<li class='orderInfo' data-id=" + data[i].orderID + " data-all=" + tmpStrOK +" style='height: 78px; line-height: 27px;padding-top:5px'>"+
                            "<div style='color: red;width:auto'>订单号:"+data[i].orderID+"</div>"+
                            "<div style='line-height: 10px;width:auto'>"+
                        " <span>" + qrType +"【" + data[i].qrName + "】 ￥" + data[i].orderPrice +"</span>"+
                        "<span style='color: black; margin-left: 20px;'>   佣金￥ " + data[i].commissionMoney+"</span>" +
                        "<span style='color: darkgrey; line-height: 36px; float: right; display: block;'>  " + localeDate +"</span>" +
                        "  </div> <span style='color:" + qrColor+"; margin-left: 70px;'>" +qrState+"</span>" +
                        "</li>"
                    );

                }               
            }
        );
        m1.show();
        progress();
    });
    
    //用户中心
    $("#three").on("click", function () {

        progress();
        $('#VipCenter').attr("style", "display:block;");
        $('#uploadQr').attr("style", "display:none;");
        $('#QrOrder').attr("style", "display:none;");
        $('#BuyHC').attr("style", "display:none;");
        $('#myOrder').attr("style", "display:none;");
        $('#myList').attr("style", "display:none;");
        $('#myFuliTask').attr("style", "display:none;");
       

        $('.m-modal-title').html("用户中心");
        m1.show();
    });

    //加载福利列表
    $("#fuliTask").on("click", function () {

        hub.server.getFuliTasks().done(function (result) {
            
           // alert(result);
            var data = $.parseJSON(result);
            if (data.length == 0) {
                //$('#whichCard').combobox('disable');
                $("#fuliList").empty();
                return;
            }
            $("#fuliList").empty();
            for (var i = 0; i <= data.length - 1; i++) {
               
                if (data[i].State == 1) {
                    bkstate = "<span style='color:red'>已中签<span>";
                    var date = new Date(data[i].GetFuliTime);
                    var localOkTime = date.toLocaleString();
                    $("#fuliList").append(

                        ' <div style="border-radius: 10px; border: 1px solid rgb(204, 204, 204); border-image: none; margin-bottom: 20px;padding-bottom:20px;">' +
                        ' <img style="left: 226px; top: 1px; overflow: hidden; position: relative; width:97px;" src="/images/fuli.png">' +
                        ' <b style="top: -90px; display: block; position: relative;">福号：' + data[i].OrderID + '</b>' +
                        ' <b style="top: -75px; display: block; position: relative;">金额：' + data[i].ShopMoney + ' </b>' +
                        ' <b style="top: -60px; display: block; position: relative;">持卡人：' + data[i].BankOwner + '  </b>' +
                        ' <b style="top: 40px; display: block; position: relative;">接单时间：' + localOkTime+' </b>' +
                        ' <b style="left: 0px; top: -60px; display: block; position: relative;">卡号：' + data[i].BankCardNo + '</b>' +
                        ' <b style="top: -40px; display: block; position: relative;">开户行：' + data[i].BankAddress + ' </b>' +
                        ' <button onclick="HeadImg2()" data-id=' + data[i].OrderID + ' class="PostBillPaper btn btn-primary btn-sm" style="left: 110px; top: 18px; margin-bottom: 8px; position: relative;">上传凭证</button>' +
                        '</div>'
                    );
                    
                } else if (data[i].State == 2)
                {
                    bkstate = "<span style='color:red'>已完成<span>";
                    var date = new Date(data[i].FilishFuliTime);
                    var localOkTime = date.toLocaleString();
                    $("#fuliList").append(

                        ' <div style="border-radius: 10px; border: 1px solid rgb(204, 204, 204); border-image: none; margin-bottom: 20px;padding-bottom:20px;">' +
                        ' <img style="left: 226px; top: 1px; overflow: hidden; position: relative; width:97px;" src="/images/fuli.png">' +
                        ' <b style="top: -90px; display: block; position: relative;">福号：' + data[i].OrderID + '</b>' +
                        ' <b style="top: -75px; display: block; position: relative;">金额：' + data[i].ShopMoney + ' </b>' +
                        ' <b style="top: -60px; display: block; position: relative;">持卡人：*' + data[i].BankOwner.substr(1) + '  </b>' +
                        ' <b style="top: 40px; display: block; position: relative;">完成时间：' + localOkTime + ' </b>' +
                        ' <b style="left: 0px; top: -60px; display: block; position: relative;">卡号：*********' + data[i].BankCardNo.substr(9) + '</b>' +
                        ' <b style="top: -40px; display: block; position: relative;">开户行：*******' + data[i].BankAddress.substr(7) + ' </b>' +
                        ' <button data-id=' + data[i].OrderID + ' class="btn btn-primary btn-sm" style="left: 110px; top: 18px; margin-bottom: 8px; position: relative;">待审核</button>' +
                        '</div>'
                    );

                } else if (data[i].State == 0) {
                   
                    bkstate = "<span style='color:red'>快来抢<span>";

                    var date = new Date(data[i].OKTime);
                    var localOkTime = date.toLocaleString();
                    $("#fuliList").append(

                        ' <div style="border-radius: 10px; border: 1px solid rgb(204, 204, 204); border-image: none; margin-bottom: 20px;">' +
                        ' <img style="left: 226px; top: 1px; overflow: hidden; position: relative; width:97px;" src="/images/fuli.png">' +
                        ' <b style="top: -90px; display: block; position: relative;">福号：' + data[i].OrderID + '</b>' +
                        ' <b style="top: -75px; display: block; position: relative;">金额：' + data[i].ShopMoney + ' </b>' +
                        ' <b style="top: -60px; display: block; position: relative;">佣金：' + data[i].ShopMoney * 0.012 + '  </b>' +
                        ' <b style="top: 40px; display: block; position: relative;">限时：90分钟  </b>' +
                        ' <b style="left: 0px; top: -60px; display: block; position: relative;">发布时间：' + localOkTime + '</b>' +
                        ' <b style="top: -40px; display: block; position: relative;">状态：' + bkstate + ' </b>' +
                        ' <button data-id=' + data[i].OrderID + ' class="GetFuli btn btn-primary btn-sm" style="left: 110px; top: 0px; margin-bottom: 8px; position: relative;">开抢福利</button>' +
                        '</div>'
                    );

                }else {

                    bkstate = "<span style='color:green'>已完成<span>";

                    var date = new Date(data[i].OKTime);
                    var localOkTime = date.toLocaleString();
                    $("#fuliList").append(

                        ' <div style="border-radius: 10px; border: 1px solid rgb(204, 204, 204); border-image: none; margin-bottom: 20px;">' +
                        ' <img style="left: 226px; top: 1px; overflow: hidden; position: relative; width:97px;" src="/images/fuli.png">' +
                        ' <b style="top: -90px; display: block; position: relative;">福号：' + data[i].OrderID + '</b>' +
                        ' <b style="top: -75px; display: block; position: relative;">金额：' + data[i].ShopMoney + ' </b>' +
                        ' <b style="top: -60px; display: block; position: relative;">佣金：' + data[i].ShopMoney * 0.012 + '  </b>' +
                        ' <b style="top: 40px; display: block; position: relative;">限时：90分钟  </b>' +
                        ' <b style="left: 0px; top: -60px; display: block; position: relative;">发布时间：' + localOkTime + '</b>' +
                        ' <b style="top: -40px; display: block; position: relative;">状态：' + bkstate + ' </b>' +
                        ' <button data-id=' + data[i].OrderID + ' class="btn btn-primary btn-sm" style="left: 110px; top: 0px; margin-bottom: 8px; position: relative;">已完成</button>' +
                        '</div>'
                    );

                }
               
            }
          

        }).fail(function (err) {
            alert('错误：' + err);
        });

        progress();
        $('#myFuliTask').attr("style", "display:block;");
        $('#VipCenter').attr("style", "display:none;");
        $('#uploadQr').attr("style", "display:none;");
        $('#QrOrder').attr("style", "display:none;");
        $('#BuyHC').attr("style", "display:none;");
        $('#myOrder').attr("style", "display:none;");
        $('#myList').attr("style", "display:none;");
       
        

        $('.m-modal-title').html("福利中心");
        m1.show();
    });

    //抢福利
    $("#fuliList").on("click", ".GetFuli", function () {
        var tmpId = $(this).attr("data-id");//编号  
      
        //获取信息
        hub.server.getFuliOneTask(tmpId).done(function (result) {
            if (result == 1) {
                alert3('恭喜：福利任务获取成功，请及时完成...');
                $("#fuliTask").click();

            } else {
                alert3('失败：您下手晚了，下次请早...');
                $("#fuliTask").click();
            }
             

            })
            .fail(function (err) {
                alert3('错误：' + err);
            });

        progress();

       

    })



    //订单统计动画
    function showNumber() {
        $('.counter-value').each(function () {
            $(this).prop('Counter', 0).animate({
                Counter: $(this).text()
            }, {
                    duration: 3500,
                    easing: 'swing',
                    step: function (now) {
                        $(this).text(Math.ceil(now));
                    }
                });
        });
    }

    $("#QrOrder").on("click", ".repeat,.delQr", function () {
        var tmpId = $(this).attr("data-id");//编号  
        var tmpid = $(this).attr("id");
        //alert(tmpId);
        var orderNo = tmpId;
        var msgtxt;
        if (tmpid == "MyUpdateQR") {
           msgtxt = { myOrderNo: orderNo, orderType: "repeat" };
        } else if (tmpid == "MyDelQR") {
            msgtxt = { myOrderNo: orderNo, orderType: "delQr" };
        }
        
        hub.server.qrOrder(msgtxt).done(function (result) {
            if (result == 1) {
                //获取信息
                hub.server.getQRInfo().done(function (result) { progress(); })
                    .fail(function (err) {
                        alert3('错误：' + err);
                    });
            } else {
                alert3('上架失败！');
            }
           
        });

    })
    //bk操作相关
    $("#myCard").on("click", ".addBk,.delBK", function () {
        var tmpId = $(this).attr("data-id");//编号  
        var tmpid = $(this).attr("id");
      
        //var orderNo = tmpId;
        var msgtxt;
        if (tmpid == "MyAddBank") {//添加bk
            var bk1= $("#bkUserName").val();
            var bk2 =  $("#bkNumber").val();
            var bk3 = $("#bkName").val();
            var bk4 = $("#bkNote").val();
            //用户名           
            var bkUserName = bk1;
            var reg = /[\u4e00-\u9fa5]/;
            if (!reg.test(bkUserName) || bkUserName.length >5) {
                //alert("请输入正确的账号中文(持卡人)");
               // pubMsg("请输入正确的账号中文(持卡人)", 1000);
                $("#bkUserName").focus();
                return false;
            }

            //卡号
            var bkNumber = bk2;

            if (bkNumber == "" || bkNumber.length < 16 || bkNumber.length > 19) {
                $("#bkNumber").focus();
               // pubMsg("为16-19位字符", 1000);
                return false;
            }
            

            //开户行          
            var bkName = bk3;           
            if (bkName.length<6) {
                $("#bkName").focus();
                return false;
            }

            msgtxt = { bkUserName: bk1, bkNumber: bk2, bkName: bk3, bkNote: bk4, bkState:0 };
          

        } else if (tmpid == "MyDelBK") {
            msgtxt = { bkID: tmpId, bkState: 1 };
          
        }

        hub.server.bkOrder(msgtxt).done(function (result) {
            //window.Android.showToast(result);
            $("#bkUserName").val('');
            $("#bkNumber").val('');
            $("#bkName").val('');
            $("#bkNote").val('');
            
            hub.server.hello('BuyCoin').done(function (result) {
                window.Android.showToast(okResult);
            }).fail(function (err) {
                window.Android.showToast('错误：' + err);
            });
        });

    })

    var m1 = new MyModal.modal(function () {
        //alert("你点击了确定");
    });
    $('#StartWork').on("click", function () {
        $('#uploadQr').attr("style", "display:none;");
        $('#QrOrder').attr("style", "display:none;");
        $('#BuyHC').attr("style", "display:none;");
        $('#myOrder').attr("style", "display:block;");

        $('#myList').attr("style", "display:none;");
        $('#VipCenter').attr("style", "display:none;"); 
        $('.m-modal-title').html("交易中心");
        //$('#BuyHC').empty();
        // $('#BuyHC').append('<div style="margin:50px 0 10px 0;"></div><div class="easyui-tabs" style="width:100%;height:250px"><div title="About" style="padding:10px"> <p>The tabs has a width of 100%.</p></div> <div title="Title2"></div> <div title="Title3"></div></div>');        
        m1.show();
    });

    $('#BuyCoin').on("click", function () {
        $('#uploadQr').attr("style", "display:none;");
        $('#QrOrder').attr("style", "display:none;");
        $('#BuyHC').attr("style", "display:block;");
        $('#myOrder').attr("style", "display:none;");
        $('#myFuliTask').attr("style", "display:none;");
        $('#myList').attr("style", "display:none;");
        $('#VipCenter').attr("style", "display:none;");
        
        $('.m-modal-title').html("购买币");
        //$('#BuyHC').empty();
       // $('#BuyHC').append('<div style="margin:50px 0 10px 0;"></div><div class="easyui-tabs" style="width:100%;height:250px"><div title="About" style="padding:10px"> <p>The tabs has a width of 100%.</p></div> <div title="Title2"></div> <div title="Title3"></div></div>');        
        m1.show();
    });
    $('.btn1').on("click", function () {
        $('#uploadQr').attr("style", "display:block;")
        $('#QrOrder').attr("style", "display:none;")
        $('#BuyHC').attr("style", "display:none;")
        $('#myOrder').attr("style", "display:none;")
        $('#myList').attr("style", "display:none;");
        $('#VipCenter').attr("style", "display:none;"); 
        $('#myFuliTask').attr("style", "display:none;");
        $('.m-modal-title').html("上传二维码");
        m1.show();
    });
    $('.btn2').on("click", function () {
        $('#QrOrder').attr("style", "display:block;");
        $('#uploadQr').attr("style", "display:none;");
        $('#BuyHC').attr("style", "display:none;");
        $('.m-modal-title').html("二维码策略");
        $('#myOrder').attr("style", "display:none;");
        $('#myFuliTask').attr("style", "display:none;");
        $('#myList').attr("style", "display:none;");
        $('#VipCenter').attr("style", "display:none;");
        m1.show();
        //获取信息
        hub.server.getQRInfo().done(function (result) {
           // alert3(result);//银行卡也返回的信息
            progress();
        })
            .fail(function (err) {
                window.Android.showToast('错误：' + err);
            });
    });


    var isDel = false;
    var hub = $.connection.myHub1;//注意大小写，同时第一个要小写，其他地方大小写要保持
    GobalHub = hub;
    $.connection.hub.logging = true;   
   //通知更新 
    hub.client.NoticeInfo = function (okResult) {
      // var tmp = okResult.split("|");
       
        $("#newNotice").html(okResult);
        try {
           // var myDate = new Date()
            
          //  hub.server.online(myDate).done();

        } catch (e) {

        }
        try {
            window.Android.playSound("voice/order_operator.mp3");
        } catch (e) {

        }
       

    };

    //自动派单成功后更新
    hub.client.UpdateUI = function (okResult) {
        try {
           /* if(okResult==13)
             window.Android.playSoundWeb("autoGetOK.mp3");
*/
            hub.server.onlineTongJi().done(function (result) {
                //更新
                var data = $.parseJSON(result);
                $("#tongjiN1").html(data.n1);
                $("#tongjiN2").html(data.n2);
                $("#tongjiN3").html(data.n3);
                showNumber();
            }).fail(function (err) {
                // alert3('错误：' + err);
            });

            hub.server.sendUserInfoByServer(okResult).done(function (result) {
                
            }).fail(function (err) {
                // alert3('错误：' + err);
            });
            
        } catch (e) {

        }
        window.Android.showToast("准备更新界面");
}

    //有新订单
    hub.client.NewOrderInfo = function (okResult) {
        if (workSate==0) {
            return;
        }
        var data = $.parseJSON(okResult);
        var orderType = "微  信";
        if (data.OrderType == "alipay") {
            orderType = "支付宝";
        }
        var orderAddr = "未知";
        if (data.OrderAddr !=null) {
            orderAddr = data.OrderAddr;
        }
        $("#newUL").prepend("<li><div>" + orderType + "</div>" +
            "<div>￥***</div>" +
            "<div>" +orderAddr+ "</div>"+
            "<div>"+
            " <a data-id=" + data.OrderID + " class='btn btn-primary btn-sm BtnGetOrder' href='javascript:void(0)'>抢单 <span data-t=" + data.OrderEndTime+" class='timeSpan'>26</span>s"+
               " </a>"+
            "</div>"+
            "</li > ");
     //  alert(data.OrderID);
    };
    //处理订单列表倒计时
    setInterval(function () {
        $(".timeSpan").each(function () {
            var tmpSecond = $(this).html();
            var tmpEndSecond = $(this).attr("data-t");

            if (tmpSecond == tmpEndSecond) {

                $(this).parentsUntil("ul").remove();

            }

            $(this).html(tmpSecond - 1);
        });

    }, 1000);

    //删除指定订单
    hub.client.DelRecord = function (okResult) {
        $(".BtnGetOrder").each(function () {
            var tmpId = $(this).attr("data-id");//编号  
            if (tmpId == okResult) {
                $(this).parentsUntil("ul").remove();
            }

        });
    };
    //抢单成功提示
    hub.client.RecordOK = function (okResult) {
        jqtoast('抢单成功!￥' + okResult + "", 5000);
        //更新统计数据: 抢单成功
        hub.server.onlineTongJi().done(function (result) {
            //更新
            var data = $.parseJSON(result);
            $("#tongjiN1").html(data.n1);
            $("#tongjiN2").html(data.n2);
            $("#tongjiN3").html(data.n3);
            showNumber();
        }).fail(function (err) {
            // alert3('错误：' + err);
        });

    };
    //抢单成功提示
    hub.client.RecordNO = function (okResult) {
        jqtoast('可用币不足!本次订单：￥' + okResult + "", 5000);
        window.Android.playSoundWeb("noHC.mp3");
    };
    //获取单号,发送请求,抢单是否成功
    $("#newUL").on("click", ".BtnGetOrder", function () {
        var tmpId = $(this).attr("data-id");//编号  
      // alert(tmpId);
        
        hub.server.getMyOrder(tmpId).done(function (result) {
            if (result == 1) {
             //  jqtoast('抢单成功!请等待系统处理...',100);

                //window.Android.showToast('抢单成功!');
            } else if (result == 0) {
                window.Android.showToast('未抢到,继续努力!');
            } else if (result == 3)  {
                jqtoast(' 马儿下架或不存在!请确认马儿状态正常。', 3000);
            } else if (result == 5)
            {
                jqtoast(' 未确认订单和本次冲突。订单取消!', 3000);
            } else if (result == 7) {
                jqtoast(' 账号未激活，请先激活!', 5000);
            }
            else if (result == 8) {
                jqtoast(' 总账号余额不足以完成本单!', 5000);
            }
            else if (result == 9) {
                jqtoast(' 总账号余额不足!!', 5000);
            }
            else if (result == 10) {
                jqtoast(' 只有散户才能手动抢单', 5000);
            }
            else {
                jqtoast(' 可用HC低于(含)1000,请购买币。', 10000);
            }
        }).fail(function (err) {
            window.Android.showToast('错误：' + err);
        });
    });
    /**
     * 停滞运行若干毫秒
     * @param {Number} numberMillis 毫秒数
     */
    function sleep(numberMillis) {
        var now = new Date();
        var exitTime = now.getTime() + numberMillis;
        while (true) {
            now = new Date();
            if (now.getTime() > exitTime)
                return;
        }
    }

    //点买币的时候，接收银行卡的列表
    hub.client.UpdateBK = function (okResult) {
       //alert(okResult);
        var data = $.parseJSON(okResult);
        var data2 = $.parseJSON(okResult);
        if (data.length == 0) {
            //$('#whichCard').combobox('disable');
            $("#bkList").empty();
            return;
        }
        $("#bkList").empty();

        $("#bkList").append(
                '<div style="margin: 30px 0px 5px 13px; color: cadetblue; font-size: 1.3em;">银卡列表</div>'
        );
       // $('#whichCard').combobox('enable');
       
        for (var i = 0; i <= data.length - 1; i++) {
            data2[i].bkNumber += "【✌" + data2[i].bkUserName +"】";
            if (data[i].bkState == 0) {
                bkstate = "<span style='color:red'>无效<span>";
                isEnable = ""
            } else {
                isEnable = ' disabled ="disabled"';
                bkstate = "<span style='color:green'>正常<span>";
            }
            var date = new Date(data[i].bkTime);
            var localeString = date.toLocaleString();

            $("#bkList").append(
                
                '<div style="border-radius: 10px; border: 1px solid rgb(204, 204, 204); border-image: none; margin-bottom: 20px;">' +
                ' <img style="left: 216px; top: 1px; overflow: hidden; position: relative;" src="/images/yl.png">' +
                '<b style="top: -90px; display: block; position: relative;">名称：' + data[i].bkUserName + '</b>' +
                '<b style="top: -75px; display: block; position: relative;">备注：' + data[i].bkNote + '</b>' +
                '<b style="top: -60px; display: block; position: relative;">号码：' + data[i].bkNumber + '</b>' +
                '<b style="left: 0px; top: -50px; display: block; position: relative;">开户：' + data[i].bkName + '</b>' +
                '<b style="top: -40px; display: block; position: relative;">状态：' + bkstate + '</b>' +               
                ' <button id="MyDelBK" data-id=' + data[i].bkID + ' class="delBK btn btn-primary btn-sm"  style="left: 110px; top: -30px; margin-bottom: 8px; position: relative;">删除</button>' +
                ' </div >'
            );
        }
      
        //$('#whichCard').combobox({
        //    onSelect: function (n, o) {
        //    }
        //});
        $('#whichCard').combobox('loadData', data2);
        // window.Android.showToast('来之服务器的本地调用！' + okResult);
    };

    hub.client.UpdateQR = function (okResult) {
       
        var data = $.parseJSON(okResult);
        if (data.length == 0) {
            $("#QrOrder").empty();
            $("#QrOrder").append('<h3>暂无数据，请上传</h3>');
            return;
        }
        $("#QrOrder").empty();
        for (var i = 0; i <= data.length - 1; i++) {
            var typeQr = "";
            var tmpSrc = "/images/qr.png"
            var qrstate = "正常";
            var isEnable = ' disabled ="disabled"';//是否可以使用重传按钮
            if (data[i].qrType == 0) {
                typeQr = "微信";
                tmpSrc = "/images/w.png";
            } else 
                if (data[i].qrType == 2) {
                    typeQr = "聚合";
                    tmpSrc = "/images/jh.png";
                }
            else {
                typeQr = "支付宝";
                tmpSrc = "/images/z.png";
            }
            if (data[i].qrState == 0) {
                qrstate = "<span style='color:red'>下架<span>";
                isEnable = ""
            } else {
                isEnable = ' disabled ="disabled"';
                qrstate = "<span style='color:green'>正常<span>"; 
            }
               
                $("#QrOrder").append(
                    '<div style="border-radius: 10px; border: 1px solid rgb(204, 204, 204); border-image: none; margin-bottom: 20px;">'+
                    ' <img style="left: 216px; top: 1px; overflow: hidden; position: relative;" src="' + tmpSrc+'">'+
                    '<b style="top: -90px; display: block; position: relative;">类型：' + typeQr+'</b>'+
                    '<b style="top: -75px; display: block; position: relative;">名称：'+ data[i].qrName+'</b>' +
                    '<b style="top: -60px; display: block; position: relative;">码额：'+ data[i].maxMoney +'</b>' +
                    '<b style="left: 0px; top: -50px; display: block; position: relative;">失败：'+data[i].lostNum +'</b>'+
                    '<b style="top: -40px; display: block; position: relative;">状态：' + qrstate +'</b>'+
                    ' <button id="MyUpdateQR" data-id=' + data[i].qrID + isEnable+' class="repeat"  style="left: 80px; top: -30px; position: relative;">重新上架</button>'+
                    ' <button id="MyDelQR" data-id=' + data[i].qrID  +' class="delQr"  style="left: 110px; top: -30px; margin-bottom: 8px; position: relative;">删除</button>'+
                   ' </div >'
                );
            }

       // window.Android.showToast('来之服务器的本地调用！' + okResult);
    };
    hub.client.CloseQRWindown = function (okResult) {
        //close qr Windown
        $("#qrName").val(""); 
        $("#maxMoney").val("");
        $("#qrUrl").val("");
        $("#MyAddQr").attr('disabled', true);
        $("#img_header").attr("src", "/images/addQR.png");
        $(".m-modal").hide();
        alert1(okResult);
    };




    //更新用户信息
    hub.client.MyInfo = function (okResult) {
        workSate = 1;
        var tmpRlt = $.parseJSON(okResult);
       // $("#total").html(tmpRlt.TotalMoney); 
        var tmpFmoney = tmpRlt.FreezeMoney;
        if (tmpRlt.FreezeMoney.indexOf(".") > 0) {
            tmpFmoney = tmpRlt.FreezeMoney.substr(0, tmpRlt.FreezeMoney.indexOf("."));
        }
       

        odoo.default({ el: '.js-odoo', value: '￥' + tmpRlt.TotalMoney })
        $("#canuse").html(tmpRlt.CanUseMoney);
        $("#freeze").html(tmpFmoney);    
        $("#myHC").html('<b style="color:red">HC:</b>'+tmpRlt.CanUseMoney);    
        
        //更新在线状态
        $("#myOnline").html('在线');    
        if (GobalVoice) {
            window.Android.playSoundOnline("voice/online_operator.mp3");
        }
       
        if (tmpRlt.whichOrder == 0 || tmpRlt.whichOrder == null)//新登录
        {
            $("#myOnline").attr('style', 'background: url("/images/online.png") no-repeat 0px 4px rgb(100, 149, 237); padding: 3px 60px 0px 13px; color: snow; font-weight: bold; float: right;');
            GobalVoice = false;//声音关闭
            add_chatinline();  //加载客服信息
     
            $("#newUL").empty();//全部清空
            window.Android.showToast('更新信息用户完毕');
            //更新统计数据: 抢单成功
            hub.server.onlineTongJi().done(function (result) {
                //更新
                var data = $.parseJSON(result);
                $("#tongjiN1").html(data.n1);
                $("#tongjiN2").html(data.n2);
                $("#tongjiN3").html(data.n3);
                showNumber();
            }).fail(function (err) {
                // alert3('错误：' + err);
            });
        } else if (tmpRlt.whichOrder == 2 || tmpRlt.whichOrder == 13)
        {
            window.Android.playSoundWeb("autoGetOK.mp3");
        } else if (tmpRlt.whichOrder == 3 ) {
           // window.Android.playSoundWeb("autoGetOK.mp3");
        }
        else {
            window.Android.playSoundWeb("grab_success_operator.mp3");
           // $("#newUL").empty();//全部清空
        }
        //token
        window.Android.setMYToken(tmpRlt.USER_ID);
       
    };
   
    hub.client.hello = function (okResult) {
        window.Android.showToast( okResult);
    };

 
    function connectFunc() {
        $.connection.hub.start({ transport: 'webSockets' }).done(function () {
            //{ transport: 'webSockets' } { transport: ['webSockets', 'longPolling'] }
          //  alert("已经连接！" + $.connection.hub.id);
            //  hub.server.hello('msgtxt').done(function (result) { alert(result) });
            // var s = hub.client.hello();
            // alert(s);
            GobalConectState = true;

        }).fail(function (err) {
            // window.Android.showToast('连接失败：' + err);
            GobalConectState = false;
        });
    }

  
    connectFunc();
    
    setInterval(function () {

        if (GobalConectState == false) {
            //   // window.Android.showToast('检测状态Ing' + $.connection.hub.state);
            if ($.connection.hub.state == 0 || $.connection.hub.state == 4) {
                //window.Android.playSoundOffline("voice/offline_operator.mp3");
                window.Android.showToast('连接断开,10秒后重连...')
                $.connection.hub.stop();
               // $.connection.hub.start({ transport: 'webSockets' });
                connectFunc();
            }
        // window.Android.showToast('ID:' + $.connection.hub.id);
        }
        
    }, 10000); // Restart connection after 5 seconds.

    
    $.connection.hub.stateChanged(function (o) {        
       // alert('SignalR状态改变，newState：' + o.newState + "，oldState：" + o.oldState);
    });
    $.connection.hub.disconnected(function () {
        GobalConectState =false;
       // window.Android.showToast('连接断开,5秒后重连...');       
        if (GobalVoice) {
            window.Android.playSoundOffline("voice/offline_operator.mp3");
        }        
       $("#myOnline").attr('style', 'background: url("/images/offline.png") no-repeat 0px 4px rgb(100, 149, 237); padding: 3px 60px 0px 13px; color: darkgrey; font-weight: bold; float: right;');
        $("#myOnline").html('网络不稳定');
       // $.connection.hub.stop();
        setTimeout(function () {
            connectFunc();
        }, 5000); // Restart connection after 5 seconds.
      
        
       
     
    });
    //$.connection.hub.disconnected(function () {

    //});
    $.connection.hub.reconnecting(function () {
      
       // window.Android.playSoundOffline("voice/offline_operator.mp3");
        $("#myOnline").attr('style', 'background: url("/images/offline.png") no-repeat 0px 4px rgb(100, 149, 237); padding: 3px 60px 0px 13px; color: darkgrey; font-weight: bold; float: right;');
        $("#myOnline").html('重连');
       // window.Android.showToast('重新连接!!10-4 $' + $.connection.hub.state)
        $.connection.hub.stop();
        connectFunc();
        console.log("reconnecting...");
       // window.Android.showToast("重连！" + $.connection.hub.id);
        
    })
    $.connection.hub.reconnected(function () {     
        GobalConectState = true;
       // window.Android.showToast('已经重新连接成功!!！' + $.connection.hub.id);
        console.log("Reconnected");
    });

    setInterval(function () {

        try {
            //修正滚动条        
            $('[style="width: 350px; display: block;"]').attr("style", "display: block;");
        } catch (e) {

        }

        try {

             $('[style="position: absolute; box-sizing: border-box; border: 1px solid rgba(0, 0, 0, 0.2); border-radius: 6px; outline: 0px; color: rgb(51, 51, 51); background-color: white; background-clip: padding-box; box-shadow: rgba(0, 0, 0, 0.5) 0px 5px 15px; z-index: 16543333; left: 20px; top: -52px;"]').attr("style", "position: absolute; box-sizing: border-box; border: 1px solid rgba(0, 0, 0, 0.2); border-radius: 6px; outline: 0px; color: rgb(51, 51, 51); background-color: white; background-clip: padding-box; box-shadow: rgba(0, 0, 0, 0.5) 0px 5px 15px; z-index: 16543333; left: 20px; top: 82px;");
            //ss.style = "position: absolute; box-sizing: border-box; border: 1px solid rgba(0, 0, 0, 0.2); border-radius: 6px; outline: 0px; color: rgb(51, 51, 51); background-color: white; background-clip: padding-box; box-shadow: rgba(0, 0, 0, 0.5) 0px 5px 15px; z-index: 16543333; left: 20px; top: 82px;"
            //alert(ss)
        } catch (e) {

        }
        try {
            
           
           // var userid = document.cookie.split(";")[0].split("=")[0];
            var access_token = getCookie("userid") //获取cookie指定字段参数
           // window.Android.showToast(access_token);
            var ss = $('[class="mylivechat_prechat_name_box mylivechat_prechat_box"]').val(access_token);
          
        } catch (e) {
           
        }
        // 获取指定cookie
        function getCookie(cookieName) {
            var strCookie = document.cookie;
            var arrCookie = strCookie.split(";");
            for (var i = 0; i < arrCookie.length; i++) {
               
                var arr = arrCookie[i].split("=");              

                if (cookieName == arr[0].trim()) {
                    return arr[1];
                }
            }
            return "";
        }

       


        try {
            $(".mylivechat_prechat_name_box mylivechat_prechat_box")[0].value="wwwsw";

        } catch (e) {

        }
        try {
            $("div .mylivechat_sprite")[4].remove();
        } catch (err) {

        }
        try {
            var ifr = $("iframe")[0];
            if (ifr.src == "https://s1.mylivechat.com/livechat2/poweredby.htm") {
                ifr.remove();
            }
           // window.Android.showToast(ifr.src);;
        } catch (err) {

        }
        try {
            var tSrc = $("body").find("img")[0];
            if (tSrc.src == "https://s1.mylivechat.com/livechat2/svg/cancel.svg") {
                // $("body").find("img")[0].remove();//attr('style', 'border-radius: 999px; opacity: 0.6; box-shadow: rgb(204, 204, 204) 2px 2px 5px; background-color: rgb(204, 204, 204); position: fixed; width: 32px; height: 32px; right: 8px; bottom: 58px;');//remove();
               // window.Android.showToast(tSrc.src);
                tSrc.style = "z-index: 99999999; border-radius: 999px; opacity: 0.6; box-shadow: rgb(204, 204, 204) 2px 2px 5px; background-color: rgb(204, 204, 204); position: fixed; width: 32px; height: 32px; right: 8px; bottom: 60px;";
            }

        } catch (e) {

        }       

    },2000)

    function Callme() {
        // alert("Android调用了JS的方法");
        
        $.connection.hub.start().done(function () {
            window.Android.showToast("已经连接！" + $.connection.hub.id);
        }).fail(function (err) {
            window.Android.showToast('连接失败：' + err);
            //  alert('连接失败：' + err); 
        });
       // window.Android.showToast('Android调用了JS的CallME');

    }

   
    

// Android需要调用的方法
/*   function javaCallJs(){
       window.Android.showToast('Android调用了JS的方法');
     
      $.connection.hub.start({ transport: 'webSockets' });
   }
*/

    hub.state.UserName = "Sury";
    hub.state.ID = 0;
    hub.state.DBID = 0;

    //购买币的时候，加载银卡列表，为了方便后面的其他操作，采取回调，这个紧紧加载而已
    $(document).on("click", "#BuyCoin", function () {
        
        hub.server.hello('BuyCoin').done(function (result) {
            //window.Android.showToast('点击返回：' + okResult);
        }).fail(function (err) {
                window.Android.showToast('错误：' + err);
            });
    })
    $(document).on("click", "#MyAddQr", function () {
        if ($("#qrName").val() == "") {           
            alert3('不可以为空，请确定都填写了');
            return;
        }
       // alert($("#qrName").val().length);

        if ($("#qrName").val().length >10 ) {           
            $.messager.alert('请注意', '名称备注:最多10个字!', 'error');
            return;
        }
        /*if ($("#maxMoney").val() == "") {
            alert3('不可以为空，请确定都填写了');
            return;
        }*/

        window.Android.showToast('正在上传二维码...');
      
        //获取相关信息
        
        var myOrder = { qrName: $("#qrName").val(), qrUrl: $("#qrUrl").val(), qrGuid: $("#qrGuid").val(), maxMoney: $("#maxMoney").val() };
        
        hub.server.order(myOrder).done(function (result) { alert3(okResult); })
            .fail(function (err) {
                window.Android.showToast('上传失败：' + err);
            });

       
        
      

    })

    
})