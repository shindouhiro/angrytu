$(document).ready(function(){

	//版权所有
	var mydate = new Date();
	$(".mpfooter").html("© "+mydate.getFullYear()+". Authored By NUTU.");
	//输入框获得焦点后给div加高亮
	$("#txt_user_name").focus(function(){
		$(".usn").addClass("act");
	});
	$("#txt_user_name").blur(function(){
		$(".usn").removeClass("act");
	});
	$("#txt_psw").focus(function(){
		$(".pwd").addClass("act");
	});
	$("#txt_psw").blur(function(){
		$(".pwd").removeClass("act");
	});

	$(function(){
		//复选框点击样式变换
		$(".checkbox").bind("click", function(e){
			var ele = $(e.target);
			if (ele.hasClass("active")){
				ele.removeClass("active");
			}else {
				ele.addClass("active");
			}
		});
		//设定tab顺序同时使
		$(".checkbox").bind("keydown", function(e){
			if (e.keyCode == 13){
				var ele = $(e.target);
				if (ele.hasClass("active")){
					ele.removeClass("active");
				}else {
					ele.addClass("active");
				}
			}
		});

	});


	$(".errorinfo").css("visibility","hidden");
	//绑定两个输入框的
	$("#txt_user_name").bind("blur", function(){
		if ($(this).val()=="")
		{
			$(".errorinfo").css("visibility","visible");
			$(".errorinfo").html("用户名不能为空！");
		}
		else
			$(".errorinfo").css("visibility","hidden");
	});
	$("#txt_user_name").bind("keyup",function(){
		if ($(this).val()=="")
		{
			$(".errorinfo").css("visibility","visible");
			$(".errorinfo").html("用户名不能为空！");
		}
		else
			$(".errorinfo").css("visibility","hidden");
	});
	$("#txt_psw").bind("blur", function(){
		if ($(this).val()=="")
		{
			$(".errorinfo").css("visibility","visible");
			$(".errorinfo").html("密码不能为空！");
		}
		else
			$(".errorinfo").css("visibility","hidden");
	});
	$("#txt_psw").bind("keyup",function(){
		if ($(this).val()=="")
		{
			$(".errorinfo").css("visibility","visible");
			$(".errorinfo").html("密码不能为空！");
		}
		else
			$(".errorinfo").css("visibility","hidden");
	});	




	//点击按钮-登录
	$("#btn_login").live("click",function(ctl)
	{	
		var user_name = $("#txt_user_name").val();
		var psw = $("#txt_psw").val();
		var rem = $("#ckb_rem").hasClass("active") ? 1: 0;

		if (user_name==""||psw=="")
		{
			$(".errorinfo").css("visibility","visible");
			$(".errorinfo").html("账号密码不能为空！");
		}
		else
			$(".errorinfo").css("visibility","hidden");

		var post_data = {
			"user_name": user_name,
			"psw": $.md5(psw),
			"rem": rem
		};
		$.ajax({
			url: '../json/j_login.php',
			type: 'POST',
			data: post_data,
			dataType: 'json',
			timeout: 10000,
			success: function(data)
			{
				var code = data.res_code;
				if(code=="100")//登录成功
				{					
					$(".errorinfo").css("visibility","hidden");
					//window.location.href=data.url; 
					window.location.href="index.php";
				}
				if(code=="200")//登录失败
				{
					$(".errorinfo").css("visibility","visible");
					$(".errorinfo").html("用户名密码不匹配！");
				}
			},
		　　complete : function(XMLHttpRequest,status)
			{ 
		　　　	if(status=='timeout')
					alert("网络通信超时，请重试。");
		　	}
		});
	});

	
});