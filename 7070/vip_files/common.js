$(function() {
	$(".headUser .headUser_icon").click(function(){
		$(".headUser .headUser_menu").toggle();
	});
	
	$("#goBack").click(function(){
		window.history.back(-1);
	});
	
});

function elTab(el,cel,cls){
	$(el).click(function(){
		if(cls){
			$(this).addClass(cls).siblings().removeClass(cls);
		}
		$(cel).css("display","none").eq($(this).index()).css("display","block");
	});
}

function pubMsg(con,time){
	var c = con || "",
		t = time||1000;
	
	if($(".form_msgErrBox").length <= 0){
		$("body").append('<div class="form_msgErrBox"><span class="form_msgErr"></span></div>');
	}
	$(".form_msgErr").html(c),$(".form_msgErrBox").fadeIn(function(){setTimeout(function(){$(".form_msgErrBox").fadeOut()},t);});
}

function checkReg(){
	$('#txt_email').blur(function(){
		var reg = /^([a-zA-Z0-9\._-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;	
		if(!reg.test($("#txt_email").val())){
			$(".errorMsg").show().html('邮箱格式不正确');
			return false;
			
		}
		if($("#txt_email").val().length > 50){
			$(".errorMsg").show().html('注册账号不能超过50个字符');
			return false;
			}
		if($("#txt_email").val() == ""){
			$(".errorMsg").show().html('账号不能为空');
			return false;
		}
		if(!(checkInput("EMAIL",$("#txt_email").val(),".errorMsg"))){
			return false;
		}
	});
			
}

function checkInput(name,value,tipid,successtext){
		var is = false;;
	    $.ajax({
        type: "POST",
        async:false,
        url: basePath + "wxReg/checkInput.html?rnd="+Math.random(),  
        data: {name:name,value:value},
        dataType : 'text',
        beforeSend: function(){
           // $("#span_content").text("数据处理中...");
        },
        success: function(responseData){
			responseData = eval('(' + responseData + ')');
        	if(responseData.success==false){
            	$(tipid).show().html(responseData.message);
            	is = false;
            	return false;
        	}else{
				clearMsg(tipid);
				is = true;
        	}
        },
        error: function(responseData){
            
        }
       
    });
	return is;   
}

function changeVeriCode(){
	 $('#veriCode').val("");
	 $('#div_changeVeriCode, #img_veriCode').click(function() {
		 $('#veriCode').val("");
		  //var d = new Date();	
		  $("#img_veriCode").attr("src",basePath+"/ImageCode/code.html?r="+Math.random());
		  
		 });
}

function checkRegSubmit(){
	var is=true;
	var reg = /^0?(13|15|18|14|17)[0-9]{9}$/;
	if(!reg.test($("#auam").val())){
		pubMsg("请输入正确的手机号码",1000);
		is=false;
		return false;
	}else{
		$(".form_msgErr").html(""),$(".form_msgErrBox").hide();
	}
	
	if($("#phoneCode").val()==""){
		pubMsg("验证码不能为空",1000);
		is=false;
		return false;
	}else{
		$(".form_msgErr").html(""),$(".form_msgErrBox").hide(); 
	}
	
	if($("#apad").val()!=""){
		if($("#apad").val().length<6){
		 	pubMsg("密码最小字符长度不能低于6位",1000);
			is=false;
			return false;
		}else if($("#apad").val().length>16){
			pubMsg("密码最大字符长度不能大于16位",1000);
			is=false;
			return false;
		}else{
			if($("#apad").val().indexOf(" ")<0){
				$(".form_msgErr").html(""),$(".form_msgErrBox").hide();
			}else{
				pubMsg("密码不允许带空格",1000);
				is=false;
				return false;
			} 
		}
	}else{
		pubMsg("密码不能为空",1000);
		is=false;
		return false;
	}
	if($("#form_register input[checked='checked']").prop("checked") == false){
		pubMsg("请阅读并同意使用协议",1000);
		is=false;
		return false;
	}
	
	if(is){
		$("#apad").val(hashSha1($("#apad").val()));
		return true;
		//$("#form_register").submit();
	}else{
		return false;
	}
}

//重新发送邮件
function Load(secs,n,s,u){
	for(var i=secs;i>=0;i--) 
	{  
		window.setTimeout('doUpdate('+i+',"'+n+'","'+s+'","'+u+'")', (secs-i) * 1000); 
	}
	
}
function doUpdate(num,n,s,u){
	$(".btn_vCode").val(num+'秒后点击重试');
	if(num == 0) { 
		$(".btn_vCode").val("点击发送验证码").removeClass("grayVCode");
		$(".btn_vCode").bind("click",function(){sendMessage(n,s,u)});
	 } 
}

function sendMessage(n,s,url){
	var phoneNumber=n;
	var reg = /^0?(13|15|18|14|17)[0-9]{9}$/;
	if(reg.test(phoneNumber)){
		$.ajax({
    		type:"POST",
    		url: url,
    		data:{
    			auam:phoneNumber,
    			rstatus:s
    			},
    			success : function(responseData) {
					if (responseData.success) {
						lightBoxPos("发送成功","true");
						$(".btn_vCode").unbind("click").addClass("grayVCode");
						Load("120",n,s,url);
					} else {
						lightBoxPos(responseData.message,"true");
					}
				},
				error : function(responseData) {
					alert("错误");
				}
    		
    	})
    }else{
    	pubMsg("请输入正确的手机号码",1000);
        $("#auam").focus();
        }
	
}

function load_s(){	
	if($(".loadBg").length<=0){
		$(document.body).append('<div class="loadBg"></div><div class="tc_load"><span class="loadSpin"><i></i><i></i><i></i><i></i></span></div>');
	}

	// var res= function (){
	// 	var h3=parseInt($(window).height());
	// 	$(".loadBg").css("height","100%");
	// };
 //    res();
	// $(window).resize(function(){
	// 	res();
	// });
	// $(document).scroll(function(){
	// 	res();
	// });
			
}
function load_e(){
	$(".loadBg").remove();
	$(".tc_load").remove();
}

//显示弹窗
function lightBoxPos(option){
	var con,btn,width,time,tit="提示";
	if(typeof option === 'object'){
		con=option.con;
		btn=option.btn;
		width=option.width;
		time=option.time;
		tit=option.tit||"提示";
	}else{
		con=arguments[0];
		btn=arguments[1];
		width=arguments[2];
		time=arguments[3]
	}

	if($(".lightBoxbg").length > 0){return false;}
	 
	var btnHtml = "<div class='lightFooter' style='border-top:none;'></div>";	
	if(btn){ btnHtml = "<div class='lightFooter'><a onclick='lightClose()' class='red-sbtn lightbox-btn'>确定</a></div>";}
	$("body").append("<div class='lightBox'></div><div class='lightBoxbg'><div class='lightTitle'>"+tit+"</div><div class='lightClose' onclick='lightClose()'></div><div class='lightCon_box'></div>"+ 
		btnHtml +"</div>");
	$(".lightCon_box").html(con);

	var conTop = ($(window).height()- $(".lightBoxbg").height())/2 + $(document).scrollTop();
	if(width){
			var conLeft = ($(window).width()- width)/2 ;
			$(".lightBoxbg").css({"width":width,"top":conTop,"left":conLeft}).fadeIn();
		}else{
			var conLeft = ($(window).width()- $(".lightBoxbg").width())/2 ;
			$(".lightBoxbg").css({"top":conTop,"left":conLeft}).fadeIn();
		}
	
	$(window).resize(function(){
		var conTop = ($(window).height()- $(".lightBoxbg").height())/2 + $(document).scrollTop();
		var conLeft = ($(window).width()- $(".lightBoxbg").width())/2 ;	
		$(".lightBoxbg").css({"top":conTop,"left":conLeft});
	});
	
	if(time){
		setTimeout(function(){
			$(".lightClose").click();
		},time);
	}

	return false;
}	

//关闭弹窗	
function lightClose(){
	$(".lightBox").fadeOut(function(){$(".lightBox").remove()}); 
	$(".lightBoxbg").fadeOut(function(){$(".lightBoxbg").remove()}); 
}

//图集
var lbPhotos = function(box,item,callBack){
	var imgItem=item;
	$(box).on("click",imgItem,function(){
		var _this=this,
			list = $.trim($(_this).parent().html()),
			inx=$(_this).index(),
			html=list.replace(/imgZoomCut/g,"imgZoomCache").replace(/(&amp;size\=)[0-9]{2,3}/g, "");

		$("body").append("<div class='lbPhotoBg'></div><div class='lbPhotosClose'></div><div class='lbPhotos'><div class='lbPhotos_list'></div><ul class='lbPhotos_page'></ul></div>");
		$(".lbPhotos_list").html(html);

		$(".lbPhotoBg,.lbPhotosClose").click(function() {
			$(".lbPhotoBg").remove(),$(".lbPhotosClose").remove(),$(".lbPhotos").remove();
		});

		var mySwiper = new Swiper('.lbPhotos',{
			wrapperClass : 'lbPhotos_list',
			slideClass : imgItem.substring(imgItem.lastIndexOf('.')+1),
			slideActiveClass : '',
			slideNextClass : '',
			slidePrevClass : '',
			speed:500,
			pagination : '.lbPhotos_page',
			paginationElement : 'li',
			paginationClickable :true,
			bulletActiveClass:"on",
			observer:true,
			observeParents:true,
			initialSlide :inx,
			paginationType : 'fraction',
			onInit: function(swiper){
				"function" == typeof callBack && addreadcount(_this);
			}
		});

	})

	function addreadcount(el){
		var id=$(el).parent().attr("data-id");
		$.ajax({
			url: basePath+"/wap/blog/addreadcount.html",
			type:"post",
			data:{id:id},
			success : function(responseData) {
				if (responseData.success) {
					callBack(el,responseData.resultCode+1);

				} else {
					pubMsg(responseData.message,500);
				}
			},
	        error:function(){
	        }
	    });
	}

}