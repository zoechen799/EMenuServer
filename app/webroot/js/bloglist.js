$(document).ready(function(){
	    $("#header-bar").loadHtml(router.templates.header);
		var dataSource = new kendo.data.DataSource({
            transport: {
                read: function(options){
                	$.getJSON('/emenu/blogs/index', function(data) {
                		var displayData = [];
                		for(var i=0; i<data.Blogs.length; i++){
                			var row = data.Blogs[i].Blog;
                			row.labelarr = row.labels.split(',')
                			displayData.push(row);
                		}
                		options.success(displayData);
                	});
                }
            },
            pageSize: 15
        });
        $("#pager").kendoPager({
            dataSource: dataSource
        });
        
        $("#listView").kendoListView({
            dataSource: dataSource,
            selectable: "single",
            change: function(e){
            	var data = dataSource.view(),
                selected = $.map(this.select(), function(item) {
                    return data[$(item).index()].id;
                });
            },
            template: kendo.template($("#template").html())
        });
});