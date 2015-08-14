$(document).ready(function(){
	$("#save").click(function(){
		var _oldpwd =$('#oldpassword').val();
		var _newpwd =$('#newpassword').val();
		var _cfmpwd =$('#confirmpassword').val();
		if(_oldpwd == '') 
			alert(localization.meta.please + localization.resetpassword.oldpassword);
		else if(_newpwd =='')
			alert(localization.meta.please + localization.resetpassword.newpassword);
		else if(_cfmpwd =='')
			alert(localization.meta.please + localization.resetpassword.confirmpassword);
		else if(_cfmpwd!=_newpwd)
			alert(localization.resetpassword.checkconsist);
		else {
			$.getJSON(router.users.changepassword + _oldpwd+'/'+_newpwd)
			.done(function(data){
				if(data.auth!='succeed'){
					$("#alert").removeClass('alert-success');
					$("#alert").addClass('alert-error');
				}else{
					$("#alert").removeClass('alert-error');
					$("#alert").addClass('alert-success');
				}
				$("#alert span").text(localization.resetpassword[data.auth]);
				$("#alert").css('visibility' , 'visible');
				
				$("#info-container input").change(function(){
					$("#alert").css('visibility' , 'hidden');
				});
			});
		}
	});
});