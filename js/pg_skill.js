$(document).ready(function(){

	user_id = "";
	psw = "";
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

	$(".btn_skill").bind("click",function(ctl)
	{	
		//alert(ctl.currentTarget.id);
		if(ctl.currentTarget.parentNode.id == "skill_group_selected")
			$("#skill_group_left").append(ctl.currentTarget);
		else
			if(ctl.currentTarget.parentNode.id == "skill_group_left")
				$("#skill_group_selected").append(ctl.currentTarget);
	});



	//点击按钮-修改信息
	$("#btn_edit_submit").bind("click",function(ctl)
	{	
		var btn_skills = $("#skill_group_selected").find('.btn_skill');
		var skill_brief = $("#txt_skill_brief").val();

		post_data = {};
		post_data["skill"] = {};
		post_data["user_id"] = user_id;
		post_data["psw"] = psw;
		post_data["skill_brief"] = skill_brief;

		for(var i=0; i<btn_skills.length; i++)
		{
			var node = btn_skills[i];
			var id = node.id.replace(/skill_/g, "");

			post_data["skill"][i] = id;
		}

			$.ajax({
				url: '../json/j_update_skill.php',
				type: 'POST',
				data: post_data,
				dataType: 'json',
				timeout: 10000,
				success: function(data)
				{
					var code = data.res_code;
					if(code=="100")//发送成功
					{
						alert("保存成功");
						window.location.href='skill.php';
					}
					if(code=="202")//
					{
						alert("登录状态错误，请重新登录");
					}
					if(code=="200")//已注册未激活
					{}
					if(code=="300")//已注册已激活
					{}
					if(code=="400")//异常
					{}
				},
			　　complete : function(XMLHttpRequest,status)
				{ 
			　　　	if(status=='timeout')
						alert("网络通信超时，请重试。");
			　	}
			});

	});

});