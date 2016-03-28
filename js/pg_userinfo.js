
$(document).ready(function()
{
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

	$('#modal_lg_work').on('shown.bs.modal', function () {

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
					var rep_work_ids_arr = func_get_rep_work_ids().split(",");

					for(var i=0; i<res.length; i++)
					{
						if(rep_work_ids_arr.indexOf(res[i].work_id) == -1)//只能选择没有被选的作品
						{
							html += '<a class="thumbnail fileinput-button" style="margin-bottom: 0px;">';	
							html += '	<img id="rep_work_choos_'+res[i].work_id+'" src="'+res[i].work_pic1+'" onclick="func_rep_work_choose(this)" class="img-responsive img_work" style="position: relative;cursor: pointer;" >';
							html += '	<label class="header_title" style="width:90px;text-align:center;">'+res[i].work_name+'</lable>';
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

	//上传头像
    $("#img_upload_portrait").fileupload(
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
            $("#upload_show_portrait").attr("src", data.result.path); //显示图片
            $("#upload_show_portrait").attr("name", "pot_"+data.result.pic_id); //改变照片id
        	$("#upload_progress_div").css({display:"none"});  
            $("#upload_portrait_tip").html("上传成功");
        }
		else
            $("#upload_portrait_tip").html("上传失败");
    });  


    //选取才艺
	$(".btn_skill_skill").bind("click",function(ctl)
	{	
$('.dropdown-toggle').dropdown();
		//alert(ctl.currentTarget.id);
		if(ctl.currentTarget.parentNode.id == "skill_group_selected")
			$("#skill_group_left").append(ctl.currentTarget);
		else
			if(ctl.currentTarget.parentNode.id == "skill_group_left")
				$("#skill_group_selected").append(ctl.currentTarget);
	});



	//上传作品图片
    $("#img_upload_work").fileupload(
    {  
		dataType: 'json',
        url: 'json/j_upload_workpic.php',  
        sequentialUploads: true  
    }).bind('fileuploadprogress', function (e, data) 
    {  
    }).bind('fileuploaddone', function (e, data) 
    {  
    	//strs = e.currentTarget.id.replace("img_upload_", "").split("_");
    	//pic_index = strs[0];
    	//work_id = strs[1];
    	if(data.result.code == "100")
    	{
            //$("#upload_show_"+pic_index+"_"+work_id).attr("src", data.result.path); //显示图片
            //$("#upload_show_"+pic_index+"_"+work_id).attr("name", "work_pic_"+pic_index+"_"+data.result.pic_id); //改变照片id
            var para = "1";
    		if(e.currentTarget.previousElementSibling.src.indexOf("add_bg.png") < 0)//添加图片,标记当前为添加
    			para = "2";
            e.currentTarget.previousElementSibling.src = data.result.path;//因为图片就是这个节点的上一个元素
            e.currentTarget.previousElementSibling.name = "work_pic_"+data.result.pic_id;
            e.currentTarget.nextElementSibling.style.visibility = "visible";
			var picgrp = e.currentTarget.parentNode.parentNode.parentNode;
			func_picbox_reload(picgrp, para);
        }
		else
            $("#upload_portrait_tip").html("上传失败");
    });  


	btn_new_record_item_click();//先新增一个合作简历模块
    btn_new_work_item_click();//先新增一个作品模块

});




//保存用户基本信息
function func_save_userinfo(ctl)
{	
	var user_name = $("#txt_user_name").val();
	if(user_name.replace(/(^\s*)|(\s*$)/g,"") == "")
	{
		alert("用户名不能为空");
		return;
	}
	var sex = $("#ckb_sex")[0].checked ? 1: 0;
	var role = $("input[name='rbtn_role']:checked").val();
	var college_id = $('select#cmb_college option:selected').val();
	var greed = $("input[name='rbtn_greed']:checked").val();
	var major_id = $('select#cmb_major option:selected').val();
	var district_id = $('select#cmb_district option:selected').val();
	var portrait_id = $('#upload_show_portrait')[0].name.replace(/pot_/g,"");

	/*
	if(!/^[0-9]+.?[0-9]*$/.test(price))
	{
	  	alert('作品定价格式有误');
	  	return;
	}
	else*/
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
					window.location.href = "userinfo.php";
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
}


var rep_work_id = "";
//展示代表作品选择面板
function func_show_rep_work_choose_panle(ctl)
{
	rep_work_id = ctl.id;
}
//选择代表作品
function func_rep_work_choose(ctl)
{
	var pic_id = ctl.id.replace(/rep_work_choos_/g, "");

	$("#modal_lg_work").modal('hide');
	$("#"+rep_work_id)[0].src = ctl.src;
	$("#"+rep_work_id)[0].id = "rep_work_pic_"+pic_id;
	var rem_btn = "remove_rep_work_"+rep_work_id.replace(/rep_work_pic_/g,"");
	$("#"+rem_btn).css("visibility","visible");
	$("#"+rem_btn)[0].id = "remove_rep_work_" + pic_id;


	func_rep_work_new_picbox($("#rep_workpic_group")[0]);


	var html = "";
	$("#grp_represent_work_choose")[0].innerHTML = html;
}

//删除代表作品
function btn_remove_rep_work_pic_click(ctl)
{
	var picgrp = ctl.parentNode.parentNode.parentNode;
	func_picbox_reload(picgrp, 0);
	ctl.parentNode.remove();

	$("#modal_lg_work").modal('hide');
	//func_rep_work_new_picbox(ctl.parentNode.parentNode.parentNode, 0);
};

//在添加一个新的代表作品选择框
function func_rep_work_new_picbox(rootnode)
{
	var nodes = $("#"+rootnode.id).find("img");
	max_id = "";
	already = false;//防止在删除节点时，重复添加加号
	for(var i=0; i<nodes.length; i++)
	{
		var node = nodes[i];
		var id = node.id.replace(/rep_work_pic_/g,"");
		if(node.src.indexOf("add_bg.png")>=0)
			already = true;
		if(id.length > max_id.length)
			max_id = id;
	}
	max_id += "new1";
		
	if(already == false)
	{
		htl = ""; 

		htl += '<div class="col-xs-6 col-md-3 imgbox_work" style="padding-left: 1px; margin-left: 5px;">      		';
		htl += '	<a class="thumbnail fileinput-button" data-toggle="modal" data-target="#modal_lg_work">				';
		htl += '		<img id="rep_work_pic_'+max_id+'" class="img_work" src="img/add_bg.png" data-holder-rendered="true"  onclick="func_show_rep_work_choose_panle(this)"> 	';
		htl += '		<span id="remove_rep_work_'+max_id+'" class="glyphicon glyphicon-trash btn_remove_work_pic" style="visibility: hidden;" aria-hidden="true" onclick="btn_remove_rep_work_pic_click(this)" title="删除图片">';
		htl += '		</span>		';	
		htl += '	</a>	  ';  
		htl += '</div>';

		rootnode.insertAdjacentHTML("beforeEnd", htl);//因为至少要保留一个加号
	}
}
//获取已选的代表作品
function func_get_rep_work_ids()
{
	var btn_rep_works = $("#rep_workpic_group").find('img');
	rep_work_ids = "";
	for(var i=0; i<btn_rep_works.length; i++)
	{
		var node = btn_rep_works[i];
		var id = node.id.replace(/rep_work_pic_/g, "");

		rep_work_ids += id;
		if(i<btn_rep_works.length-1)
			rep_work_ids += ",";
	}
	return rep_work_ids;
}
//保存才艺信息
function func_save_skill(ctl)
{	
	var btn_skills = $("#skill_group_selected").find('.btn_skill');
	var skill_brief = $("#txt_skill_brief").val();

	post_data = {};
	post_data["skill"] = {};
	post_data["user_id"] = user_id;
	post_data["psw"] = psw;
	post_data["skill_brief"] = skill_brief;
	post_data["rep_work_ids"] = func_get_rep_work_ids();

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
				//window.location.href='userinfo.php';
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


//新增履历记录模块
var max_record_count = 1;
function btn_new_record_item_click()
{
	var nodehtml = document.getElementById("example_record").innerHTML;
	nodehtml = nodehtml.replace(/recordid/g, "new" + max_work_count);
	var rootnode = document.getElementById("record_new");
	rootnode.insertAdjacentHTML("beforeEnd", nodehtml);//因为至少要保留一个加号

	max_record_count++;
}

//中文字符串定长截取
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
//履历信息更改或者添加后生成标头
function func_gen_record_title(date_start, date_end, boss, content)
{
	var sub = "";
	sub = "["+date_start+" ~ "+date_end+"] "+boss;
  	//len = sub.length;
  	//left = 57 - len > 0 ? 57 - len : 0;
  	//sub += subString(content, left, true);
  	//if(content.length > left)
    //   	sub += "...";      
    sub += content;
    return sub;
}
//新增履历，addnew是否是新增履历 0-保存原有履历，1-新增履历
function func_save_record(ctl, addnew)
{
    $("#"+ctl.id).attr("disabled", true);  //按钮禁止点击
	var record_id = ctl.id.replace(/btn_save_record_/g, "");
	var record_id = record_id.replace(/btn_add_record_/g, "");
	
	var date_start = $("#record_dp_start_"+record_id).val();
	var date_end = $("#record_dp_end_"+record_id).val();
	var boss = $("#txt_record_boss_"+record_id).val();
	var content = $("#txt_record_content_"+record_id).val();

	if(date_start=="" || boss=="" || content=="")
	{
		alert("履历信息需填写完整");
   		$("#"+ctl.id).attr("disabled", false);  //按钮可用
		return;
	}

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
    btn_new_record_item_click();//先新增一个履历模块

						$("#title_record_"+record_id)[0].innerHTML = func_gen_record_title(date_start, date_end, boss, content);
						var new_record_id = data.record_id;
						var html = $("#acd_grp_record_"+record_id)[0].outerHTML;
						html = html.replace(new RegExp(record_id,"g"), new_record_id);
						html = html.replace(/#F9EF91/g, "#80D5FF");
						$("#record_old").append(html);
						$("#acd_grp_record_"+record_id)[0].remove();
						alert("保存成功");
						window.location.href='userinfo.php';
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











//新增作品信息
var max_work_count = 1;
function btn_new_work_item_click()
{
	var nodehtml = document.getElementById("example_work").innerHTML;
	nodehtml = nodehtml.replace(/workid/g, "new" + max_work_count);
	var rootnode = document.getElementById("work_new");
	rootnode.insertAdjacentHTML("beforeEnd", nodehtml);//因为至少要保留一个加号

	rebind_upload('img_upload_work_1_new'+max_work_count);
	max_work_count++;
}

function rebind_upload(elem_id)
{    	
	//alert(elem_id);
		    $('#'+elem_id).fileupload(
		    {  
				dataType: 'json',
		        url: 'json/j_upload_workpic.php',  
		        sequentialUploads: true  
		    }).bind('fileuploadprogress', function (e, data) 
		    {  
		    }).bind('fileuploaddone', function (e, data) 
		    {  
		    	//strs = e.currentTarget.id.replace("img_upload_", "").split("_");
		    	//pic_index = strs[0];
		    	//work_id = strs[1];
		    	if(data.result.code == "100")
		    	{
		            //$("#upload_show_"+pic_index+"_"+work_id).attr("src", data.result.path); //显示图片
		            //$("#upload_show_"+pic_index+"_"+work_id).attr("name", "work_pic_"+pic_index+"_"+data.result.pic_id); //改变照片id
		            var para = "1";
		    		if(e.currentTarget.previousElementSibling.src.indexOf("add_bg.png") < 0)//添加图片,标记当前为添加
		    			para = "2";
		            e.currentTarget.previousElementSibling.src = data.result.path;//因为图片就是这个节点的上一个元素
		            e.currentTarget.previousElementSibling.name = "work_pic_"+data.result.pic_id;
		            e.currentTarget.nextElementSibling.style.visibility = "visible";
					var picgrp = e.currentTarget.parentNode.parentNode.parentNode;
					func_picbox_reload(picgrp, para);
		            //$("#upload_progress_div").css({display:"none"});  
		            //$("#btn_upload").css({display:"none"});  
		            //$("#upload_cancle").css({display:""});  
		        }
				else
		            $("#upload_portrait_tip").html("上传失败");
		    });  
}
//删除作品图片
function btn_remove_work_pic_click(ctl)
{
	var picgrp = ctl.parentNode.parentNode.parentNode;
	func_picbox_reload(picgrp, 0);
	ctl.parentNode.remove();
};

//给每个作品选才艺标签
function btn_skill_click(ctl)
{	
	ss = ctl.parentNode.id.split("_");
	work_id = ss[ss.length-1];//获取这个作品的id

	$("#work_skill_group_left_"+work_id).append($("#work_skill_group_selected_"+work_id).find(".btn_skill")[0]);

	if(ctl.parentNode.id.indexOf("work_skill_group_selected") >= 0 )
		$("#work_skill_group_left_"+work_id).append(ctl);
	else
		if(ctl.parentNode.id.indexOf("work_skill_group_left") >= 0 )
			$("#work_skill_group_selected_"+work_id).append(ctl);
};

//删除作品
function dele_work_node(ctl)
{		
	if(window.confirm("确定删除此作品记录？\n删除操作不可恢复！"))
	{
    	$("#"+ctl.id).attr("disabled", true);  //按钮禁止点击

		work_id = ctl.id.replace(/btn_delete_work_/g, "");
	
		var post_data = {
			"user_id" : user_id,
			"psw" : psw,
			"work_id" : work_id
		};
		$.ajax({
			url: '../json/j_dele_work_single.php',
			type: 'POST',
			data: post_data,
			dataType: 'json',
			timeout: 10000,
			success: function(data)
			{
				var code = data.res_code;
				if(code=="100")//发送成功
				{
					node = $("#acd_grp_work_" + work_id)[0];
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


//在添加或者删除掉作品的图片的时候，这里需要检测是否能够继续添加图片
//add_or_dele 0-dele;1-add
function func_picbox_reload(rootnode, add_or_dele)
{
	var nodes = $("#"+rootnode.id).find("img");
	max_id = 0;
	work_id = rootnode.id.replace(/workpic_group_/g, "");
	already = false;//防止在删除节点时，重复添加加号
	for(var i=0; i<nodes.length; i++)
	{
		var node = nodes[i];
		var index = node.id.replace(/upload_show_work_/g, "").replace("_"+work_id, "");
		if(node.src.indexOf("add_bg.png") >= 0 )
			already = true;
		if(index > max_id)
			max_id = index;
	}
	max_id += 1;
	//因为这是在增加或删除之前就处理的，
	//删除图片时，判断nodes.length==1时至少要保留一个加号，nodes.length==4时要保留一个加号继续添加图片
	//添加或者改变图片时，因为无法判断是添加还是改变，所以，如果当前的图片数小于4，则需要保留一个加号
	if( (add_or_dele == 0 && !already && ( nodes.length == 1 || nodes.length == 4)) || (add_or_dele == 1 && nodes.length < 4) ) 
	{
		htl = ""; 	
		htl += '	<div class="col-xs-6 col-md-3 imgbox_work">      ';		
		htl += '		<span id="img_remove_'+max_id+'_'+work_id+'" class="glyphicon glyphicon-trash btn_remove_work_pic" style="visibility:hidden;" aria-hidden="true" onclick="btn_remove_work_pic_click(this)" title="删除图片"></span>		';	
		htl += '		<a class="thumbnail fileinput-button">		';		
		htl += '			<img id="upload_show_work_'+max_id+'_'+work_id+'" name="work_pic_" class="img_work" src="../img/add_bg.png" data-holder-rendered="true"> 	';		
		htl += '			<input id="img_upload_work_'+max_id+'_'+work_id+'" class="img_upload" type="file" name="upfile" accept="image/*" fileupload="func_test()">  				';
		htl += '		</a>	    ';
		htl += '	</div>    	';
		rootnode.insertAdjacentHTML("beforeEnd", htl);//因为至少要保留一个加号

		//这里呢，是一个bug，因为使用class绑定$(".img_upload").fileupload这个是在页面加载的时候绑定的，但是你要添加、删除图片吧，那新创建的“上传文件”元素就绑定不了上传的这个事件了，那么自然也就无法完成上传功能了
		//1.本来想像onclick=“function”这样的方法，在定义元素的时候绑定事件的，但是找了下jquery-file-upload的文档查找上传事件，而且也自己试过发现这个元素的上传事件不是fileupload，所以这种方法不能用了
		//2.再一个方法就是重复绑定，就是每次生成一个上传空间元素的时候，就执行一次class绑定 $(".img_upload").fileupload ，但是，这个万万不可啊，因为，这样就会重复触发啊
		//所以，就只能用上传控件的id来绑定咯
		//上传图片
		rebind_upload('img_upload_work_'+max_id+'_'+work_id);


	}

}

//新增作品信息
var max_work_count = 1;
function btn_new_work_item_click()
{
	var nodehtml = document.getElementById("example_work").innerHTML;
	nodehtml = nodehtml.replace(/workid/g, "new" + max_work_count);
	var rootnode = document.getElementById("work_new");
	rootnode.insertAdjacentHTML("beforeEnd", nodehtml);//因为至少要保留一个加号

	rebind_upload('img_upload_work_1_new'+max_work_count);
	max_work_count++;
}

function rebind_upload(elem_id)
{    	
	//alert(elem_id);
		    $('#'+elem_id).fileupload(
		    {  
				dataType: 'json',
		        url: 'json/j_upload_workpic.php',  
		        sequentialUploads: true  
		    }).bind('fileuploadprogress', function (e, data) 
		    {  
		    }).bind('fileuploaddone', function (e, data) 
		    {  
		    	//strs = e.currentTarget.id.replace("img_upload_", "").split("_");
		    	//pic_index = strs[0];
		    	//work_id = strs[1];
		    	if(data.result.code == "100")
		    	{
		            //$("#upload_show_"+pic_index+"_"+work_id).attr("src", data.result.path); //显示图片
		            //$("#upload_show_"+pic_index+"_"+work_id).attr("name", "work_pic_"+pic_index+"_"+data.result.pic_id); //改变照片id
		            var para = "1";
		    		if(e.currentTarget.previousElementSibling.src.indexOf("add_bg.png") < 0)//添加图片,标记当前为添加
		    			para = "2";
		            e.currentTarget.previousElementSibling.src = data.result.path;//因为图片就是这个节点的上一个元素
		            e.currentTarget.previousElementSibling.name = "work_pic_"+data.result.pic_id;
		            //e.currentTarget.nextElementSibling.style.visibility = "visible";
		            e.currentTarget.parentNode.previousElementSibling.style.visibility = "visible";
					var picgrp = e.currentTarget.parentNode.parentNode.parentNode;
					func_picbox_reload(picgrp, para);
		            //$("#upload_progress_div").css({display:"none"});  
		            //$("#btn_upload").css({display:"none"});  
		            //$("#upload_cancle").css({display:""});  
		        }
				else
		            $("#upload_portrait_tip").html("上传失败");
		    });  
}

//新增作品，addnew是否是新增作品 0-保存原有作品，1-新增作品
function func_save_work(ctl, addnew)
{
    $("#"+ctl.id).attr("disabled", true);  //按钮禁止点击
	var work_id = ctl.id.replace(/btn_save_work_/g, "");
	var work_id = work_id.replace(/btn_add_work_/g, "");
	//alert(work_id);

	//作品图片
	var pic_nodes = $("#workpic_group_"+work_id).find("img");
	var pic_ids = "";
	var pic_count = 0;
	for(var k=0; k<pic_nodes.length; k++)
	{
		var pic_id_this = pic_nodes[k].name.replace(/work_pic_/g, "");
		if(pic_id_this != null && pic_id_this != "")
			if(pic_ids != "")
				pic_ids += "," + pic_id_this;
			else
				pic_ids += pic_id_this;
		pic_count++;
	}

	//作品名称
	var work_name = $("#txt_work_name_"+work_id)[0].value;

	//才艺信息
	var skill_nodes = $("#work_skill_group_selected_"+work_id).find(".btn_skill");//选取的才艺节点集合
	var skill_id = "";
	var work_skill = "";
	if(skill_nodes.length > 0)
	{
		skill_id = skill_nodes[0].id.replace(/skill_/g, "");
		work_skill = skill_nodes[0].innerHTML;
	}
	//作品简介
	var comment = $("#txt_work_comment_"+work_id)[0].value;


	//定价性质
	var price_type = $("input[name='rbtn_pricetype_"+work_id+"']:checked").val();
	//作品定价
	var price = $('#txt_price_'+work_id).val();
	//买家限定
	var customer_limit = $("input[name='rbtn_cuslimit_"+work_id+"']:checked").val();
	//支付要求
	var delivery_type = $("input[name='rbtn_delivery_"+work_id+"']:checked").val();
	//其他
	var pay_comment = $('#txt_pay_comment_'+work_id).val();
	
	if(pic_ids=="" || work_name=="" || skill_id=="" || comment=="" || price_type=="" || customer_limit=="" || delivery_type=="")
	{
		alert("商品信息需填写完整");
   		$("#"+ctl.id).attr("disabled", false);  //按钮可用
		return;
	}
	
	var post_data = {
		"user_id" : user_id,
		"psw" : psw,
		"work_id" : work_id,
		"pic_ids" : pic_ids,
		"work_name" : work_name.replace(/(^\s*)|(\s*$)/g, ""),
		"skill_id" : skill_id,
		"comment" : comment.replace(/(^\s*)|(\s*$)/g, ""),
		"price_type" : price_type,
		"price" : price,
		"customer_limit" : customer_limit,
		"delivery_type" : delivery_type,
		"pay_comment" : pay_comment
	};
	if(pic_ids=="" || work_name=="" || skill_id=="" || comment=="")
		$("#header_"+work_id).css("background-color","#F2DEDE");//信息不全
	else
	{
		/*
		if(two==0)
		{
			$("#header_"+work_id).css("background-color","#A2F4C8");//信息不全
			post_data["work_old"][data_index] = data;
		}
		else
			if(two==1)
			{
				$("#header_"+work_id).css("background-color","#A2F4C8");//信息不全
				post_data["work_new"][data_index] = data;
			}
			*/
	}

	$("#title_work_"+work_id).innerHTML = work_name;

	if(addnew == "0")
	{
		$.ajax({
			url: '../json/j_update_work_single.php',
			type: 'POST',
			data: post_data,
			dataType: 'json',
			timeout: 10000,
			success: function(data)
			{
				var code = data.res_code;
				if(code=="100")//发送成功
				{
					title = work_name+" ["+work_skill+"] ["+pic_count+'P] '+comment;
					$("#title_work_"+work_id)[0].innerHTML = title;
					alert("保存成功");
					//window.location.href='userinfo.php';
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
				url: '../json/j_add_work_single.php',
				type: 'POST',
				data: post_data,
				dataType: 'json',
				timeout: 10000,
				success: function(data)
				{
					var code = data.res_code;
					if(code=="100")//发送成功
					{

    btn_new_work_item_click();//先新增一个作品模块
						$("#title_work_"+work_id)[0].innerHTML = work_name;
						var new_work_id = data.work_id;
						var html = $("#acd_grp_work_"+work_id)[0].outerHTML;
						html = html.replace(new RegExp(work_id,"g"), new_work_id);
						html = html.replace(/#F9EF91/g, "#80D5FF");
						$("#work_old").append(html);
						$("#acd_grp_work_"+work_id)[0].remove();
						alert("保存成功");
						//window.location.href='userinfo.php';
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
