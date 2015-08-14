(function($, undefined) {
	$.fn.dishComments = function(options) {
		var $this = $(this);
		$this.empty();
		var dishid = options.dishid;
		var div = $("<div>").addClass('remarkall');
		var ul = $("<ul>");
		div.append(ul);
		$this.append(div);
		$.getJSON(router.dishes.comments + dishid, function(data){
			for(var i=0; i<data.Comments.length; i++){
				var li = $('<li>').addClass('remark-row');
				var rankdiv =$("<div>").addClass('rating');
				li.append(rankdiv);
				ul.append(li);
				rankdiv.raty({
      			  readOnly : true,
    			  score    : Number(data.Comments[i].Comment.rank)
				});
				var fromlabel =$('<div>').addClass('remark-row-from');
				fromlabel.text('来自' + data.Comments[i].Comment.username+'的评价:');
				li.append(fromlabel);
				
				var contentlabel =$('<div>').addClass('remark-row-content');
				contentlabel.text(data.Comments[i].Comment.description);
				li.append(contentlabel);
			}
		});
	}
	$.fn.dishCommentsFooter = function(options){
		var $this = $(this);
		$this.empty();
		var div = $('<div>').addClass('modal-footer');
		var btnback = $('<a>').addClass('btn').addClass('btn-primary').text('返回菜单');
		div.append(btnback);
		btnback.click(function(){
			options.callback();
		});
		$this.append(div);
	} 
})(jQuery);