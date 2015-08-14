"use strict";
(function ($, undefined) {
	window.emenu = {
			query: {
				page: 1,
                pageSize: 3,
                sort: {
                    field: '',
                    dir: ''
                },
                filter:{
                	city: '',
                	region:'',
                	community:'',
                	category:''
                },
                search:'',
                urlComponent: function(name,value)
                {
                	if(value!=undefined && ((value!=undefined && value!="" && !isNaN(value)) || value.length>0))
                		return '/'+name+':'+value;
                	else
                		return '';
                },
                serilize: function(){
                	var str = emenu.query.urlComponent('page',emenu.query.page) +
                	emenu.query.urlComponent('pageSize',emenu.query.pageSize)+
                	emenu.query.urlComponent('sort',emenu.query.sort.field)+
                	emenu.query.urlComponent('direction',emenu.query.sort.dir)+
                	emenu.query.urlComponent('Restaurant.city_id',emenu.query.filter.city)+
                	emenu.query.urlComponent('Restaurant.region_id',emenu.query.filter.region)+
                	emenu.query.urlComponent('Restaurant.community_id',emenu.query.filter.community)+
                	emenu.query.urlComponent('Restaurant.category_id',emenu.query.filter.category)+
                	emenu.query.urlComponent('search',encodeURIComponent(emenu.query.search));
                	return str;
                }
			},
		
			init: function(){
				$("#tabstrip-filters").kendoTabStrip({
                    animation: { open: { effects: "fadeIn"} },
                    dataTextField: "text",
                    dataImageUrlField: "imageUrl",
                    dataContentField: "content",
                    dataSource: [
                        {
                            text: localization.portal.ranksort,
                            imageUrl: "img/sortdown.png",
                            content: ""
                        },
                        {
                            text: localization.portal.ppRatio,
                            imageUrl: "img/sortdown.png",
                            content:""
                        },
                        {
                            text: localization.portal.special,
                            imageUrl: "img/sortdown.png",
                            content: ""
                        },
                        {
                            text: localization.portal.environment,
                            imageUrl: "img/sortdown.png",
                            content: ""
                        }
                    ]
                }).data("kendoTabStrip").select(0);
			},
			changeCity: function(id){
				emenu.query.filter.city = id; 
			},
			KeyFocus: function(key) {
				if (key.value == key.defaultValue) {
					key.value = '';
				}
			},
		    KeyBlur: function(key) {
				if (key.value == '') key.value = key.defaultValue;
			},
			getRegionMenu: function(){
				$.getJSON(router.regions.index + router.timestamp(), function(data) {
					  var items = [];
					  items.push('<li id="all"><a href="#">'+localization.portal.allregion+'</a></li>');
					  for(var i=0; i<data.Regions.length; i++){
						var region = data.Regions[i].Region;
					    items.push('<li id="' + region.id + '"><a href="#">' + region.name + '</a></li>');
					  }
					  $('#regionmenu').append(items.join(''));
					  $( "#regionmenu" ).kendoMenu({select:function(e){
						  var _regionid = $(e.item).attr('id');
						  if(_regionid =='all'){
							  emenu.query.filter.region =undefined;
						  }else{
							  emenu.query.filter.region = _regionid;
						  }
						  $( "#regionmenu" ).find('li').removeClass('regionSel');
						  $(e.item).addClass('regionSel');
						  var rname = $(e.item).find('a').text();
						  auth.setBreadCrumb([{text:'上海首页',link:'emenu.query.filter.region =undefined; emenu.getRestaurantList();'},
						                      {text:rname,link:'void0'}]);
						  emenu.getRestaurantList();
					  }});
					  $( "#regionmenu" ).find("#all").addClass('regionSel');
				});
			},
			_dataSource : undefined,
			getRestaurantList: function(){
				var settings ={page:emenu.query.page, pageSize:emenu.query.pageSize};
				if(emenu._dataSource == undefined){
					emenu._dataSource = new kendo.data.DataSource({
	                    transport: {
	                        read: {
	                        	url: function(options){
	                        		return router.restaurants.query + emenu.query.serilize() + router.timestamp()
	                        	}
	                        }
	                    },
	                    schema: {
	                    	data: function(response){
	                    		var displayData = [];
	                    		for(var i=0; i<response.Restaurants.length; i++){
	                    			var row = response.Restaurants[i].Restaurant;
	                    			if(response.Restaurants[i].Restaurant_workinghour.workdaystart)
	                    				row.workdaystart = response.Restaurants[i].Restaurant_workinghour.workdaystart.substring(0,5);
	                    			if(response.Restaurants[i].Restaurant_workinghour.workdayend)
	                    				row.workdayend = response.Restaurants[i].Restaurant_workinghour.workdayend.substring(0,5);
	                    			if(response.Restaurants[i].Restaurant.logo_url!=undefined && response.Restaurants[i].Restaurant.logo_url.length>0)
	                    			{
	                    				row.logourl = response.Restaurants[i].Restaurant.logo_url;
	                    			}else{
	                    				row.logourl = router.images.nonerestaurant
	                    			}
	                    			row.rating= response.Restaurants[i].Restaurant.rating;
	                    			row.link="javascript:router.gotoView('restaurant',"+response.Restaurants[i].Restaurant.id+")";
	                    			displayData.push(row);
	                    		}
	                    		return displayData;
	                    	},
	                        total: function(response){
	                        	settings =$.extend(settings,JSON.parse(response.Current));
	                        	return settings.total;
	                        }
	                    },
	                    serverPaging:true,
	                    serverAggregates: false,
	                    page:settings.page,
	                    pageSize:settings.pageSize,
	                    change: function(){
	                    	$("#listView").kendoListView({
	        	                dataSource: {
	        	                	data: emenu._dataSource.data()
	        	                },
	        	                selectable: "single",
	        	                change: function(e){
	        	                	var data = emenu._dataSource.view(),
	        	                    selected = $.map(this.select(), function(item) {
	        	                        var _restaurantid = data[$(item).index()].id;
	        	                        router.gotoView('restaurant',_restaurantid);
	        	                    });
	        	                },
	        	                template: kendo.template($("#restaurant-template").html())
	        	            });
	                    	$('.rowrating').each(function(index, element){ 
	                    		var score = Number($(element).attr('value'));
	                    		$(element).raty({
	                    			  readOnly : true,
	                    			  score    : score
	                    		});
	                    	});
	                    }
	                });
					$("#pager").kendoPager({
     	                dataSource: emenu._dataSource,
     	                messages: {
     	                    display: "{0} - {1},共{2}个",
     	                    empty: "",
     	                    page: "页"
     	                },
     	                change:function(e){
     	                	emenu.query.page = Number(e.index);
     	                	emenu.getRestaurantList();
     	                }
     	            });
				}
				emenu._dataSource.read();
				
			},
			
			getArticleList: function(){
				var dataSource = new kendo.data.DataSource({
                    transport: {
                        read: function(options){
                        	$.getJSON(router.blogs.index + router.timestamp(), function(data) {
                        		options.success(data.Blogs);
                        	});
                        }
                    },
                    pageSize: 15
                });
				$("#articleList").kendoListView({
	                dataSource: dataSource,
	                selectable: "single",
	                change: function(e){
	                	var data = dataSource.view();
	                    var index =$(this.select()).index();
	                },
	                template: kendo.template($("#article-template").html())
	            });
			},
			displayCategories: function(){
				$.getJSON(router.restaurants.categories + router.timestamp(), function(data) {
					  var panel = $('#restaurant_category');
					  var columns = 8;
					  for(var row=0; row< Math.ceil(data.Restaurant_categorys.length) ;row++){
						  var tr = $('<tr>');
						  for(var col =0; col<columns && col+row*columns <data.Restaurant_categorys.length ; col++){
							  var td =$('<td>').css('width' ,'250px').css('padding-bottom','3px');
							  var itemlink = $('<a>').attr('href','javascript:void(0)')
							  .text(data.Restaurant_categorys[col+row*columns].Restaurant_category.name)
							  .attr('key',data.Restaurant_categorys[col+row*columns].Restaurant_category.id);
							  
							  td.append(itemlink);
							  itemlink.click(function(e){
									 var categoryid =  $(e.target.parentElement).attr('key');
									 emenu.query.filter.category = categoryid;
							  });
							  tr.append(td);
						  }
						  panel.append(tr);
					  }
					  
				});
			}
	};
})(jQuery);

$(document).ready(function(){
	emenu.init();
	emenu.getRegionMenu();
	emenu.getRestaurantList();
	emenu.getArticleList();
	emenu.displayCategories();
	$(document.body).click(function () {
		$('#CityList').hide();
	});
	$.when($("#header-bar").loadHtml(router.templates.header))
	.done(function(){
		//auth.setBreadCrumb([{text:'上海首页' , link:'void(0)'}]);
		// When Search button is pressed
		$("#btn-search").click(function(){
			emenu.query.search = $('#text-search').val();
			emenu.getRestaurantList();
		});
	});
});