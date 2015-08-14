$(document).ready(function(){
	var _model;
	var updateData = function(){
		$.getJSON(router.users.current, function(data){
			var grade = data.user.grade;
			console.log(grade);
			var _model =kendo.observable({
				grade: localization.usergrade['grade_'+grade],
				gradedesc: localization.usergrade['gradedesc_'+grade],
			});
			kendo.bind($('#info-container'), _model);
		});
	};
	updateData();
});