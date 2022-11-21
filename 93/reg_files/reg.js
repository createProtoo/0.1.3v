var YunDun
var issending = false
function getParam(name, href) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(href || window.location.href);
    return results ? results[1] : "";
}
var isAndroid = navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Linux') > -1; //android终端
var isIOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
var isWxChat = navigator.userAgent.toLowerCase().indexOf('micromessenger') != -1

var reg_username = /^(\+\d{1,5}\s)?(\d{6,11})$/
var validateToken = ''

layui.use(['jquery', 'form'], function() {
    var $ = layui.$
    var form = layui.form,
        layer = layui.layer
    
    // 如果是微信，提示请在浏览器内打开
    if (isWxChat) {
        return $('.iswxchat').show()
    }

    // 根据邀请码判断注册是否失效和是否开放注册
    function getState() {
        if (issending) return
        issending = true
        $.get('/', {
            invitationCode: getParam('code')
        }, function(data) {
            if(data.success) {
                $('form.layui-form').remove()
                if (data.obj == 2) {
                    $('.step3-div').show()
                } else if (data.obj == 3) {
                    $('.step4-div').show()
                }
                issending = false
            }
        })
    }
    // getState()

    // 加载国家下拉
    ;(function() {
        var opt = ''
        for (var i = 0; i < teldata.length; i++) {
            opt +=
                '<option value="' +
                teldata[i]['d'] +
                '">+' +
                teldata[i]['d'] +
                ' ' +
                teldata[i]['n'] +
                '</option>'
        }
        $('[name="pre"]').html(opt)
        layui.form.render()
    })()

    //自定义验证规则
    form.verify({
        username: [reg_username, '请输入有效的手机号'],
        pwd: [
            /^(?![a-z]+$)(?![A-Z]+$)(?![\W_]+$)(?![0-9]+$)[a-zA-Z0-9\W_][^\u4e00-\u9fa5]{7,14}$/,
            '数字小写字母大写字母特殊符号任选其二长度8-15位之内'
        ]
    })
    var issubmiting = false;
    // 监听提交
    form.on('submit(sumbit)', function(data) {
        var res = data.field
        if (issubmiting) return
        issubmiting = true
        $.post('/merchant_app/signup', {
            account: [res.pre, res.username].join(','),
            accountKind: 1,
            invitationCode: getParam('code'),
            passwd: md5(res.pwd),
            verifyType: 'SMS',
            verifyCode: res.code,
            validateToken: validateToken
        }, function(data) {
            if(data.success) {
                $('form.layui-form').remove()
                $('.step2-div').show()
                issubmiting = false
            } else {
                layer.msg(data.message, { icon: 2 })
                issubmiting = false
            }
        })
        return false
    })

    //表单初始赋值
    form.val('form', {
        pre: '86'
    })

    // 下载按钮事件绑定
    $('.layui-btn-download').on('click', function() {
        if (!isIOS) {
            window.location.href = download.android
        } else {
            window.location.href = download.ios
        }
    })
    // 显示密码事件
    $('.layui-showpwd').on('click', function() {
        var pwd = $('[name="pwd"]')
        var type = pwd.attr('type')
        if (type == 'password') {
            pwd.attr('type', 'text')
            $(this).text('隐藏')
        } else {
            pwd.attr('type', 'password')
            $(this).text('显示')
        }
    })
    // 获取验证码
    $('.layui-getcode').on('click', function() {
        if (issending) return
        var pre = $('[name="pre"]').val()
        var username = $('[name="username"]').val()
        if (!reg_username.test(username)) {
            return layer.msg('请输入有效的手机号', { icon: 2 })
        }
        layer.open({
            skin: 'layui-layer-yundun',
            content: '<div id="yundun"></div>',
            title: '验证',
            area: ['90%', '164px'],
            yes: function(){
                var sessionId = $('[name="sessionId"]').val()
                if (!sessionId) {
                    return layer.msg('请先滑动验证', { icon: 2 })
                }
                issending = true
                validateToken = ''
                $.post('/merchant_app/validate/getAuthentication', {
                    type: 'register',
                    account: [pre, username].join(','),
                    sessionId: sessionId
                }, function(data) {
                    if(!data.success) {
                        layer.msg(data.message, { icon: 2 })
                        issending = false
                        return
                    }
                    validateToken = data.data.validateToken
                    $.post(
                        '/merchant_app/validate/sendVerifyCode',
                        {
                            receiver: [pre, username].join(','),
                            validateType: 'SMS',
                            validateToken: validateToken
                        },
                        function(data) {
                            if (data.success) {
                                layer.msg('发送成功')
                                // 倒计时开始
                                countdown(120)
                            } else {
                                layer.msg(data.message, { icon: 2 })
                                issending = false
                                // 验证码刷新
                                YunDun.refresh()
                            }
                        }
                    )
                })
            }
        });
        
        // 实例化验证
        initYunDun(layer, form)
    })



    var intervaltimer
    // 倒计时开始
    function countdown(timer) {
        if (intervaltimer) clearInterval(intervaltimer)
        intervaltimer = setInterval(function() {
            if (timer <= 0) {
                // 倒计时结束
                return countdownEnd()
            }
            timer--
            $('.layui-getcode').text(timer + '秒')
        }, 1000)
    }
    // 倒计时结束
    function countdownEnd() {
        if (intervaltimer) clearInterval(intervaltimer)
        issending = false
        issending = false
        // 验证码刷新
        YunDun.refresh()
        $('.layui-getcode').text('获取验证码')
        $('[name="sessionId"]').val('')
    }
})
