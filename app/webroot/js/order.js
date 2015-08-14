(function ($, undefined) {
	Date.prototype.format = function(format)
	{
	 var o = {
	 "M+" : this.getMonth()+1, //month
	 "d+" : this.getDate(),    //day
	 "h+" : this.getHours(),   //hour
	 "m+" : this.getMinutes(), //minute
	 "s+" : this.getSeconds(), //second
	 "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
	 "S" : this.getMilliseconds() //millisecond
	 }
	 if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
	 (this.getFullYear()+"").substr(4 - RegExp.$1.length));
	 for(var k in o)if(new RegExp("("+ k +")").test(format))
	 format = format.replace(RegExp.$1,
	 RegExp.$1.length==1 ? o[k] :
	 ("00"+ o[k]).substr((""+ o[k]).length));
	 return format;
	}
	
	window.order ={
			loadOrder: function(){
				$("#grid").kendoGrid({
					dataSource: {
                        data: order.orderDataSource(),
                        pageSize: 50
                    },
                    scrollable: {
                        virtual: true
                    },
                    height: 560,
                    columns: [
                        { field:'id', hidden:true},
                        { field: "name", title: "菜品",width:"130px"},
                        { field: "quantity", title: "份数", width: "60px" },
                        { command:[ {name:"create",text:''},{name:"destroy", text:''}], title: "&nbsp;", width: "40px", data:'id'},
                        { field: "price", title:"单价", width: "50px" }],
                    change: function(){
                    	$("#totalquanty-span").text(_totalQuantity);
          			  	$("#totalprice-span").text(_totalPrice);
                    }
                });
				var _totalPrice =0.0, _totalQuantity =0;
				var odata =order.orderDataSource();
  			  	for(var i=0; i<odata.length; i++){
  			  		_totalQuantity +=odata[i].quantity;
  			  		_totalPrice += odata[i].price * odata[i].quantity;
  			  	}
  			  	$("#totalquanty-span").text(_totalQuantity);
  			  	$("#totalprice-span").text(_totalPrice);
  			  	order.totalPrice = _totalPrice;
  			  	order.totalQuantity = _totalQuantity;
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
			orderDate: undefined,
			orderTime: undefined,
			orderMembers: undefined,
			restaurantId: undefined,
			totalPrice: undefined,
			totalQuantity: undefined,
			submitOrder: function(){
				var formdata={
						  data:{
							  Order:{
								  restaurant_id: order.restaurantId,
								  plandate: order.orderDate.format("yyyy-MM-dd ") + order.orderTime,
								  quantity: order.totalQuantity,
								  amount: order.totalPrice,
								  status: "new",
								  members: order.orderMembers
							  },
							  detail:[]
							} 
				  };
				   
			      var arr, _cookieOrder = session.getCookie('order');
				  if(_cookieOrder == undefined ||_cookieOrder==""){
					arr = [];
				  }else{
					arr= JSON.parse(_cookieOrder);
				  }
				  formdata.data.detail =[];
				  for(var i=0; i< arr.length; i++){
					  formdata.data.detail.push({
						  dish_id: arr[i].id,
						  quantity: arr[i].quantity
					  });
				  }
				  var _rawdata = "_method=POST&" + $.param(formdata) 
				  $.ajax({
					  type: "POST",
					  url: router.orders.add,
					  data: _rawdata,
					  success: function(d){
						  session.deleteCookie("order");
						  router.gotoView("ordersucceed",d.result.id);
					  },
					  dataType: 'json'
				  });
			}
	}
})(jQuery);

$(document).ready(function(){
	var _paramstart =document.location.href.indexOf('?')+1;
	var matchs = (new RegExp(/[1-9]\d*/)).exec(document.location.href.substring(_paramstart));
	if(matchs.length<=0 || isNaN(matchs[0]))
			return;
	var id = matchs[0];
	order.restaurantId = id;
	$("#header-bar").loadHtml(router.templates.header);
	order.loadOrder();
	$.getJSON(router.restaurants.view + id, function(data) {
		$("#orderat").text("您在"+data.Restaurant.Restaurant.name+"的订单内容有");
	});
	var today = new Date();
	$("#calendar").kendoCalendar({
         value: today,
         change: function(e) {
        	 order.orderDate = e.sender.value();
        	 setDate();
         }
    });
	$("#ordertime").kendoComboBox();
	$("#membercount").kendoComboBox();
	var scheTime = $("#ordertime").data("kendoComboBox");
	scheTime.bind("change", function(e) {
		order.orderTime = e.sender.value();
		setDate();
	});
	order.orderMembers = $("#membercount").data("kendoComboBox").value();
	order.orderDate = $("#calendar").data("kendoCalendar").value();
	order.orderTime =$("#ordertime").data("kendoComboBox").value();
	var setDate = function(){
		$("#dinner-date").text(order.orderDate.getFullYear()+"年"+(order.orderDate.getMonth()+1)+"月"+order.orderDate.getDate()+"日 "+order.orderTime);
	}
	setDate();
	$("#commitorder").click(function(e){
		order.submitOrder();
	});
});