"use strict";
(function ($, undefined) {
	window.restaurant ={
			detailModel: kendo.observable({
				id: '',
				name: '',
				address: '',
				alias: '',
				description: '',
				region: '',
				category: '',
				time: '',
				workdaystart: '',
				workdayend: '',
				weekendstart: '',
				weekendend: '',
				telephone: [],
				introduction: [],
				dish_category: [],
				pictures: []
			}),
			getRestaurantInfo: function(id){
			    var dtd = new jQuery.Deferred();
			    var formatTime = function(time){
			    	if(time!=undefined && time.length>5)
			    		return time.substring(0,5);
			    	else
			    		return "";
			    };
			    
				$.getJSON(router.restaurants.view + id + router.timestamp(), function(data) {
					restaurant.detailModel.set('id', data.Restaurant.Restaurant.id);
            		restaurant.detailModel.set('name', data.Restaurant.Restaurant.name);
            		restaurant.detailModel.set('address', data.Restaurant.Restaurant.address);
            		restaurant.detailModel.set('alias', data.Restaurant.Restaurant.alias);
            		restaurant.detailModel.set('description', data.Restaurant.Restaurant.description);
            		restaurant.detailModel.set('workdaystart', formatTime(data.Restaurant.Restaurant_workinghour.workdaystart));
            		restaurant.detailModel.set('workdayend', formatTime(data.Restaurant.Restaurant_workinghour.workdayend));
            		restaurant.detailModel.set('weekendstart', formatTime(data.Restaurant.Restaurant_workinghour.weekendstart));
            		restaurant.detailModel.set('weekendend', formatTime(data.Restaurant.Restaurant_workinghour.weekendend));
            		restaurant.detailModel.set('time', restaurant.detailModel.workdaystart +' - '+ restaurant.detailModel.workdayend);
            		restaurant.detailModel.set('telephone', data.Restaurant.Restaurant_telephone);
            		restaurant.detailModel.set('introduction', data.Restaurant.Restaurant_introduction);
            		restaurant.detailModel.set('dish_category', data.Restaurant.Dish_category);
            		restaurant.detailModel.set('pictures', data.Restaurant.Restaurant_picture);
            		restaurant.detailModel.set('rating' , data.Restaurant.Restaurant.rating);
            		$.getJSON(router.restaurants.category + data.Restaurant.Restaurant.category_id + router.timestamp(), function(data){
            			restaurant.detailModel.set('category', data.Restaurant_category.Restaurant_category.name);
            		});
            		$.getJSON(router.regions.view + data.Restaurant.Restaurant.region_id + router.timestamp(), function(data){
            			restaurant.detailModel.set('region', data.Region.Region.name);
            		});
            		$('#rating').raty({
            			  readOnly : true,
            			  score    : Number(restaurant.detailModel.rating)
            		});
            		var logo_id =Number(data.Restaurant.Restaurant.logo_id);
            		if(logo_id == null)
            			logo_id =0;
            		if(data.Restaurant.Restaurant_picture.length > logo_id){
            			var imageurl =router.services.resize+ "?url=" +data.Restaurant.Restaurant_picture[logo_id].filepath +"&width=195&height=195";
            			$('.photo-wrapper img').attr('src' , imageurl);
            		}
            		dtd.resolve(data.Restaurant.Restaurant.name);
            	});
				return dtd.promise();
			},
			query:{
				restaruantID: -1,
				dishCategory:-1,
				serilize: function(){
                	var str = "/dish_pictures:n";
                	if(restaurant.query.restaruantID>0)
                		str += '/restaurant_id:'+restaurant.query.restaruantID;
                	if(restaurant.query.dishCategory>0)
                		str += '/category_id:'+restaurant.query.dishCategory;
                	return str +='/comments:3';
                }
			},
			orderModel: kendo.observable({
				totalQuantity: 0,
				totalPrice:0.0
			}),
			buildTabs:function(id){
				$("#tabstrip").kendoTabStrip({
                    animation: { open: { effects: "fadeIn"} },
                    dataTextField: "text",
                    dataContentField: "content",
                    dataSource: [
                        {
                            text: "菜单",
                            content: ""
                        },
                        {
                            text: "评价",
                            content:""
                        }
                    ],
                    select: function(e){
                    	if($(e.item).find('span').text() == "菜单"){
                    		restaurant.buildMenu('dish-template2');
                    	}else if($(e.item).find('span').text() == "评价"){
                    		restaurant.buildMenu('dish-template1');
                    	}
                    }
                }).data("kendoTabStrip").select(0);
			},
			onCommentSelected: function(e){
				var product = $(e.currentTarget);
	       		while(product.attr('data') == undefined){
	       			 product = product.parent();
	       		}
	       		var rating = $("#comments_dlg").find("#dish_rating").raty({
      			  readOnly : false,
    			  score    : 4
				});
				$("#comments_dlg").modal('show');
				$("#comments_dlg").find("#comments_save").click(function(){
					var remark = $("#comments_dlg").find("#dish_comments").val();
					var rank = rating.data().score;
					var formdata = {
							data : {
								Comment : {
									description: remark,
									rank: rank,
									entity: 'dish',
									entity_id: product.attr('data')
								}
							}
						};
					var _rawdata = "_method=POST&"+ $.param(formdata);
					$.when($.post(router.dishes.addcomment, _rawdata))
					.done(function(){
						$("#comments_dlg").modal('hide');
					});
				});
			},
			onCommentAll: function(e){
				var product = $(e.currentTarget);
	       		while(product.attr('data') == undefined){
	       			 product = product.parent();
	       		}
				$('#menu_container').off("click");
				$('#menu_container').empty();
				$('#menu_container').dishComments({dishid:product.attr('data')});
				$('#menu_pager').dishCommentsFooter({callback:function(){
					restaurant.buildMenu('dish-template1');
				}});
			},
			getDishCategory: function(restaurantid){
				$.getJSON(router.dishes.listcategory + restaurantid +router.timestamp(), function(data) {
					  var items = [];
					  for(var i=0; i<data.Dish_categories.length; i++){
						var category = data.Dish_categories[i].Dish_category;
					    items.push('<li id="' + category.id + '"><a href="#">' + category.name + '</a></li>');
					  }
					  $('#dish_category').append(items.join(''));
					  $( "#dish_category" ).kendoMenu({select:function(e){
						  var _catrgoryid = $(e.item).attr('id');
						  alert(_catrgoryid);
					  }});
					 
				});
			},
			buildMenu: function(tempelateid){
				$('#menu_pager').empty();
				 var ds = new kendo.data.DataSource({
	                    transport: {
	                    	read: function(options) {
	                            $.ajax( {
	                                url: router.dishes.index + restaurant.query.serilize() + router.timestamp(),
	                                success: function(result) {
	                                    options.success(result.Dishes);
	                                }
	                            });
	                        }
	                    },
	                    pageSize: 9,
	                    requestEnd: function(e) {
	                    	restaurant.buildOrder();
	                    	$('#menu_container').on("click", ".product", function(e) {
	                    		 var product = $(e.currentTarget);
	                    		 while(product.attr('data') == undefined){
	                    			 product = product.parent();
	                    		 }
	                    		 var timestamp = product.attr('timestamp');
	                    		 if(timestamp == undefined)
	                    			 product.attr('timestamp',(new Date()).valueOf());
	                    		 else{
	                    			 var t =(new Date()).valueOf() -timestamp;
	                    			 product.attr('timestamp',(new Date()).valueOf());
	                    			 if(t>0 && t<100)
	                    				 return;
	                    		 }
	                    		 var iconId =$(e.target).attr('id');
	                    		 if(iconId == 'dishInfo'){
	                    			 var _dishid = product.attr('data');
	                    			 var opts ={
	                 						imgs: []
	                 				 };
	                 				 for(var i=0; i<ds.data().length; i++){
	                    				 if(ds.data()[i].Dish.id == _dishid){
	                    					 restaurant._detailData.all =ds.data()[i].Dish;
	                            			 restaurant._detailData.pictures =ds.data()[i].Dish_picture;
	                            			 for(var j=0; j<ds.data()[i].Dish_picture.length; j++){
	                            				 opts.imgs[j] = ds.data()[i].Dish_picture[j].filepath;
	                            			 }
	                            			 opts.description = ds.data()[i].Dish.description;
	                            			 break;
	                    				 }
	                    			 }
	                 				 $("#dishinfo_dlg").find("#dish_imgs").icarousel(opts);
	                 				 $("#dishinfo_dlg").find("#dish_intro span").text(opts.description);
	                 				 $("#dishinfo_dlg").modal('show');
	                    		 }else if(iconId =='addDish'){
	                    			 var _animatedDish = $('<div>');
	                                 _animatedDish.addClass('animateddish').text(product.attr('name'));
	                                 var q = product.offset();
	                                 var s =$('#container').offset();
	                                 _animatedDish.offset(q);
	                                 _animatedDish.appendTo('#maincontent').animate({
	                                    	 left : s.left + 20 + "px",
	         								 top : s.top + 20 + "px",
	         								 opacity : 1
	                                	  }, 800, function() {
	                                		  _animatedDish.fadeOut(1000, function() {
	                                			  _animatedDish.remove();
	                                			  var dishid = product.attr('data');
	                                			  $.when(restaurant.addDishToOrder(dishid))
	                                			  .done(function(){
	                                				  restaurant.updateOrder();
	                                			  });
	                                		  });
	                                	  });
	                    		 }
	                    	});
	                    }
	             });
				
				$('#menu_pager').kendoPager({
                    dataSource: ds
                });
            	$('#menu_container').kendoListView({
	                dataSource: ds,
	                selectable: "single",
	                template: kendo.template($("#"+tempelateid).html())
	            });
            	$("#menu_container").off('click',".newcomment",restaurant.onCommentSelected);
            	$("#menu_container").on('click',".newcomment",restaurant.onCommentSelected);
            	$("#menu_container").off('click',".allcomment",restaurant.onCommentAll);
            	$("#menu_container").on('click',".allcomment",restaurant.onCommentAll);
			},
			orderDataSource:function(){
				var _cookieOrder = session.getCookie('order');
				if(_cookieOrder == undefined ||_cookieOrder==""){
					return [];
				}else{
					var cookieOrderObj = JSON.parse(_cookieOrder);
					return cookieOrderObj;
				}
			},
			buildOrder: function(){
				$("#grid").find('.k-grid-content').remove();
				$("#grid").kendoGrid({
					dataSource: {
                        data: restaurant.orderDataSource(),
                        pageSize: 50
                    },
                    scrollable: {
                        virtual: true
                    },
                    height: 525,
                    columns: [
                        { field:'id', hidden:true},
                        { field: "name", title: "菜品",width:"100px"},
                        { field: "quantity", title: "份数", width: "60px" },
                        { command:[ {name:"create",text:''},{name:"destroy", text:''}], title: "&nbsp;", width: "40px", data:'id'},
                        { field: "price", title:"单价", width: "50px" }]
                });
				kendo.bind($("#container"), restaurant.orderModel);
				restaurant.updateOrder();
				$('#emptyorder').click(function(){
					session.deleteCookie("order");
				});
				$('#submitorder').click(function(){
					router.gotoView("order" , restaurant.detailModel.id);
				})
			},
			updateOrder: function(){
				var ordergrid = $("#grid").data("kendoGrid");
				var odata =restaurant.orderDataSource();
  			  	if(ordergrid){
  			  		ordergrid.dataSource.data(odata);
  			  		ordergrid.refresh();	
  			  	}
  			    $('#grid .k-grid-add').off('click');
  			    $('#grid .k-grid-delete').off('click');
  			    $('#grid .k-grid-add').on('click',function(e){
					var foodId = $(this.parentElement.parentElement.children[0]).text();
					$.when(restaurant.addDishToOrder(foodId))
					.done(function(){
						restaurant.updateOrder();
					});
				});
				$('#grid .k-grid-delete').click(function(e){
					var foodId = $(this.parentElement.parentElement.children[0]).text();
					restaurant.removeDishFromOrder(foodId);
					restaurant.updateOrder();
				});
  			  	var _totalPrice =0.0, _totalQuantity =0;
  			  	for(var i=0; i<odata.length; i++){
  			  		_totalQuantity +=odata[i].quantity;
  			  		_totalPrice += odata[i].price * odata[i].quantity;
  			  	}
  			  	restaurant.orderModel.set('totalQuantity', _totalQuantity);
  			  	restaurant.orderModel.set('totalPrice', _totalPrice);
			},
			//Async
			addDishToOrder: function(dishid) 
			{
				//因为grid 的 datasource只是一个page的数据，
				//因此必须根据dishid去后台取回dish的price等信息并存入cookie
				var dtd = $.Deferred();
				$.getJSON(router.dishes.view + dishid, function(data) {
					var _dishname = data.Dish.name;
					var _price = data.Dish.price;
					var _cookieOrder = session.getCookie('order');
					if(_cookieOrder == undefined ||_cookieOrder==""){
						var cookieOrderObj = [{"id": dishid, "quantity": 1, "name":_dishname, "price":_price}];
						_cookieOrder = JSON.stringify(cookieOrderObj);
						session.setCookie('order', _cookieOrder);
					}else{
						var cookieOrderObj = JSON.parse(_cookieOrder);
						for(var i=0; i<cookieOrderObj.length; i++){
							if(cookieOrderObj[i].id == dishid){
								cookieOrderObj[i].quantity +=1; 
								_cookieOrder = JSON.stringify(cookieOrderObj);
								session.setCookie('order', _cookieOrder);
								dtd.resolve();
								return dtd;
							}
						}
						cookieOrderObj.push({"id":dishid,"quantity":1, "name":_dishname, "price":_price});
						_cookieOrder = JSON.stringify(cookieOrderObj);
						session.setCookie('order', _cookieOrder);
					}
					dtd.resolve();
				});
				return dtd;
			},
			removeDishFromOrder:function(dishid){
				var _cookieOrder = session.getCookie('order');
				if(_cookieOrder!=undefined && _cookieOrder!=""){
					var cookieOrderObj = JSON.parse(_cookieOrder);
					for(var i=0; i<cookieOrderObj.length; i++){
						if(cookieOrderObj[i].id == dishid){
							if(cookieOrderObj[i].quantity >1)
								cookieOrderObj[i].quantity -=1; 
							else
								cookieOrderObj.splice(i,1);
							_cookieOrder = JSON.stringify(cookieOrderObj);
							session.setCookie('order', _cookieOrder);
							return;
						}
					}
				}
			},
			_detailData:{
				all: undefined,
				pictures: undefined
			},
			loadMap: function(rid,rname)
			{
				window.map.loadMap(rid,rname);
			}
	}
})(jQuery);
$(document).ready(function(){
	
	var _paramstart =document.location.href.indexOf('?')+1;
	var matchs = (new RegExp(/[1-9]\d*/)).exec(document.location.href.substring(_paramstart));
	if(matchs.length<=0 || isNaN(matchs[0]))
			return;
	var id = matchs[0];
	restaurant.query.restaruantID = id;
	restaurant.buildTabs();
	restaurant.buildMenu('dish-template2');
	restaurant.getDishCategory(id);
	kendo.bind($(".restaurant_desc"), restaurant.detailModel);
	
	kendo.bind($("#navigationbar"), restaurant.detailModel);
	restaurant.getRestaurantInfo(id).done(function(name){
		restaurant.loadMap(id, name);
	});
	$("#header-bar").loadHtml(router.templates.header);
});