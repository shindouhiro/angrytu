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

});


function more_sell_order(user_id)
{
	var orders = $("#grp_users_sell_order").find("li");
	var nodes_count = orders.length - 2;

	var index_s = nodes_count ;
	var len = 8;

	var post_data = {
		"user_id": user_id,
		"index_s": index_s,
		"len": len
	};

	$.ajax({
		url: '../json/j_more_seller_order.php',
		type: 'POST',
		data: post_data,
		dataType: 'json',
		timeout: 10000,
		success: function(res)
		{
			work_res = res;

			if(work_res.length < 8 )
			{
				$("#btn_more_sell_order").innerHTML = "没有更多消息";
				$("#btn_more_sell_order").css("display", "none");
			}

			for(i=0; i<work_res.length; i++)
			{

                work_id = work_res[i].order_work;
                work_pic = work_res[i].order_work_pic;
                order_work_name = work_res[i].order_work_name;
                order_work_pic_c = work_res[i].order_work_pic_c;
                order_id = work_res[i].order_id;


				html = $("#sell_work_exp")[0].outerHTML;
				html = html.replace(/work_href/g, "work.php?wkid="+work_id);
				html = html.replace(/order_work_pic_c/g, (order_work_pic_c?order_work_pic_c:""));//这个得放在work_pic替换前面
				html = html.replace(/work_pic/g, (work_pic?work_pic:"img/empty.gif"));
				html = html.replace(/order_work_name/g, (order_work_name?order_work_name:""));
				html = html.replace(/order_id/g, order_id);
				html = html.replace(/sell_work_exp/g, '');

				html = html.replace(/display:none;/g, "display:block;");

				$("#sell_work_exp").after(html);
			}
						
		},
	　　complete : function(XMLHttpRequest,status)
		{ 
	　　　	if(status=='timeout')
				alert("网络通信超时，请重试。");
	　	}
	});
}


function more_buy_order(user_id)
{
	var orders = $("#grp_users_buy_order").find("li");
	var nodes_count = orders.length - 2;

	var index_s = nodes_count ;
	var len = 8;

	var post_data = {
		"user_id": user_id,
		"index_s": index_s,
		"len": len
	};

	$.ajax({
		url: '../json/j_more_buyer_order.php',
		type: 'POST',
		data: post_data,
		dataType: 'json',
		timeout: 10000,
		success: function(res)
		{
			work_res = res;

			if(work_res.length < 8 )
			{
				$("#btn_more_buy_order").innerHTML = "没有更多消息";
				$("#btn_more_buy_order").css("display", "none");
			}

			for(i=0; i<work_res.length; i++)
			{

                work_id = work_res[i].order_work;
                work_pic = work_res[i].order_work_pic;
                order_work_name = work_res[i].order_work_name;
                order_work_pic_c = work_res[i].order_work_pic_c;
                order_id = work_res[i].order_id;


				html = $("#buy_work_exp")[0].outerHTML;
				html = html.replace(/work_href/g, "work.php?wkid="+work_id);
				html = html.replace(/order_work_pic_c/g, (order_work_pic_c?order_work_pic_c:""));//这个得放在work_pic替换前面
				html = html.replace(/work_pic/g, (work_pic?work_pic:"img/empty.gif"));
				html = html.replace(/order_work_name/g, (order_work_name?order_work_name:""));
				html = html.replace(/order_id/g, order_id);
				html = html.replace(/buy_work_exp/g, '');

				html = html.replace(/display:none;/g, "display:block;");

				$("#buy_work_exp").after(html);
			}
						
		},
	　　complete : function(XMLHttpRequest,status)
		{ 
	　　　	if(status=='timeout')
				alert("网络通信超时，请重试。");
	　	}
	});
}