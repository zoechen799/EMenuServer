(function($, undefined) {
	$.fn.dishCategory = function(options) {
		var $this = $(this);
		$this.empty();
		var restaurant_id = session.currentUser.restaurant_id;
		var grid = $('<div>');
		$this.append(grid);
		var catds = new kendo.data.DataSource({
           	 transport: {
           		 read: function(options){
           			 $.getJSON(router.dishes.listcategory +restaurant_id,function(data){
           				 options.success(data)
           			 });
           		 },
	             update: function(options){
	            	 delete options.data.photo;
	            	 var formdata = {
             	            data: {
             	            	Dish_category: options.data
             	            } 
             	        };
	             	 var _rawdata = "_method=POST&" + $.param(formdata);
	             	 $.post(router.dishes.editcategory + options.data.id , _rawdata)
	             	 .complete(function(){
	             		var gridcontrol = grid.data("kendoGrid");
	             		gridcontrol.dataSource.read();
	             		gridcontrol.refresh();
	             	 });
	             },
                 destroy: function(options){
                	 $.post(router.dishes.remove + options.data.id)
                	 .done(function(){
                		 grid.data("kendoGrid").refresh();
                	 })
                	 .fail(function(){
                		 grid.data("kendoGrid").refresh();
                	 })
                 },
                 create: function(options){
                	 options.data.restaurant_id= restaurant_id;
                	 var formdata = {
                	            data: options.data
                	        };
                	 var _rawdata = "_method=POST&" + $.param(formdata);
                	 $.post(router.dishes.addcategory , _rawdata)
                	 .done(function(){
                		 grid.data("kendoGrid").refresh();
                	 })
                	 .fail(function(){
                		 grid.data("kendoGrid").refresh();
                	 })
                 }
           	 },
           	 pageSize: 10,
           	 schema:{
           		 model:{
           			id: "id",
           			fields: {
                        id: { editable: false, nullable: true },
                        name: { editable: true }
                    }
           		 },
           		 parse: function(response){
           			 var data = [];
          			 for(var i=0; i<response.Dish_categories.length; i++){
          				 data[i] = response.Dish_categories[i].Dish_category;
          			 }
          			 return data;
           		 }
           	 }
        }); 
		
		grid.kendoGrid({
            dataSource: catds,
            sortable: true,
            selectable: "single",
            pageable: {
            	
            },
            toolbar: ["create"],
            height: 595,
            columns: 
            	[
					{ field: "id",title: "类别序号", width:"100px"},
					{ field: "name", title: "类别名称",width:"300px"},
					{ command: ["edit", "destroy"], title: "编辑", width: "180px" }
			 ],
			 editable: "inline"
        });

	}
})(jQuery);