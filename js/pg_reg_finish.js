$(document).ready(function(){

	
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


	//点击按钮-修改信息
	$("#btn_reg_finish").bind("click",function(ctl)
	{	
		var phone = $("#txt_phone").val();
		var code = $("#txt_code").val();
		var psw = $("#txt_psw").val();

		var user_name = $("#txt_user_name").val();
		var sex = $("#ckb_sex")[0].checked ? 1: 0;
		var role = $("input[name='rbtn_role']:checked").val();
		var college_id = $('select#cmb_college option:selected').val();
		var greed = $("input[name='rbtn_greed']:checked").val();
		var major_id = $('select#cmb_major option:selected').val();
		var district_id = $('select#cmb_district option:selected').val();
		var portrait_id = $('#img_portrait')[0].name.replace(/pot_/g,"");

		var price_type = $("input[name='rbtn_pricetype']:checked").val();
		var price = $('#txt_price').val();
		var customer_limit = $("input[name='rbtn_cuslimit']:checked").val();
		var delivery_type = $("input[name='rbtn_delivery']:checked").val();
		var pay_comment = $('#txt_pay_comment').val();


		if(!/^[0-9]+.?[0-9]*$/.test(price))
		{
		  	alert('作品定价格式有误');
		  	return;
		}
		else
		{
			var post_data = {
				"phone": phone,
				"code": code,
				"psw": $.md5(psw),
				"user_name": user_name,
				"sex": sex,
				"role": role,
				"college_id": college_id,
				"greed": greed,
				"major_id": major_id,
				"district_id": district_id,
				"portrait_id": portrait_id,
				"price_type": price_type,
				"price": price,
				"customer_limit": customer_limit,
				"delivery_type": delivery_type,
				"pay_comment": pay_comment
			};
			$.ajax({
				url: '../json/j_reg_finish.php',
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