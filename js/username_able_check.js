$(document).ready(function(){

	user_id = "";
	var strCookie = document.cookie; 
	var arrCookie=strCookie.split("; "); 
	//将多cookie切割为多个名/值对 
	if(arrCookie.length < 2)//如果沒有存cookie跳轉回登陸頁面
		;//window.location.href='http://msbit.sinaapp.com/';//沒存cookie，跳轉到登錄頁面
	else
	{
		//遍历cookie数组，处理每个cookie对
		for(var i=0;i<arrCookie.length;i++)
		{ 
			var arr=arrCookie[i].split("=");
			//找到名称为userId的cookie，并返回它的值 
			if("user_id" == arr[0])
				user_id = arr[1];
			if("password" == arr[0])
				psw = arr[1];
		} 
	}

	//用户名输入框输入完失去焦点后，检测该用户名是否可用
	$("#txt_user_name").bind("blur",function(ctl)
	{	
		var user_name = $("#txt_user_name").val();
		var post_data = {
			"user_name": user_name,
			"user_id": user_id
		};
		$.ajax({
			url: '../json/j_user_name_available.php',
			type: 'POST',
			data: post_data,
			dataType: 'json',
			timeout: 10000,
			success: function(data)
			{
				var code = data.res_code;
				if(code=="100")//
				{
					$("#username_useable").removeClass("glyphicon-ok");
					$("#username_useable").removeClass("glyphicon-remove");
					document.getElementById("username_useable").style.color = "green";
					$("#username_useable").addClass("glyphicon-ok");			
				}
				if(code=="200")
				{
					$("#username_useable").removeClass("glyphicon-ok");
					$("#username_useable").removeClass("glyphicon-remove");
					document.getElementById("username_useable").style.color = "red";
					$("#username_useable").addClass("glyphicon-remove");		
				}
			},
		　　complete : function(XMLHttpRequest,status)
			{ 
		　　　	if(status=='timeout')
					alert("网络通信超时，请重试。");
		　	}
		});
	});


	//用户名输入框输入完失去焦点后，检测该用户名是否可用
	$("#txt_user_name").bind("keydown",function(ctl)
	{	
		$("#username_useable").removeClass("glyphicon-ok");
		$("#username_useable").removeClass("glyphicon-remove");	
	});


});