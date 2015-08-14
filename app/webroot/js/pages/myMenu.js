(function($, undefined) {
	$.fn.menugrid = function(options) {
		var $this = $(this);
		$this.empty();
		var restaurant_id = session.currentUser.restaurant_id;
		var grid = $('<div>');
		$this.append(grid);
		var menuds = new kendo.data.DataSource({
           	 transport: {
           		 read: function(options){
           			 $.getJSON(router.dishes.index+'/dish_pictures:1/restaurant_id:'+restaurant_id,function(data){
           				 options.success(data)
           			 });
           		 },
	             update: function(options){
	            	 delete options.data.photo;
	            	 var formdata = {
             	            data: {
             	                Dish: options.data
             	            } 
             	        };
	             	 var _rawdata = "_method=POST&" + $.param(formdata);
	             	 $.post(router.dishes.edit + options.data.id , _rawdata)
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
                	 var formdata = {
                	            data: options.data
                	        };
                	 var _rawdata = "_method=POST&" + $.param(formdata);
                	 $.post(router.dishes.add , _rawdata)
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
                        name: { validation: { required: true } },
                        img: {type:"function", editable: false},
                        price: { type: "number", validation: { required: true, min: 1} },
                        category_id: { validation: { required: true } },
                        description: { validation: { required: true } }
                    }
           		 },
           		 parse: function(response){
           			 var data = [];
           			 for(var i=0; i<response.Dishes.length; i++){
           				 data[i] = response.Dishes[i].Dish;
           				 data[i].photo = router.services.resize + '?url='+data[i].photo +'&width=160';
           			 }
           			 return data;
           		 }
           	 }
        }); 
		
		grid.kendoGrid({
            dataSource: menuds,
            sortable: true,
            selectable: "single",
            pageable: {
            	
            },
            toolbar: ["create"],
            height: 595,
            columns: 
            	[
					{ field: "id", hidden:true},
					{ field: "img" ,title: "图片", width:"200px", template: function(row){return '<div><img class="dish-image" src="'+ row.photo+'"><button class="btn btn-info addimg" style="visibility: hidden;" type="button"><i class="icon-plus"></i></button></div>'; } },
					{ field: "name", title: "菜名",width:"200px"},
					{ field: "price", title: "价格", width: "70px"},
					{ field: "category_id", title:"分类", width: "100px"},
					{ field: "description", title:"简介", width: "200px" },
					{ command: ["edit", "destroy"], title: "编辑", width: "180px" }
			 ],
			 editable: "inline"
        });
		grid.data("kendoGrid").bind("edit", function(e) {
			var dishid = e.model.id;
			var rowheight = $(e.container[0]).height();
			var dishimage = $(e.container[0]).find(".dish-image");
			var parent = $(e.container[0]).parent();
			var left = (dishimage.position().left + (dishimage.width()-36)/2) +'px';
			var top = (dishimage.position().top -parent.position().top + (rowheight-27)/2 )+'px';
			var addbtn = $(e.container[0]).find(".addimg");
			$(".addimg").css('visibility','hidden');
			addbtn.css('visibility','visible').css('top' , top).css('left', left);
			addbtn.click(function(){
				var dialog = $('<div>');
				$this.append(dialog);
				$.when(loadScript('js/pages/imgpicker.js'))
				.done(function(){
					dialog.imgpicker({
						title: localization.dish.photo_upload_title ,
						url: router.dishes.uploadphoto + dishid,
						callback:function(url){
							grid.data("kendoGrid").refresh();
						}
					});
				});
			})
		});
		grid.data("kendoGrid").bind("cancel", function(e) {
		    $(".addimg").css('visibility','hidden');
		});
	}
})(jQuery);