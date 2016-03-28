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


    $("#img_upload").fileupload(
    {  
		dataType: 'json',
        url: 'json/j_upload_portrait.php',  
        sequentialUploads: true  
    }).bind('fileuploadprogress', function (e, data) 
    {  
        $("#upload_progress_div").css({display:""});  
        var progress = parseInt(data.loaded / data.total * 100, 10);  
        $("#upload_progress").css('width',progress + '%');  
        $("#upload_progress").html(progress + '%');  
    }).bind('fileuploaddone', function (e, data) 
    {  
    	if(data.result.code == "100")
    	{
            $("#upload_show").attr("src", data.result.path); //显示图片
            $("#upload_show").attr("name", "pot_"+data.result.pic_id); //改变照片id
        	$("#upload_progress_div").css({display:"none"});  
            $("#upload_portrait_tip").html("上传成功");
            //$("#upload_progress_div").css({display:"none"});  
            //$("#btn_upload").css({display:"none"});  
            //$("#upload_cancle").css({display:""});  
        }
		else
            $("#upload_portrait_tip").html("上传失败");
    });  

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
		var user_name = $("#txt_user_name").val();
		var sex = $("#ckb_sex")[0].checked ? 1: 0;
		var role = $("input[name='rbtn_role']:checked").val();
		var college_id = $('select#cmb_college option:selected').val();
		var greed = $("input[name='rbtn_greed']:checked").val();
		var major_id = $('select#cmb_major option:selected').val();
		var district_id = $('select#cmb_district option:selected').val();
		var portrait_id = $('#upload_show')[0].name.replace(/pot_/g,"");

		/*
		var skill_nodes = $('#skill_group_selected')[0].childNodes;
		for(i=0; i<skill_nodes.length; i++)
		{
			var skill_id = skill_nodes[i].id.replace("skill_","");
		}
		var skill_brief = $('#txt_skill_brief').val();
		*/


		if(!/^[0-9]+.?[0-9]*$/.test(price))
		{
		  	alert('作品定价格式有误');
		  	return;
		}
		else
		{

			var post_data = {
				"user_id": user_id,
				"psw": psw,
				"user_name": user_name,
				"sex": sex,
				"role": role,
				"college_id": college_id,
				"greed": greed,
				"major_id": major_id,
				"district_id": district_id,
				"portrait_id": portrait_id
			};
			$.ajax({
				url: '../json/j_update_userinfo.php',
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
						window.location.href = "userinfo_edit.php";
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
		}
	});

});