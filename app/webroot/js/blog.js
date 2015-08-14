$(document).ready(function(){
	    $("#header-bar").loadHtml(router.templates.header);
	    var _paramstart =document.location.href.indexOf('?')+1;
		var matchs = (new RegExp(/[1-9]\d*/)).exec(document.location.href.substring(_paramstart));
		if(matchs.length<=0 || isNaN(matchs[0]))
				return;
		var id = matchs[0];
		$.getJSON(router.blogs.view+id , function(data){
			 	var template = kendo.template($("#template").html());
			 	var d =data.Blog.Blog;
			 	d.labelarr = d.labels.split(',');
			 	var content =template(d);
			 	console.log(content);
			 	$("#article").html(content);
		});
});