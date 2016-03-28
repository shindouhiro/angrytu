$(document).ready(function(){

	//更改选择的省份
	$("#cmb_province").change(function () 
	{
		var province_id = $('select#cmb_province option:selected').val();

		var post_data = {
			"province_id": province_id
		};
		$.ajax({
			url: '../json/j_s_cities.php',
			type: 'POST',
			data: post_data,
			dataType: 'json',
			timeout: 10000,
			success: function(data)
			{
				$("#cmb_district").empty();
				htl = "<option></option>";
				$("#cmb_district").append(htl);
				for(i=0; i<data.length; i++)
				{
					htl = "<option value="+data[i][0]+">"+data[i][1]+"</option>";
					$("#cmb_district").append(htl);
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