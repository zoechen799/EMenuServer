(function($, undefined) {
	$.fn.imgpicker = function(options) {
		var $this = $(this);
		$this.empty();
		$.when($this.loadHtml(router.templates.imgpicker))
		.done(function(){
			if(options.hasOwnProperty('title')){
				$this.find('#myModalLabel').text(options.title);
			}
			var uploadurl = "";
			if(options.hasOwnProperty('url'))
				uploadurl = options.url;
			
			$this.find('#img-picker').modal('show');
			$this.find('#uploadphoto').click(function(){
				var file = $('#fileupload')[0].files[0];
				var total = file.size;
				if(file!=null && (file.type=='image/jpeg' || file.type=='image/png' || file.type=='image/gif')){
					$.when(session.uploadFile(uploadurl , file, function(done){
						console.log('xhr progress: ' + (Math.floor(done/total*1000)/10) + '%');
					}))
					.done(function(url){
						$this.modal('hide');
						if(options.hasOwnProperty('callback')){
							options.callback(url);
						}
					})
				}
			});
		});
	}
})(jQuery);