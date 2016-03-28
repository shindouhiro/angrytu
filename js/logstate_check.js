$(document).ready(function(){

	//檢測是不是已經有cookie了，如果有了就檢測存的cookie對不對，對的話直接跳轉
	var strCookie=document.cookie; 
	//将多cookie切割为多个名/值对 
	var arrCookie=strCookie.split("; "); 
	var c_user_id; 
	var c_psw;
	if(arrCookie.length >= 2 )//如果存cookie
	{
		//遍历cookie数组，处理每个cookie对
		for(var i=0;i<arrCookie.length;i++)
		{ 
			var arr=arrCookie[i].split("=");
			//找到名称为userId的cookie，并返回它的值 
			if("user_id" == arr[0])
				c_user_id = decodeURI(arr[1]);
			if("password" == arr[0])
				c_psw = decodeURI(arr[1]);
		} 
		//檢測存的cookie是不是正確
		var postData = {
			"user_id": c_user_id,
			"psw": c_psw
		};
		$.ajax({
			url: '../json/j_loging_check.php',
			type: 'POST',
			data: postData,
			dataType: 'json',
			timeout: 10000,
			success: function(data)
			{
				if ( data != "" )//登录状态验证成功
				{
				}
				else//登录状态验证失败，清空cookie
				{
					setCookie("user_id", "", -1); 
					setCookie("password", "", -1); 
				}
				//window.location.href='buyer/order_view.php';
			},
			error: function(er){}
		});
	}
	
	function setCookie(cname, cvalue, exdays) {
	    var d = new Date();
	    d.setTime(d.getTime() + (exdays*24*60*60*1000));
	    var expires = "expires="+d.toUTCString();
	    document.cookie = cname + "=" + cvalue + "; " + expires;
	}	
});

//重定向到登陆页面，带有跳转信息
function need_2_login()
{
	var url = window.location.pathname;
}