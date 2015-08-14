$(document).ready(function(){
	function loadScript(url){
		 var df = $.Deferred();
	     var script = document.createElement("script");   
	     script.type="text/javascript";
	     if(script.readyState){   
	         script.onreadystatechange = function(){   
	             if(script.readyState=="loaded"||script.readyState=="complete"){   
	                  script.onreadystatechange=null;  
	                  df.resolve();   
	            }   
	         }   
	     }else{   
	        script.onload = function(){  
	        	df.resolve();
	        }   
	     }   
	     script.async = true;
	     script.src = url;   
	     var x = document.getElementsByTagName('script')[0];
	     x.parentNode.insertBefore(script, x); 
	     return df;
	};
	
	var _paramstart =document.location.href.indexOf('?')+1;
	var matchs = (new RegExp(/[1-9]\d*/)).exec(document.location.href.substring(_paramstart));
	if(matchs.length<=0 || isNaN(matchs[0]))
			return;
	var id = matchs[0];
	
	$("#header-bar").loadHtml(router.templates.header);
	$("#vieworder").click(function(){
		$.when(loadScript('js/myorders.js'))
		.done(function(){
				$('#detail-info').showOrderInfo({orderid:id});
		});
	});
});