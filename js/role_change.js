$(document).ready(function(){
	
	$("#rbtn_student").bind("change",function(ctl)
	{	
		role_change();
	});	
	$("#rbtn_worker").bind("change",function(ctl)
	{	
		role_change();
	});	
	$("#rbtn_company").bind("change",function(ctl)
	{	
		role_change();
	});
	function role_change()
	{
		if($("#rbtn_student")[0].checked)
			$("#grp_student").css("display", "block");
		else
			$("#grp_student").css("display", "none");
	}

});