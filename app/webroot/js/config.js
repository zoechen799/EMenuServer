(function ($, undefined) {
	var documentbase = (document.location.pathname.indexOf("emenu") >=0) ? '/emenu/' : '/';
	var imageservice = (document.location.pathname.indexOf("emenu") >=0) ? '/imageservice/' : 'http://ledingcan-restaurant_pictures.stor.sinaapp.com/'; 
	if(jQuery)
	{
		$(document).ajaxError(function(event, request, settings) {
			  alert("error");
		});
	}
	window.router ={
			base: documentbase,
			gotoView: function(view , parameter){
				if(view =='addblog' || view =='bloglist' ||view == 'order' || view =='myorder'){
					if(session.currentUser && session.currentUser.username){
						location.href= documentbase+ view +".html" + (parameter? ("?" +parameter):"");
					}else{
						//login first
						auth._loginDlg.open();
						//redirect to target page
						auth.afterLoginDlgClose = function(){
							if(session.currentUser && session.currentUser.username){
								location.href= documentbase+ view +".html" + (parameter? ("?" +parameter):"");
							}
						}
					}
				}else{
					location.href= documentbase+ view +".html" + (parameter? ("?" +parameter):"");
				}
			},
			regions:{
				index: documentbase+'regions/index',
				view: documentbase+'regions/view/'
			},
			restaurants:{
				index: documentbase+'restaurants/index',
				categories: documentbase+ 'restaurants/categories',
				category: documentbase+ 'restaurants/category/',
				query: documentbase + 'restaurants/query',
				view: documentbase + 'restaurants/view/',
				coordinate: documentbase + 'restaurants/coordinate/',
				uploadphoto: documentbase+'restaurants/uploadphoto'
			},
			dishes:{
				index: documentbase +'dishes/index',
				view: documentbase +'dishes/view/',
				add: documentbase +'dishes/add',
				edit: documentbase +'dishes/edit/',
				remove: documentbase +'dishes/delete/',
				uploadphoto: documentbase +'dishes/uploadphoto/',
				listcategory: documentbase +'dishes/listcategory/',
				addcategory: documentbase +'dishes/addcategory/',
				editcategory: documentbase +'dishes/editcategory/',
				addcomment: documentbase +'dishes/addcomment',
				comments: documentbase +'dishes/comments/'
			},
			orders:{
				index: documentbase + 'orders/index',
				view:  documentbase + 'orders/view/',
				add: documentbase + 'orders/add',
				edit: documentbase + 'orders/edit/'
			},
			images:{
				nonerestaurant: imageservice+'imagenotfound.jpg',
				starPerfix: documentbase+'img/ShopStar',
				captcha: documentbase+ 'services/captcha',
				marker: documentbase+'img/marker.png'
			},
			services:{
				resize: documentbase+ 'services/resize',
			},
			blogs:{
				index: documentbase+'blogs/index',
				add: documentbase+'blogs/add',
				view: documentbase+'blogs/view/'
			},
			users:{
				add: documentbase+'users/add',
				current: documentbase+'users/current',
				login:documentbase+'users/login',
				logout: documentbase+'users/logout',
				loginasweibo: documentbase+'users/loginasweibo',
				verifyauth: documentbase+ 'services/verifyauth/',
				view: documentbase+'users/view/',
				edit: documentbase+'users/edit',
				changepassword: documentbase+'users/changepassword/',
				existuser: documentbase+'users/existuser/',
				uploadphoto: documentbase+'users/uploadphoto'
			},
			infos:{
				index: documentbase+'infomenus/index'
			},
			afterLogin: undefined,
			failedLogin: undefined,
			afterRegister: undefined,
			failedRegister: undefined,
			templates:{
				header: documentbase+'pages/header-template.html',
				login: documentbase+'pages/login.html',
				register: documentbase+'pages/register.html',
				myorders: documentbase+'pages/myorders.html',
				orderdetail:  documentbase+'pages/orderdetail.html',
				userinfo: documentbase+'pages/userinfo.html',
				usergrade: documentbase+'pages/usergrade.html',
				userscore: documentbase+'pages/userscore.html',
				resetpassword: documentbase+'pages/resetpassword.html',
				imgpicker: documentbase+'pages/imgpicker.html',
				icarousel: documentbase+'pages/icarousel.html',
				sellerinfo: documentbase+'pages/sellerinfo.html'
			},
			timestamp: function(){
			     if(arguments.length>0)
			    	 if(arguments[0] =='&')
			    		 return "&timestamp=" + (new Date()).getTime() ;
			     
			    return "?timestamp=" + (new Date()).getTime() ;
			}
	};
	
	window.session ={
			setCookie: function(c_name,value,expiredays)
			{
			        var exdate = new Date();
			        exdate.setDate(exdate.getDate()+expiredays);
			        document.cookie=c_name+"="+escape(value)+((expiredays==0)?"":";expires="+exdate.toGMTString());
			},
			getCookie: function(c_name)
			{
				if(document.cookie.length>0)
		        {
					c_start=document.cookie.indexOf(c_name+"=");
					if(c_start != -1)
					{
						c_start = c_start + c_name.length + 1;
						c_end = document.cookie.indexOf(";",c_start);
						if(c_end == -1)
							c_end = document.cookie.length;
							return unescape(document.cookie.substring(c_start,c_end));
						}
		        }
		        return undefined;  
			},
			listCookies: function()
			{
				 var strCookie=document.cookie;
		         var arrCookie=strCookie.split("; ");
		         return arrCookie;
			},
			deleteCookie: function(c_name) {
			    session.setCookie(c_name,"",-1);
			    location.reload();
			},
			currentUser:{
				userid: undefined,
				username: undefined,
				tel: undefined,
				role: undefined,
				restaurant_id: undefined
			},
			uploadFile : function(url , file , progressChange){
				var dtd = $.Deferred();
				var fd = new FormData();
    	        fd.append("file", file);
    	        var xhr = new XMLHttpRequest();
    			xhr.open("POST", url);
    			xhr.send(fd);
    			xhr.addEventListener('progress', function(e) {
    		        var done = e.position || e.loaded, total = e.totalSize || e.total;
    		        if(progressChange!=undefined){
    		        	progressChange(Math.floor(done/total*1000)/10);
    		        }
    		    }, false);
    		    
    			xhr.onreadystatechange = function(){
    				if(xhr.readyState===4){
    					if (xhr.status===200){
        					dtd.resolve(xhr.responseText);
        				}
        				else{
        					dtd.reject(xhr.status);
        				}
    				}
    			};
    			return dtd.promise();
			}
	};
	window.helper ={
			getLabelLength: function(text, fontsize)
			{
				var _hid = $('<span>').text(text).css('visibility','hidden');
				if(fontsize)
					_hid.css('font-size',fontsize);
				$('body').after(_hid);
				var _width = _hid.width();
				_hid.remove();
				return _width;
			}
	};
	$.fn.loadHtml = function(url){
		var df = $.Deferred();
		var that = $(this);  
		$.get(url,function(data){
			var dom = data.replace(/\{\{(.*)\}\}/g, function(e){
				var path = e.substring(2, e.length-2); 
				return eval(path);
			});
			that.html(dom);
			df.resolve();
		});
		return df;
	};
})(jQuery);