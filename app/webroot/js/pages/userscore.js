$(document).ready(function(){
	var _model;
	var updateData = function(){
		$.getJSON(router.users.current, function(data){
			console.log(data.user.credit);
			var _model =kendo.observable({
				score: data.user.credit
			});
			kendo.bind($('#info-container'), _model);
		});
	};
	updateData();
});