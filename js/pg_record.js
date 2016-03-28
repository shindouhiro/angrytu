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

	btn_new_item_click();//先生成一个


	//点击按钮-修改信息
	$("#btn_edit_submit").bind("click",function(ctl)
	{	
		var rcd_olds = $("#record_old").find('.panel-body');
		var rcd_news = $("#record_new").find('.panel-body');
		//var c_old = rcd_olds.length;
		//var c_new = rcd_news.length;
		
		post_data = {};
		post_data["record_old"] = {};
		post_data["record_new"] = {};

		post_data["user_id"] = user_id;
		post_data["psw"] = psw;
		
		for(var i=0; i<rcd_olds.length; i++)
		{
			var node = rcd_olds[i];
			var id = node.id.replace(/pnl_body_/g, "");
			var date_start = $("#dp_start_"+id).val();
			var date_end = $("#dp_end_"+id).val();
			var boss = $("#txt_record_boss_"+id).val();
			var content = $("#txt_record_content_"+id).val();

			//var date_start = node.find("[name='dp_start']")[0].val();
			//var date_end = node.find("[name='dp_end']")[0].val();
			//var boss = node.find("[name='txt_record_boss']")[0].val();
			//var content = node.find("[name='txt_record_content']")[0].val();
			
			var data = {
				"record_id" : record_id,
				"date_start" : date_start,
				"date_end" : date_end,
				"boss" : boss,
				"content" : content
			};
			post_data["record_old"][i] = data;
		}
		
		for(var i=0; i<rcd_news.length; i++)
		{
			var node = rcd_news[i];
			var id = node.id.replace(/pnl_body_/g, "");
			var date_start = $("#dp_start_"+id).val();
			var date_end = $("#dp_end_"+id).val();
			var boss = $("#txt_record_boss_"+id).val();
			var content = $("#txt_record_content_"+id).val();
			
			var data = {
				"date_start" : date_start,
				"date_end" : date_end,
				"boss" : boss,
				"content" : content
			};
			post_data["record_new"][i] = data;
		}
		

			$.ajax({
				url: '../json/j_update_record.php',
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
						window.location.href='record.php';
					}
					if(code=="202")//
					{
						alert("登录状态错误，请重新登录");
					}
					if(code=="400")//异常
					{
						alert("异常");
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


/*
	var max_count = 2;
	//点击按钮-新增履历
	function btn_new_record_click(ctl)
	//$("#btn_new_record").bind("click",function(ctl)
	{	
		//id = ( $("#record_new").find('.panel-default').length + 1);
		id = max_count++;
		ids = "new_"+id;
		htl = "";

		//htl += '<div id="acd_grp_'+id+'" class="panel-group" role="tablist" aria-multiselectable="true">';
		htl += '  <div id="acd_grp_'+id+'" class="panel panel-default">';

		htl += '    <div class="panel-heading"  style="background-color: #F9EF91;">';
 		htl += '     <a class="collapsed" style="width:100%;" role="button" id="head_10" data-toggle="collapse" data-parent="#accordion" href="#collapse_'+ids+'" aria-expanded="false" aria-controls="collapse_'+ids+'">';
 		htl += '       <h4 class="panel-title">';
 		htl += '         新增履历'+id;
 		htl += '       </h4>';
 		htl += '     </a>';
		htl += '    </div>';

		htl += '    <div id="collapse_'+ids+'" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">';
 		htl += '     <div class="panel-body" id="pnl_body_'+id+'">';

		htl += '		<div class="infobox_line">';
		htl += '			<span class="title1">合作时间：</span>';
		htl += '			<div class="input-group datebox" id="dtbox_start_'+ids+'" onclick="date(this)">';
		htl += '		        <input id="dp_start_'+ids+'" name="dp_start" type="text" class="form-control form_datepicker" placeholder="选择日期" value="" readonly>';
		htl += '		        <span class="input-group-addon"><i class="icon-calendar"></i></span>';
		htl += '		    </div>';
		htl += '			<span class="title1">至</span>';
		htl += '			<div class="input-group datebox" id="dtbox_end_'+ids+'" onclick="date(this)">';
		htl += '		        <input id="dp_end_'+ids+'" name="dp_end" type="text" class="form-control form_datepicker" placeholder="选择日期" value="" readonly>';
		htl += '		        <span class="input-group-addon"><i class="icon-calendar"></i></span>';
		htl += '		    </div>';
		htl += '			<button id="btn_delete_'+ids+'" name="btn_delete" type="button" class="btn btn-danger" style="float:right;dispaly: inline-table;" onclick="dele_node(this)">删除</button>';
		htl += '		</div>';

		htl += '		<div class="infobox_line">';
		htl += '			<span class="title1">合&nbsp;&nbsp;作&nbsp;&nbsp;方：</span>';
		htl += '			<input id="txt_record_boss_'+ids+'" name="txt_record_boss" type="text" class="form-control info_txt" placeholder="企业或单位即可" value=""> ';
		htl += '		</div>';

		htl += '		<div class="infobox_line">';
		htl += '			<span class="title1">合作内容：</span>';
		htl += '			<textarea id="txt_record_content_'+ids+'" name="txt_record_content" class="form-control info_txtarea" ></textarea>';
		htl += '		</div>	';

		htl += '       </div>';
 		htl += '   </div>';
		htl += '  </div>';
		//htl += '</div>';

		$("#record_new").append(htl);
	}
	//);
	*/

	//删除履历记录
	function dele_record_node(ctl)
	{		
		if(window.confirm("确定删除此记录？"))
		{
	    	$("#"+ctl.id).attr("disabled", true);  //按钮禁止点击

			record_id = ctl.id.replace(/btn_delete_record_/g, "");
		
			var post_data = {
				"user_id" : user_id,
				"psw" : psw,
				"record_id" : record_id
			};
			$.ajax({
				url: '../json/j_dele_record_single.php',
				type: 'POST',
				data: post_data,
				dataType: 'json',
				timeout: 10000,
				success: function(data)
				{
					var code = data.res_code;
					if(code=="100")//发送成功
					{
						node = $("#acd_grp_record_" + record_id)[0];
						node.remove();
	    				$("#"+ctl.id).attr("disabled", false);  //按钮可用
						//window.location.href='work.php';
					}
					if(code=="202")//
					{
						alert("登录状态错误，请重新登录");
					}
					if(code=="400")//异常
					{
						alert("异常");
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

    var max_count = 1;
    function btn_new_item_click()
    {
    	var nodehtml = document.getElementById("example_record").innerHTML;
    	nodehtml = nodehtml.replace(/recordid/g, "new" + max_count);
    	var rootnode = document.getElementById("record_new");
		rootnode.insertAdjacentHTML("beforeEnd", nodehtml);//因为至少要保留一个加号

    	max_count++;
    }

var max_record_count = 1;
function btn_new_record_item_click()
{
	var nodehtml = document.getElementById("example_record").innerHTML;
	nodehtml = nodehtml.replace(/recordid/g, "new" + max_work_count);
	var rootnode = document.getElementById("record_new");
	rootnode.insertAdjacentHTML("beforeEnd", nodehtml);//因为至少要保留一个加号

	max_record_count++;
}


function subString(str, len, hasDot)  
{  
    var newLength = 0;  
    var newStr = "";  
    var chineseRegex = /[^\x00-\xff]/g;  
    var singleChar = "";  
    var strLength = str.replace(chineseRegex,"**").length;  
    for(var i = 0;i < strLength;i++)  
    {  
        singleChar = str.charAt(i).toString();  
        if(singleChar.match(chineseRegex) != null)  
        {  
            newLength += 2;  
        }      
        else  
        {  
            newLength++;  
        }  
        if(newLength > len)  
        {  
            break;  
        }  
        newStr += singleChar;  
    }  

    if(hasDot && strLength > len)  
    {  
        newStr += "...";  
    }  
    return newStr;  
}
    function func_gen_record_title(date_start, date_end, boss, content)
    {
    	var sub = "";
    	sub = "["+date_start+" ~ "+date_end+"] "+boss;
      	len = sub.length;
      	left = 57 - len > 0 ? 57 - len : 0;
      	sub += subString(content, left, true);
      	if(content.length > left)
	       	sub += "...";      
    }
    //addnew是否是新增履历 0-保存原有履历，1-新增履历
    function func_save_record(ctl, addnew)
    {
	    $("#"+ctl.id).attr("disabled", true);  //按钮禁止点击
    	var record_id = ctl.id.replace(/btn_save_record_/g, "");
    	var record_id = record_id.replace(/btn_add_record_/g, "");
		
		var date_start = $("#record_dp_start_"+record_id).val();
		var date_end = $("#record_dp_end_"+record_id).val();
		var boss = $("#txt_record_boss_"+record_id).val();
		var content = $("#txt_record_content_"+record_id).val();

		$("#title_record_"+record_id).innerHTML = date_start+" ~ "+date_end+" "+boss;
			
		var post_data = {
			"user_id" : user_id,
			"psw" : psw,
			"record_id" : record_id,
			"date_start" : date_start,
			"date_end" : date_end,
			"boss" : boss,
			"content" : content
		};


		if(addnew == "0")
		{
			$.ajax({
				url: '../json/j_update_record_single.php',
				type: 'POST',
				data: post_data,
				dataType: 'json',
				timeout: 10000,
				success: function(data)
				{
					var code = data.res_code;
					if(code=="100")//发送成功
					{
						$("#title_record_"+record_id)[0].innerHTML = func_gen_record_title(date_start, date_end, boss, content);
						alert("保存成功");
						//window.location.href='work.php';
					}
					if(code=="202")//
					{
						alert("登录状态错误，请重新登录");
					}
					if(code=="400")//异常
					{
						alert("异常");
					}
				},
			　　complete : function(XMLHttpRequest,status)
				{ 
			　　　	if(status=='timeout')
						alert("网络通信超时，请重试。");
			　	}
			});	
		}
		else
			if(addnew == "1")
			{
				$.ajax({
					url: '../json/j_add_record_single.php',
					type: 'POST',
					data: post_data,
					dataType: 'json',
					timeout: 10000,
					success: function(data)
					{
						var code = data.res_code;
						if(code=="100")//发送成功
						{
							$("#title_record_"+record_id)[0].innerHTML = func_gen_record_title(date_start, date_end, boss, content);
							var new_record_id = data.record_id;
							var html = $("#acd_grp_record_"+record_id)[0].outerHTML;
							html = html.replace(new RegExp(record_id,"g"), new_record_id);
							$("#record_old").append(html);
							alert("保存成功");
							//window.location.href='work.php';
						}
						if(code=="202")//
						{
							alert("登录状态错误，请重新登录");
						}
						if(code=="400")//异常
						{
							alert("异常");
						}
					},
				　　complete : function(XMLHttpRequest,status)
					{ 
				　　　	if(status=='timeout')
							alert("网络通信超时，请重试。");
				　	}
				});	
			}
	    $("#"+ctl.id).attr("disabled", false);  //按钮可用

    }