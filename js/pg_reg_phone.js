$(document).ready(function(){

	//发送验证码
	$("#btn_reg_phone").live("click",function(ctl)
	{	
		var phone_no = $("#phone_no").val();
		if(!/^(1[0-9])\d{9}$/i.test(phone_no))
		{
		  	alert('手机号码格式有误');
		  	return;
		}
		else
		{

			var post_data = {
				"phone_no": phone_no
			};
			$.ajax({
				url: '../json/j_reg_phone.php',
				type: 'POST',
				data: post_data,
				dataType: 'json',
				timeout: 10000,
				success: function(data)
				{
					var code = data.res_code;//先存到全局变量里
					if(code=="100")//发送成功
					{
						$('#phone_no').attr("disabled","disabled");
						$('#btn_reg_phone_verify').removeAttr("disabled");
						//调用方法
						timer(120);	
					}
					if(code=="200")//已注册未激活
					{
						alert("账号已注册");
					}
					if(code=="300")//已注册已激活
					{
						alert("账号已注册");
					}
					if(code=="400")//异常
					{
						alert("出现异常");
					}
				},
			　　complete : function(XMLHttpRequest,status)
				{ 
			　　　	if(status=='timeout')
						alert("网络通信超时，请重试。");
			　	}
			});
		}
	});

	function timer(time) 
	{
	    var btn = $("#btn_reg_phone");
	    btn.attr("disabled", true);  //按钮禁止点击
	    btn[0].innerText= time <= 0 ? "获取验证码" : ("" + (time) + "秒后可再发送");
	    var hander = setInterval(function() 
	    {
	        if (time <= 0) {
	            clearInterval(hander); //清除倒计时
	            btn[0].innerText= "获取验证码";
	            btn.attr("disabled", false);
	            return false;
	        }
	        else 
	        {
	            btn[0].innerText= "" + (time--) + "秒后可再发送";
	        }
	    }, 1000);
	}
 
 


	//验证
	$("#btn_reg_phone_verify").live("click",function(ctl)
	{	
		var phone_no = $("#phone_no").val();
		var ver_code = $("#code").val();
		var psw = $("#psw").val();
		if(!/^(1[0-9])\d{9}$/i.test(phone_no))
		{
		  alert('手机号码格式有误');
		  return;
		}
		else
			if(!/^\d{6}$/.test(ver_code))
			{
			  alert('验证码格式有误');
			  return;
			}
			else
				if(psw.length < 6 )
				{
					alert("密码必须多于6位，请重新输入");
					return;
				}
				else
				{
					var post_data = {
						"phone_no": phone_no,
						"psw": $.md5(psw),
						"code": ver_code
					};
					$.ajax({
						url: '../json/j_reg_phone_verify.php',
						type: 'POST',
						data: post_data,
						dataType: 'json',
						timeout: 10000,
						success: function(data)
						{
							var code = data.res_code;//先存到全局变量里
							if(code=="100")//验证成功
							{
								$("#btn_reg_phone")[0].innerText= "验证成功";
								alert("注册成功，现在您可以使用您的手机号和设置的密码登录了");
								//跳转到信息填写页面
								//window.location.href="reg_finish.php?phone=" + phone_no + "&code=" + ver_code; 
								window.location.href="login.php"; 
							}
							if(code=="200")//验证码过期
							{
								alert("验证码或手机号错误");
							}
							if(code=="300")//验证码错误
							{
								alert("验证码或手机号错误");
							}
							if(code=="400")//异常
							{
								alert("验证异常");
							}

						},
					　　complete : function(XMLHttpRequest,status)
						{ 
					　　　	if(status=='timeout')
								alert("网络通信超时，请重试。");
					　	}
					});
				}
	});
	
});