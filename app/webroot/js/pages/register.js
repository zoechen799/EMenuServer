$(document).ready(function() {
    $('#authcode1').click(function() {
        $('#authcode1').attr('src', router.images.captcha);
    });
    $('#user_name1').change(function() {
        $.getJSON(router.users.existuser + $('#user_name1').val() + router.timestamp(),
        function(data) {
            if (data.user == "true") {
                $('#errmsg').text('该用户已经存在！');
            } else {
                $('#errmsg').text('');
            }

        });
    });
    var loginAsWeibo1 = function(o) {
        var formdata = {
            data: {
                User: {
                    username: o.name,
                    password: o.id,
                    avataurl: o.profile_image_url,
                    gender: o.gender
                }
            }
        };
        var _rawdata = "_method=POST&" + $.param(formdata);
        $.post(router.users.loginasweibo, _rawdata).done(function(data) {
            if (data.loggedin == "true") {
                if (window.router.afterLogin != undefined) window.router.afterLogin.apply(this, [o.name]);
            } else {
                if (window.router.failedLogin != undefined) window.router.failedLogin();
            }
        });
    };

    WB2.anyWhere(function(W) {
        W.widget.connectButton({
            id: "wb_connect_btn1",
            type: '3,2',
            callback: {
                login: function(o) {
                    loginAsWeibo1(o);
                },
                logout: function() {
                    // alert('logout');
                }
            }
        });
    });
    var loginAfterRegister = function(_username, _password) {
        var def = $.Deferred();
        var formdata = {
            data: {
                User: {
                    username: _username,
                    password: _password
                }
            }
        };
        var _rawdata = "_method=POST&" + $.param(formdata);
        $.ajax({
            type: 'POST',
            url: router.users.login,
            data: _rawdata,
            complete: function(msg) {
                if (msg.status >= 200 && msg.status <= 306) {
                    def.resolve(true);
                } else {
                    def.resolve(false);
                }
            }
        });
        return def;
    };
    $('#btn-register').click(function() {
        var _username = $('#user_name1').val();
        var _password = $('#password').val();
        var _confirm = $('#confirm_password').val();
        var _captchar = $('#captcha_solution1').val();
        var _role ='user';
        if($('#isseller').attr('checked')!=undefined)
        	_role = 'seller';
        if (_username == undefined || _username.length == 0) {
            alert('请输入用户名');
            return;
        }
        if (_password == undefined || _password.length == 0) {
            alert('请输入密码');
            return;
        }
        if (_confirm != _password) {
            alert('两次输入的密码不同，请检查!');
            return;
        }
        var _captcha = $('#captcha_solution1').val();
        $.getJSON(router.users.verifyauth + _captcha)
		.done(function(data){
			if(data.auth == true){
				var formdata = {
			            data: {
			                User: {
			                    username: _username,
			                    password: _password,
			                    role: _role
			                }
			            }
			        };
			        var _rawdata = "_method=POST&" + $.param(formdata);
			        $.ajax({
			            type: 'POST',
			            url: router.users.add ,
			            data: _rawdata,
			        }).done(function(data) {
			        	if(data.user!=null && (data.user instanceof Array) && data.user.length==0){
			            	alert("注册用户失败,请更换用户名重新注册.");
			            }else
			            if (data.user!=null && data.user.hasOwnProperty('id')) {
			                $.when(loginAfterRegister(_username, _password)).done(function(succ) {
			                    $.when(auth.getCurrentUser()).then(function() {
			                        if (window.router.afterRegister != undefined) {
			                            window.router.afterRegister.apply(this, [_username]);
			                        } else {
			                            if (window.router.failedRegister != undefined) window.router.failedRegister();
			                        }
			                    });
			                });
			            } else{
			            	alert("注册用户失败,请检查您的输入.");
			            }
			        });
			}else{
				alert('验证码输入错误，请重新输入');
	            return;
			}
		});
        
    });
});