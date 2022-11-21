var GLOBALS = GLOBALS || {};

$(function () {
    var hub = $.connection.myHub1;//注意大小写，同时第一个要小写，其他地方大小写要保持
    $.connection.hub.logging = true;   

    $.connection.hub.start({ transport: 'webSockets' }).done(function () {
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
            var date = new Date(data[i].OKTime);
            var localeDate = date.toLocaleString();
            $("#LookOrder").prepend(
                '<div style="border-radius: 10px; border: 1px solid rgb(204, 204, 204); border-image: none; margin-bottom: 20px;">' +
                ' <img style="left: 2160px; top: 1px; overflow: hidden; position: relative;" src="/images/yl.png">' +
                '<b style="top: -90px; display: block; position: relative;">用户名：' + data[i].USER_ID + '</b>' +
                '<b style="top: -75px; display: block; position: relative;">IP：' + data[i].Ip + '</b>' +
                '<b style="top: -60px; display: block; position: relative;">在线时间：' + localeDate + '</b>' +
                ' </div >'
            );
        }
        
        addVoice();
        

        
    };
    setInterval(function () {


        //   // window.Android.showToast('检测状态Ing' + $.connection.hub.state);
        if ($.connection.hub.state == 0 || $.connection.hub.state == 4) {
            //window.Android.playSoundOffline("voice/offline_operator.mp3");
            $.connection.hub.start({ transport: 'webSockets' });
        }
        // window.Android.showToast('ID:' + $.connection.hub.id);
    }, 5000); // Restart connection after 5 seconds.

    hub.client.NoticeLook = function (okResult) {

        //alert(okResult);
        var data = $.parseJSON(okResult);
        $("#LookOrder").prepend(
                '<div style="border-radius: 10px; border: 1px solid rgb(204, 204, 204); border-image: none; margin-bottom: 20px;">' +
                ' <img style="left: 2160px; top: 1px; overflow: hidden; position: relative;" src="/images/yl.png">' +
            '<b style="top: -90px; display: block; position: relative;">诊断建议：' + data.State + '</b>' +
            '<b style="top: -75px; display: block; position: relative;">标题：' + data.Title + '</b>' +
            '<b style="top: -60px; display: block; position: relative;">内容：' + data.Content + '</b>' +
                 ' </div >'
            );

        addVoice();
    };



    setInterval(function () {
        hub.server.onlineUsers().done(function (result) {
            getOnlineInfo(result);
            //alert(result);
        });
            

    }, 10000); 



   
    function addVoice() {
        document.getElementById('audio').play();
    }

}); //end