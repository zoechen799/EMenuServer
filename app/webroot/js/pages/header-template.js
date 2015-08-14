$(document).ready(function(){
	window.auth ={
		getCurrentUser: function(){
			// set visible | invisible for menu items
			var setMenuItems = function(username){
				if(username){
					$('#user-menu').text(username);
					$('#user-name').css('display','');
					$('#user-orders').css('display','');
					$("#user-login").css('display','none');
					$("#user-signup").css('display','none');
					$("#mypost").css('display','');
					$("#newpost").css('display','');
				}else{
					//未登录
					$('#user-name').css('display','none');
					$('#user-orders').css('display','none');
					$("#mypost").css('display','none');
					$("#newpost").css('display','none');
					$("#user-login").css('display','');
					$("#user-signup").css('display','');
				}
			};
			var dtd = $.Deferred();
			//load current login data from server
			$.getJSON(router.users.current + router.timestamp(), function(data){
				if(data!=undefined && data.user!=undefined && data.user.id!=undefined && data.user.username!=undefined){
					// 已登录
					setMenuItems(data.user.username);
					$("#logout").click(function(){
						$.getJSON(router.users.logout,function(){
							router.gotoView('index');
						});
					});
					$("#user-orders").click(function(){
						router.gotoView('settings','order_new');
					});
					$("#user-settings").click(function(){
						router.gotoView('settings');
					});
					
					if(session && session.currentUser){
						session.currentUser.userid = data.user.id;
						session.currentUser.username = data.user.username;
						session.currentUser.tel = data.user.mobilephone;
						session.currentUser.gender = data.user.gender;
						session.currentUser.role = data.user.role;
						session.currentUser.restaurant_id = data.user.restaurant_id;
					}
					dtd.resolve();
				}
				else{
					setMenuItems(undefined);
					auth.buildLoginDialog();
					auth.buildRegDialog();
					$('#user-login').find('a').click(function(e){
						auth._loginDlg.open();
					});
					$('#user-signup').find('a').click(function(){
						auth._regDlg.open();
					});
					dtd.resolve();
				}
			});
			return dtd;
		},
		afterCurrentUser:undefined,
		buildLoginDialog: function(){
			var login = $('#logindialog');
			var that = this;
			if (!login.data("kendoWindow")){
				login.kendoWindow({
	                width: "600px",
	                height: "450px",
	                title: "",
	                modal: true,
	                draggable:false,
	                visible: false,
	                content: router.templates.login,
	                appendTo: 'body',
	                activate: function(e){
	                	$('.lnk-register').click(function(){
	                		auth._loginDlg.close();
	                		auth._regDlg.open();
	                	});
	                	router.afterLogin = function(e){
	                		auth._loginDlg.close();
	                	}
	                	router.failedLogin = function(e){
	                		alert("错误的用户名，密码，请核对后再登陆!");
	                	}
	                },
					deactivate: function(){
						$.when(that.getCurrentUser())
						.then(function(){
							//回到gotoView的界面
							if(that.afterLoginDlgClose)
								that.afterLoginDlgClose();
							else if(session.currentUser && (session.currentUser.role == 'seller' || session.currentUser.role == 'manager')){
								router.gotoView('settings');
							}
						});
					}
	            });
			}
			var dlg = login.data("kendoWindow");
			dlg.center();
			auth._loginDlg = dlg;
		},
		_loginDlg: undefined,
		afterLoginDlgClose: undefined,
		buildRegDialog: function(){
			var login = $('#regdialog');
			if (!login.data("kendoWindow")){
				login.kendoWindow({
	                width: "600px",
	                height: "450px",
	                title: "",
	                modal: true,
	                draggable:false,
	                visible: false,
	                content: router.templates.register,
	                appendTo: 'body',
	                activate: function(e){
	                	$('.lnk-login').click(function(){
	                		auth._regDlg.close();
	                		auth._loginDlg.open();
	                	});
	                	router.afterRegister = function(){
	                		auth._regDlg.close();
	                	}
	                	router.failedRegister = function(){
	                		alert("注册用户失败,请稍后再试!");
	                	}
	                },
	                deactivate: function(){
	                	$.when(auth.getCurrentUser())
						.then(function(){
							if(auth.afterRegDlgClose)
								auth.afterRegDlgClose();
						});
						
					}
	            });
			}
			var dlg = login.data("kendoWindow");
			dlg.center();
			auth._regDlg = dlg;
		},
		_regDlg: undefined,
		afterRegDlgClose:undefined,
		setBreadCrumb: function(arr){
			$('.breadcrumb').empty();
			for(var i=0; i<arr.length; i++){
				var  link;
				if(i == arr.length-1){
					var link =$('<li>').addClass('active').text(arr[i].text);
				}else{
					link = $('<li>').html('<a href="javascript:'+ arr[i].link +'">'+arr[i].text+'</a> <span class="divider">/</span>');
				}
				$('.breadcrumb').append(link);
			}
		}
	}
	$.when(auth.getCurrentUser())
	.done(function(){
		if(auth.afterCurrentUser){
			auth.afterCurrentUser();
		}
	});
});
