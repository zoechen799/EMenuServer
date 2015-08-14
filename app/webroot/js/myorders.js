(function($, undefined) {
	$.fn.listOrders = function(options) {
		var $this = $(this);
		$this.empty();
		var orderStatus = '';
		if(options!=null && options.status!= null){
			for(var i=0; i<options.status.length; i++){
				orderStatus +='/status:'+ options.status[i];
			}
		}
		$.getJSON(router.orders.index +orderStatus+ router.timestamp(), function(data){
			var grid = $('<div>').addClass('order-grid');
			$this.append(grid);
			var role =session.currentUser.role;
			grid.kendoGrid({
	             dataSource: {
	                 data: data.orders,
	                 pageSize: 10
	             },
	             sortable: true,
	             selectable: "single",
	             change: function(e){
	            	 var orderid = this.select().children().first().text();
	            	 $this.showOrderInfo({orderid: orderid});
	             },
	             pageable: {
	                 
	             },
	             height: 595,
	             columns: 
	        	 [
						{ field:'Order.id', hidden:true},
						{ field: "Order.restaurant_name", title: "餐馆",width:"100px" , hidden: (role == 'seller')},
						{ field: "Order.user_name", title: "客户",width:"100px", hidden: (role == 'user')},
						{ field: "Order.quantity", title: "菜品数量",width:"65px"},
						{ field: "Order.amount", title: "总金额", width: "60px", template: '#= "￥"+ Order.amount #'},
						{ field: "Order.createtime", title:"下单日期", width: "170px"},
						{ field: "Order.plandate", title:"预约日期", width: "170px" },
						{ field: "Order.status", title:"订单状态", width: "70px", template: '#= localization.order["status_"+Order.status] #'},
						{ field: "Order.members", title:"就餐人数", width: "65px" }
				 ]
	         });
		});
	}
	$.fn.showOrderInfo = function(options) {
		var $this = $(this);
		$this.empty();
		$.when($this.loadHtml(router.templates.orderdetail))
		.done(function(){
			$.getJSON(router.orders.view + options.orderid + router.timestamp(), function(data){
				var detail = kendo.observable({
					restaurant_name : data.Order.Order.restaurant_name,
					restaurant_address : data.Order.Order.restaurant_address,
					order_user_name: session.currentUser.username,
					order_user_tel: (data.Order.Order.contact_tel !=null ? data.Order.Order.contact_tel : session.currentUser.tel),
					order_status: localization.order['status_'+data.Order.Order.status],
					order_user_gender: localization.order['gender_'+session.currentUser.gender],
					dinner_time: data.Order.Order.plandate,
					dinner_members: data.Order.Order.members,
					dinner_quantity: data.Order.Order.quantity,
					dinner_amount: data.Order.Order.amount
				});
				kendo.bind($this.find('form'), detail);
				$(".form-list").kendoListView({
	                dataSource: {
	                	data: data.Order.detail
	                	},
	                template: kendo.template($("#order-item-template").html())
	            });
			});
			if(session.currentUser.role == 'user')
			$('#process').hide();
			$this.find('#save_status').click(function(){
				var _status =$this.find('#process_status').val();
				var formdata={
						  data:{
							  Order:{
								  status: _status
							  }
							} 
				  };
				 var _rawdata = "_method=POST&" + $.param(formdata) 
				  $.ajax({
					  type: "POST",
					  url: router.orders.edit +options.orderid,
					  data: _rawdata,
					  success: function(d){
						  alert('订单更新成功');
					  },
					  dataType: 'json'
				  });
			});
		});
	}
})(jQuery);