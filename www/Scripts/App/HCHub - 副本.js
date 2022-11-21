var GLOBALS = GLOBALS || {};
$(function () {
  
    var hub = $.connection.myHub1;//注意大小写，同时第一个要小写，其他地方大小写要保持
    $.connection.hub.logging = true;    
    hub.client.OrderInfo = function (okResult) {
        window.Android.showToast('来之服务器的本地调用！' + okResult);
    };
    hub.client.CloseQRWindown = function (okResult) {
        //close qr Windown
        $("#qrName").val(""); 
        $("#maxMoney").val("");
        $("#qrUrl").val("");
        $("#MyAddQr").attr('disabled', true);
        $("#img_header").attr("src", "/images/addQR.png");
        $(".m-modal").hide();
        window.Android.showToast(okResult);
    };
    hub.client.MyInfo = function (okResult) {
        var tmpRlt = $.parseJSON(okResult);
        $("#total").html(tmpRlt.TotalMoney);
        $("#canuse").html(tmpRlt.CanUseMoney);
        $("#freeze").html(tmpRlt.FreezeMoney);
        window.Android.showToast('更新信息用户完毕');
    };
   
    hub.client.hello = function (okResult) {
        window.Android.showToast('点击返回：' + okResult);
    };

    $.connection.hub.start().done(function () {
    //{ transport: 'webSockets' } { transport: ['webSockets', 'longPolling'] }
     // alert("已经连接！" + $.connection.hub.id);
     //  hub.server.hello('msgtxt').done(function (result) { alert(result) });
       // var s = hub.client.hello();
       // alert(s);
    }).fail(function (err) {
        window.Android.showToast('连接失败：' + err);
    });
    
    //$.connection.hub.disconnected(function () {
    //   // alert("disconnected连接");
    //    window.Android.showToast('disconnected连接!!！')
    //    console.log('disconnected连接！')
    //});


    var tryingToReconnect = false;
    $.connection.hub.disconnected(function () {
        //TODO: write the logic to reconnect to server.
        //if (!tryingToReconnect) {
        //    window.Android.showToast('disconnected连接!!！' + $.connection.hub.state)
        //    // notifyclient about disconnection
        //}
        $.connection.hub.stop();
        window.Android.showToast('disconnected连接!!！' + $.connection.hub.state)
    });
    $.connection.hub.reconnecting(function () {
        tryingToReconnect = true;
        window.Android.showToast('重新连接!!10-4 $' + $.connection.hub.state)
        console.log("reconnecting...");
    })
    $.connection.hub.reconnected(function () {
        tryingToReconnect = false;
        window.Android.showToast('已经重新连接成功!!！')
        console.log("Reconnected");
    });

    setInterval(function () {
      
        window.Android.showToast('检测状态Ing' + $.connection.hub.state);
        if ($.connection.hub.state == 0 || $.connection.hub.state == 4)
        {
            $.connection.hub.start();
        }
        window.Android.showToast('ID:' + $.connection.hub.id);
        
    }, 15000); // Restart connection after 5 seconds.

    hub.state.UserName = "Sury";
    hub.state.ID = 0;
    hub.state.DBID = 0;
   
    $(document).on("click", "#BuyCoin", function () {
        $.connection.hub.start(); 
        hub.server.hello('BuyCoin').done(function (result) { window.Android.showToast('点击返回：' + okResult); })
            .fail(function (err) {
                window.Android.showToast('点击返回：' + err);
            });
    })
    $(document).on("click", "#MyAddQr", function () {
        if ($("#qrName").val() == "") {
            window.Android.showToast('不可以为空，请确定都填写了');
            return;
        }
        if ($("#maxMoney").val() == "") {
            window.Android.showToast('不可以为空，请确定都填写了');
            return;
        }

        window.Android.showToast('正在上传二维码...');
        $.connection.hub.start();
        //获取相关信息
        
        var myOrder = { qrName: $("#qrName").val(), qrUrl: $("#qrUrl").val(), maxMoney: $("#maxMoney").val() };
        
        hub.server.order(myOrder).done(function (result) { window.Android.showToast(okResult); })
            .fail(function (err) {
                window.Android.showToast('上传失败：' + err);
            });
    })

    
})