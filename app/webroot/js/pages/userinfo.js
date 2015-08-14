$(document).ready(function(){
	var _model;
	var updateData = function(){
		$.getJSON(router.users.current, function(data){
			_model = kendo.observable(data.user);
			_model.bind('change', function(){
				$("#save").removeAttr('disabled');
			});
			kendo.bind($("#info-container") , _model);
			if(data.user.gender == 'f'){
				$('#gender-female').attr('checked' , 'checked');
			}else{
				$('#gender-male').attr('checked' , 'checked');
			}
			$('#gender-female').click(function(){
				_model.set('gender','f');
			})
			$('#gender-male').click(function(){
				_model.set('gender','m');
			})
			$("#save").attr('disabled','disabled');
			if(data.user.avataurl){
				$("#avata").attr('src' , data.user.avataurl);
			}
		});
	};
	updateData();
	$('#fileupload').change(function(e){
		var file = this.files[0];
		if(file==null || (file.type!='image/jpeg' && file.type!='image/png' && file.type!='image/gif')){
			alert(localization.userinfo.formaterr);
		}
	});
	$('#uploadavata').click(function(){
		$('#myModal').modal('show');
	});
	$('#uploadphoto').click(function(){
		console.log("1");
		var file = $('#fileupload')[0].files[0];
		if(file!=null && (file.type=='image/jpeg' || file.type=='image/png' || file.type=='image/gif')){
			console.log("2");
			var total = file.size;
			$.when(session.uploadFile(router.users.uploadphoto , file, function(done){
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
		});
	});
});