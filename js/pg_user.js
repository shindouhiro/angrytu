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


	//点击按钮-更多代表作品
	$("#btn_res_work_more").bind("click",function(ctl)
	{	
	var work_nodes = $("#work_res_panle").find("li");
	var nodes_count = work_nodes.length - 1;

	var index_s = nodes_count;
	var index_e = 4;

	var post_data = {
		"user_id": GetQueryString("uid"),
		"index_s": index_s,
		"index_e": index_e
	};

	$.ajax({
		url: '../json/j_work_res_more.php',
		type: 'POST',
		data: post_data,
		dataType: 'json',
		timeout: 10000,
		success: function(res)
		{
			work_res = res;

			if(work_res.length < 4 )
			{
				$("#btn_res_work_more").innerHTML = "没有更多消息";
				$("#btn_res_work_more").css("display", "none");
			}

				for(i=0; i<work_res.length; i++)
				{

                    work_id = work_res[i].work_id;
                    work_name = work_res[i].work_name;
                    work_pic1 = work_res[i].work_pic1;
                    work_pic1_orgin = work_res[i].work_pic1_orgin;
                    work_pic1_id = work_res[i].work_pic1_id;
                    datetime = work_res[i].datetime;
                    view_c = work_res[i].view_c;
                    discuss_c = work_res[i].discuss_c;
                    recommend_c = work_res[i].recommend_c;


					html = $("#work_res_pnl_exp")[0].outerHTML;
					html = html.replace(/work_id/g, work_id);
					html = html.replace(/work_pic1/g, work_pic1);
					html = html.replace(/work_name/g, work_name);

					s1 = new Date(datetime);
					s2 = new Date();
					var days = s2.getTime() - s1.getTime();
					var day = parseInt(days / (1000 * 60 * 60 * 24));

					html = html.replace(/day/g, day);
					html = html.replace(/view_c/g, view_c);
					html = html.replace(/discuss_c/g, discuss_c);
					html = html.replace(/recommend_c/g, recommend_c);
					html = html.replace(/work_res_pnl_exp/g, "work_res_pnl_"+work_id);
					//html = html.replace(/display:none;/g, "display:block;");
					html = html.replace(/display:none;/g, "");

					$("#work_res_pnl_exp").before(html);
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


function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}