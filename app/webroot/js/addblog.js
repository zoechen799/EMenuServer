$(document).ready(function(){
	  $("#header-bar").loadHtml(router.templates.header);
	  kendo.culture("zh-CHS");
	  $("#editor").kendoEditor();
	  
	  $("#confirm" ).kendoWindow({
          width: "600px",
          height:"190px",
          draggable:false,
          visible: false,
          modal:true
      });
	  $("#confirm").data("kendoWindow").center();
	  $('#submit').click(function(){
		  var editor = $("#editor").data("kendoEditor");
		  var _content = editor.value();
		  var _title = $('#articleTitle').val();
		  var _labels = $('#labels').val();
		  var formdata={
				  data:{
					  Blog:{
						  name: _title,
						  body: _content,
						  labels: _labels
					  }
					} 
		  };
		  var _rawdata = "_method=POST&" + $.param(formdata) 
		  $.ajax({
			  type: 'POST',
			  url:  router.blogs.add,
			  data: _rawdata,
			  complete: function(msg) { 
				 if(msg.status >=200 && msg.status<=306){
					 var blog_id =JSON.parse(msg.responseText).Blog.Blog.id;
					 $("#confirm" ).data("kendoWindow").open();
					 $('#gotoview').click(function(){
						 router.gotoView('bloglist');
					 })
				 }else{
					 alert("博文发布失败");
				 }
			  }
			});
	  });
});