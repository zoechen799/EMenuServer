$(document).ready(function(){
	var _model;
	var updateData = function(){
		$.getJSON(router.users.current, function(data){
			var restid = data.user.restaurant_id;
			$.getJSON( router.restaurants.view + restid , function(response){
				console.log(response);
				var extmodel = response.Restaurant.Restaurant;
				extmodel.username = data.user.username;
				if(response.Restaurant.Restaurant_picture.length>0){
					extmodel.logourl = response.Restaurant.Restaurant_picture[0].filepath;
				}
				_model = kendo.observable(extmodel);
				_model.bind('change', function(){
					$("#save").removeAttr('disabled');
				});
				kendo.bind($("#info-container") , _model);
				
				$("#save").attr('disabled','disabled');
				if(data.user.avataurl){
					$("#seller-logo").attr('src' , extmodel.logourl);
				}
			});
		});
	};
	updateData();
	$('#fileupload').change(function(e){
		var file = this.files[0];
		if(file==null || (file.type!='image/jpeg' && file.type!='image/png' && file.type!='image/gif')){
			alert(localization.sellerinfo.formaterr);
		}
	});
	$('#uploadlogo').click(function(){
		$('#myModal').modal('show');
	});
	$('#uploadphoto').click(function(){
		var file = $('#fileupload')[0].files[0];
		if(file!=null && (file.type=='image/jpeg' || file.type=='image/png' || file.type=='image/gif')){
			console.log("2");
			var total = file.size;
			$.when(session.uploadFile(router.restaurants.uploadphoto , file, function(done){
				console.log('xhr progress: ' + (Math.floor(done/total*1000)/10) + '%');
			}))
			.done(function(url){
				console.log(url);
				$('#myModal').modal('hide');
				updateData();
			})
		}else{
			console.log(file.type);
		}
	});
	
	$('#save').click(function(){
		var formdata = {
				data : {
					User : _model.toJSON()
				}
			};
		var _rawdata = "_method=POST&"+ $.param(formdata);
		$.when($.post(router.users.edit, _rawdata))
		.done(function(){
			updateData();
			$('#myModal').modal('hide');
		});
	});
});