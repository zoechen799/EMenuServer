$(document).ready(function() {
	$('#authcode').click(function() {
		$('#authcode').attr('src', router.images.captcha);
	})
	var loginAsWeibo = function(o) {
		var formdata = {
			data : {
				User : {
					username : o.name,
					password : o.id,
					avataurl : o.profile_image_url,
					gender : o.gender
				}
			}
		};
		var _rawdata = "_method=POST&" + $.param(formdata);
		$.post(router.users.loginasweibo, _rawdata).done(function(data) {
			if (data.loggedin == "true") {
				if (window.router.afterLogin != undefined)
					window.router.afterLogin.apply(this, [ o.name ]);
			} else {
				if (window.router.failedLogin != undefined)
					window.router.failedLogin();
			}
		});
	};

	WB2.anyWhere(function(W) {
		W.widget.connectButton({
			id : "wb_connect_btn",
			type : '3,2',
			callback : {
				login : function(o) {
					loginAsWeibo(o);
				},
				logout : function() {
					// alert('logout');
				}
			}
		});
	});
	$('#btn-login').click(function() {
		var _username = $('#login_alias').val();
		var _password = $('#login_password').val();
		var _captcha = $('#captcha_solution').val();
		if (_username == undefined) {
			alert('请输入用户名');
			return;
		}
		if (_password == undefined) {
			alert('请输入密码');
			return;
		}
		$.getJSON(router.users.verifyauth + _captcha)
		.done(function(data){
			if(data.auth == true){
				var formdata = {
					data : {
						User : {
							username : _username,
							password : _password
						}
					}
				};
				var _rawdata = "_method=POST&" + $.param(formdata);
				$.ajax({
					type : 'POST',
					url : router.users.login,
					data : _rawdata,
				}).done(function(data) {
					if (data.loggedin == "true") {
						if (window.router.afterLogin != undefined)
							window.router.afterLogin.apply(this, [ _username ]);
					} else {
						if (window.router.failedLogin != undefined)
							window.router.failedLogin();
					}
				})
			}else{
				alert('验证码输入错误，请重新输入');
				return;
			}
		});
		
	});
});