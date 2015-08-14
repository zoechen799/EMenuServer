(function($, undefined) {
	$.fn.icarousel = function(options) {
		var $this = $(this);
		$this.find('#prev').off('click');
		$this.find('#next').off('click');
		$this.empty();
		$.when($this.loadHtml(router.templates.icarousel))
		.done(function(){
			for(var i=0; i<options.imgs.length; i++){
				var li = $("<li>");
				var div = $("<div>");
				div.append("<img src='"+ options.imgs[i] +"' width=400 height=300'>");
				li.append(div);
				$this.find("#thelist").append(li);
				var indicator = $("<li>");
				indicator.text(i);
				if(i==0)
					indicator.addClass("active");
				$this.find("#indicator").append(indicator);
			}
			var myScroll = new iScroll($this.find('#wrapper')[0], {
				snap: true,
				momentum: false,
				hScrollbar: false,
				onScrollEnd: function () {
					document.querySelector('#indicator > li.active').className = '';
					document.querySelector('#indicator > li:nth-child(' + (this.currPageX+1) + ')').className = 'active';
				}
			 });
			$this.find("#prev").click(function(){
				myScroll.scrollToPage('prev', 0);
			});
			$this.find("#next").click(function(){
				myScroll.scrollToPage('next', 0);
			});
		});
	}
})(jQuery);