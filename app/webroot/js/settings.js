(function($, undefined) {
	window.loadScript = function(url){
		 var df = $.Deferred();
	     var script = document.createElement("script");   
	     script.type="text/javascript";
	     if(script.readyState){   
	         script.onreadystatechange = function(){   
	             if(script.readyState=="loaded"||script.readyState=="complete"){   
	                  script.onreadystatechange=null;  
	                  df.resolve();   
	            }   
	         }   
	     }else{   
	        script.onload = function(){  
	        	df.resolve();
	        }   
	     }   
	     script.async = true;
	     script.src = url;   
	     var x = document.getElementsByTagName('script')[0];
	     x.parentNode.insertBefore(script, x); 
	     return df;
	}; 
	$.fn.userMenu = function(params) {
		var $this = $(this);
		var header = $('<h2>').html('<a href="javascript:void(0)" class="db res_mem_menu_top">我的会员中心</a>');
		$this.append(header);
		if(session.currentUser.role === null){
			
		}
		var data = $.fn.userMenu.menus[session.currentUser.role];
		var root = $('<ul>');
		for ( var i = 0; i < data.length; i++) {
			var _name = data[i].name;
			var _row = $('<li>');
			_row.text(_name);
			if (data[i].menus != undefined) {
				var _submenu = $('<ul>')
				for ( var j = 0; j < data[i].menus.length; j++) {
					var _subrow = $('<li>');
					_subrow.attr('link' ,data[i].menus[j].link )
					_subrow.text(data[i].menus[j].name);
					_subrow.click(function(e){
						$.fn.onMenuItemClicked($(e.target.parentElement).attr('link'));
					});
					_submenu.append(_subrow);
				}
				_row.append(_submenu);
			}
			root.append(_row);
		}
		$this.append(root);
		root.kendoPanelBar({
			expandMode : "multiple"
		});
		root.data("kendoPanelBar").expand(root.find('li'));
		if(params!=undefined){
			console.log(params);
			$.fn.onMenuItemClicked(params);
		}
			
	};
	$.fn.onMenuItemClicked = function(menukey){
		
		switch(menukey){
			case 'order_new':
			case 'order_old':
				$.when(loadScript('js/myorders.js'))
				.done(function(){
					if(menukey == 'order_old')
						$('#detail-info').listOrders({"status":["used","commented"]});
					else
						$('#detail-info').listOrders({"status":["new","confirming","topay","paied"]});
				});
				break;
			case 'userinfo':
				$('#detail-info').empty();
				$.when($('#detail-info').loadHtml(router.templates.userinfo))
				.done(function(){
					
				});
				break;
			case 'usergrade':
				$('#detail-info').empty();
				$.when($('#detail-info').loadHtml(router.templates.usergrade))
				.done(function(){
					
				});
				break;
			case 'userscore':
				$('#detail-info').empty();
				$.when($('#detail-info').loadHtml(router.templates.userscore))
				.done(function(){
					
				});
				break;
			case 'resetpassword':
				$('#detail-info').empty();
				$.when($('#detail-info').loadHtml(router.templates.resetpassword))
				.done(function(){
					
				});
				break;
			case 'category':
				$.when(loadScript('js/pages/dishCategory.js'))
				.done(function(){
					$('#detail-info').dishCategory();
				});
				break;
			case 'category_adjust':
				$.when(loadScript('js/pages/myMenu.js'))
				.done(function(){
					$('#detail-info').menugrid();
				});
				break;
			case 'discount':
				
				break;
			case 'sellerinfo':
				$('#detail-info').empty();
				$.when($('#detail-info').loadHtml(router.templates.sellerinfo))
				.done(function(){
					
				});
				break;
			
		}
	};
	$.fn.userMenu.menus = {
		user : [ {
			name : '订单中心',
			menus : [ {
				name : '未消费订单',
				link : 'order_new'
			}, {
				name : '已消费订单',
				link : 'order_old'
			} ]
		}, {
			name : '账号管理',
			menus : [ {
				name : '账号资料',
				link : 'userinfo'
			}, {
				name : '会员等级',
				link : 'usergrade'
			}, {
				name : '会员积分',
				link : 'userscore'
			}, {
				name : '修改密码',
				link : 'resetpassword'
			} ]
		} ],
		seller : [{name: '餐厅信息',
					menus : [ {
						name : '餐厅基本信息',
						link : 'sellerinfo'
					}]},
		          {name : '订单中心',
					menus : [ {
						name : '未处理订单',
						link : 'order_new'
					}, {
						name : '已处理订单',
						link : 'order_old'
					}]
		},{
			name: '菜单管理',
			menus:[{
				name: '菜品种类管理',
				link: 'category'
			},{
				name: '菜单编辑',
				link: 'category_adjust'
			}]
		},{
			name:'活动管理',
			menus:[{
				name: '打折管理',
				link: 'discount'
			},{
				name: '积分兑换',
				link: 'scorexg'
			}]
		}],
		manager : []
	}
})(jQuery);
$(document).ready(
		function() {
			var _paramstart = document.location.href.indexOf('?') + 1;
			var key = document.location.href.substring(_paramstart);
			$.when($("#header-bar").loadHtml(router.templates.header)).done(
					function() {
						if (auth) {
							auth.setBreadCrumb([ {
								text : '上海首页',
								link : 'void(0)'
							} ]);
							auth.afterCurrentUser = function() {
								if(session.currentUser && session.currentUser.username){
									$('#infomenu').userMenu(key);
								}else{
									//login first
									auth._loginDlg.open();
									//redirect to target page
									auth.afterLoginDlgClose = function(){
										if(session.currentUser && session.currentUser.username){
											$('#infomenu').userMenu(key);
										}
									}
								}
							}
						}
					});
		});