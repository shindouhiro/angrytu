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

	setInterval("new_msg_ask();",10000);


	$('#modal_lg_work').on('shown.bs.modal', function () {
	//$("#order_work_pic").bind("click",function(ctl) {

		var html = "";

		html += '<div style="text-align: center;">作品加载中……</div>';
		$("#grp_represent_work_choose")[0].innerHTML = html;

		var post_data = {
			"user_id": user_id,
			"psw": psw
		};
		$.ajax({
			url: '../json/j_get_users_all_work_brief.php',
			type: 'POST',
			data: post_data,
			dataType: 'json',
			timeout: 10000,
			success: function(res)
			{

				var html = "";
				if(res.length == 0)
				{
					html = '<div style="text-align: center;">没有作品</div>';
					$("#grp_represent_work_choose")[0].innerHTML = html;
				}
				else
				{
					$("#grp_represent_work_choose")[0].innerHTML = html;

					for(var i=0; i<res.length; i++)
					{
						{
							html += '<a class="thumbnail fileinput-button" style="margin-bottom: 0px;width: 100px;position: relative;overflow: hidden;display: inline-block;">';	
							html += '	<img id="rep_work_choos_'+res[i].work_id+'" src="'+res[i].work_pic1+'" onclick="func_order_work_choose(this)" class="img-responsive img_work" style="position: relative;cursor: pointer;" >';
							html += '	<label class="header_title" style="width:90px;text-align:center;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;width: 35em;">'+res[i].work_name+'</lable>';
							html += '</a>\n';
						}
					}
					$("#grp_represent_work_choose").append(html);
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



	//点击按钮-发送消息
	function send_msg()
	{	
		var msg = $("#msg_content").val();
		var order_id = $("#div_order_id")[0].innerHTML;
		var buyer_id = $("#div_buyer_id")[0].innerHTML;
		var seller_id = $("#div_seller_id")[0].innerHTML;
		if($.trim(msg) == '')
			return false;
		else
		{		
			var post_data={
				"oid": order_id,
				"sid": user_id,
				"rid": (user_id==buyer_id ? seller_id : buyer_id),
				"msg": msg
			};		


			$.ajax({
				url: '../json/j_talk.php',
				type: 'POST',
				data: post_data,
				dataType: 'json',
				timeout: 10000,
				success: function(data)
				{
					var code = data.res_code;
					if(code=="100")//发送成功
					{
						//alert("保存成功");
						var now = new Date();
						var dt = now.getFullYear()+"-"+now.getMonth()+"-"+now.getDate()+" "+now.getHours()+":"+now.getMinutes()+":"+now.getSeconds();
						
						if(user_id == user_id)
						{
							html = $("#my_talk_exp")[0].outerHTML;
							html = html.replace(/senddatetime/g, dt);
							html = html.replace(/msgcontent/g, msg);
							html = html.replace(/my_talk_exp/g, "buyer_talk");
							html = html.replace(/display:none;/g, "display:block;");
							$("#talk_panle").append(html);
						}
						else
							{
								html = $("#you_talk_exp")[0].outerHTML;
								html = html.replace(/senddatetime/g, dt);
								html = html.replace(/msgcontent/g, msg);
								html = html.replace(/you_talk_exp/g, "seller_talk");
								html = html.replace(/display:none;/g, "display:block;");
								$("#talk_panle").append(html);
							}
						$("#msg_content").val("");
						return;
					}
					if(code=="200")//
					{
						alert("发送失败，请重试");
					}
				},
			　　complete : function(XMLHttpRequest,status)
				{ 
			　　　	if(status=='timeout')
						alert("网络通信超时，请重试。");
			　	}
			});
			return false;
			
		}

		
	}





//查看更之前的消息
function talk_msg_get_more()
{
	var msg_nodes = $("#talk_panle").find(".speech");
	var msg_count = msg_nodes.length - 2;
	var order_id = $("#div_order_id")[0].innerHTML;
	var buyer_id = $("#div_buyer_id")[0].innerHTML;
	var seller_id = $("#div_seller_id")[0].innerHTML;

	var index_s = msg_count;
	var index_e = 10;

	var post_data = {
		"whoami": user_id,
		"oid": order_id,
		"index_s": index_s,
		"index_e": index_e
	};

	$.ajax({
		url: '../json/j_talk_more.php',
		type: 'POST',
		data: post_data,
		dataType: 'json',
		timeout: 10000,
		success: function(data)
		{
			var code = data.res_code;
			if(code=="100")//发送成功
			{
				talk = data.data;

				if(talk.length == 0)
				{
					$("#talk_msg_more")[0].innerHTML = "没有更多消息";
				}
				else
				{
					for(i=0; i<talk.length; i++)
					{
						this_uid = talk[i].sid;
						dt = talk[i].dt;
						msg = talk[i].ct;

						if(this_uid == user_id)
						{
							html = $("#my_talk_exp")[0].outerHTML;
							html = html.replace(/senddatetime/g, dt);
							html = html.replace(/msgcontent/g, msg);
							html = html.replace(/my_talk_exp/g, "ny_talk");
							html = html.replace(/display:none;/g, "display:block;");
							$("#talk_msg_more").after(html);
						}
						else
							{
								html = $("#you_talk_exp")[0].outerHTML;
								html = html.replace(/senddatetime/g, dt);
								html = html.replace(/msgcontent/g, msg);
								html = html.replace(/you_talk_exp/g, "you_talk");
								html = html.replace(/display:none;/g, "display:block;");
								$("#talk_msg_more").after(html);
							}
					}
				}				
				
			}
			if(code=="200")//
			{
				alert("发送失败，请重试");
			}
		},
	　　complete : function(XMLHttpRequest,status)
		{ 
	　　　	if(status=='timeout')
				alert("网络通信超时，请重试。");
	　	}
	});

}

function new_msg_ask()
{
	var order_id = $("#div_order_id")[0].innerHTML;
	var buyer_id = $("#div_buyer_id")[0].innerHTML;
	var seller_id = $("#div_seller_id")[0].innerHTML;

	var post_data = {
		"whoami": user_id,
		"oid": order_id
	};
	$.ajax({
		url: '../json/j_talk_new_ask.php',
		type: 'POST',
		data: post_data,
		dataType: 'json',
		timeout: 10000,
		success: function(data)
		{
			var code = data.res_code;
			if(code=="100")//发送成功
			{
				talk = data.data;

				if(talk.length == 0)
				{
				}
				else
				{
					for(i=talk.length-1; i>=0; i--)
					{
						this_uid = talk[i].sid;
						dt = talk[i].dt;
						msg = talk[i].ct;

						if(this_uid == user_id)
						{
							html = $("#my_talk_exp")[0].outerHTML;
							html = html.replace(/senddatetime/g, dt);
							html = html.replace(/msgcontent/g, msg);
							html = html.replace(/my_talk_exp/g, "buyer_talk");
							html = html.replace(/display:none;/g, "display:block;");
							$("#talk_panle").append(html);
						}
						else
							{
								html = $("#you_talk_exp")[0].outerHTML;
								html = html.replace(/senddatetime/g, dt);
								html = html.replace(/msgcontent/g, msg);
								html = html.replace(/you_talk_exp/g, "seller_talk");
								html = html.replace(/display:none;/g, "display:block;");
								$("#talk_panle").append(html);
							}
					}
				}				
				
			}
		}
	});
}

function take_order(order_id)
{
	if(window.confirm("确定下单？"))
	{
		var post_data = {
			"order_id": order_id,
			"buyer_id": user_id,
			"psw": psw
		}

		$.ajax({
			url: '../json/j_take_order.php',
			type: 'POST',
			data: post_data,
			dataType: 'json',
			timeout: 10000,
			success: function(data)
			{
				var code = data.res_code;
				if(code=="100")//发送成功
				{
					$("#btn_take_order").css("visibility", "hidden");			
					alert("下单成功");		
					location.reload();		
				}
				if(code=="200")//
				{
					alert("发送失败，请重试");
				}
			},
		　　complete : function(XMLHttpRequest,status)
			{ 
		　　　	if(status=='timeout')
					alert("网络通信超时，请重试。");
		　	}
		});
	}
}

function agree_protocol(order_id)
{
	var post_data = {
		"order_id": order_id,
		"user_id": user_id,
		"psw": psw
	}

	$.ajax({
		url: '../json/j_agree_protocol.php',
		type: 'POST',
		data: post_data,
		dataType: 'json',
		timeout: 10000,
		success: function(data)
		{
			var code = data.res_code;
			if(code=="100")//发送成功
			{
				$("#btn_agree_protocol").css("visibility", "hidden");			
				alert("签署协议成功");		
				location.reload();		
			}
			if(code=="200")//
			{
				alert("发送失败，请重试");
			}
		},
	　　complete : function(XMLHttpRequest,status)
		{ 
	　　　	if(status=='timeout')
				alert("网络通信超时，请重试。");
	　	}
	});
}


//选择作品
function func_order_work_choose(ctl)
{
	var pic_id = ctl.id.replace(/rep_work_choos_/g, "");

	$("#modal_lg_work").modal('hide');
	
	$("#order_work_pic")[0].src = ctl.src;
	$("#order_work_pic")[0].name = "order_work_pic_"+pic_id;

	//var html = "";
	//$("#grp_represent_work_choose")[0].innerHTML = html;

}

//保存订单作品
function confirm_order_work(order_id )
{
	if(window.confirm("确认此作品？提交后无法修改"))
	{
		var work_id = $("#order_work_pic")[0].name.replace(/order_work_pic_/g, "");

		if(work_id=="")
		{
			alert("尚未选择作品");
			return;
		}
		var post_data = {
			"order_id": order_id,
			"work_id": work_id,
			"user_id": user_id,
			"psw": psw
		}

		$.ajax({
			url: '../json/j_confirm_order_work.php',
			type: 'POST',
			data: post_data,
			dataType: 'json',
			timeout: 10000,
			success: function(data)
			{
				var code = data.res_code;
				if(code=="100")//发送成功
				{
					$("#btn_confirm_work").css("visibility", "hidden");			
					alert("确认作品成功");		
					location.reload();		
				}
				if(code=="200")//
				{
					alert("发送失败，请重试");
				}
			},
		　　complete : function(XMLHttpRequest,status)
			{ 
		　　　	if(status=='timeout')
					alert("网络通信超时，请重试。");
		　	}
		});
	}
}

//买家确认订单
function order_buyer_confirm(order_id )
{

	var post_data = {
		"order_id": order_id,
		"user_id": user_id,
		"psw": psw
	}

	$.ajax({
		url: '../json/j_confirm_order.php',
		type: 'POST',
		data: post_data,
		dataType: 'json',
		timeout: 10000,
		success: function(data)
		{
			var code = data.res_code;
			if(code=="100")//发送成功
			{
				$("#btn_confirm_work").css("visibility", "hidden");			
				alert("确认收货成功");		
				location.reload();		
			}
			if(code=="200")//
			{
				alert("发送失败，请重试");
			}
		},
	　　complete : function(XMLHttpRequest,status)
		{ 
	　　　	if(status=='timeout')
				alert("网络通信超时，请重试。");
	　	}
	});

}