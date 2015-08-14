(function ($, undefined) {
	window.map ={
			loadMap: function(rid,rname){
				var _preventBubble = false;
				var mySquare = undefined;
				$.getJSON(router.restaurants.coordinate +rid + router.timestamp(), function(data) {
					var lat = data.coordinate.Restaurant_coordinate.latitude;
					var lon = data.coordinate.Restaurant_coordinate.longitude;
					var mp = new BMap.Map('map');
					mp.centerAndZoom(new BMap.Point(lon, lat), 17);
					var opts = {type:BMAP_NAVIGATION_CONTROL_ZOOM} ; 
					mp.addControl(new BMap.NavigationControl(opts));  
					var addMarker= function(point){    
						var myIcon = new BMap.Icon(router.images.marker, new BMap.Size(26, 26), {
						   offset: new BMap.Size(10, 25)
						 });    
						 var marker = new BMap.Marker(point, {icon: myIcon});  
						 mp.addOverlay(marker);  
						 marker.addEventListener("click", function(event){
							 _preventBubble = true;
							 if(mySquare == undefined){
								 mySquare = new SquareOverlay(mp.getCenter(), helper.getLabelLength(rname), rname);  
								 mp.addOverlay(mySquare);
							 }
						 });
					};
					var point = new BMap.Point(lon, lat);  
					addMarker(point);  
					function SquareOverlay(center, length, text){  
						 this._center = center;  
						 this._length = length;  
						 this._text = text;
					}  
					SquareOverlay.prototype = new BMap.Overlay(); 
					SquareOverlay.prototype.initialize = function(map){  
					 this._map = mp;     
					 var div = document.createElement("div");  
					 $(div).text(this._text).css('width',this._length + "px").addClass('mapdiv');
					 $(div).click(function(event){
						 event.stopPropagation();
						 event.preventDefault();
					 });
					 mp.getPanes().markerPane.appendChild(div);    
					 this._div = div;    
					 return div;  
					};
					SquareOverlay.prototype.draw = function(){
					 var position = this._map.pointToOverlayPixel(this._center);  
					 this._div.style.left = position.x - this._length / 2 + "px";  
					 this._div.style.top = position.y - 45 + "px";  
					} 
					SquareOverlay.prototype.show = function(){  
					 if (this._div){  
					   this._div.style.display = "";  
					 }  
					}      
					SquareOverlay.prototype.hide = function(){  
					 if (this._div){  
					   this._div.style.display = "none";  
					 }  
					}
					
					mp.addEventListener("click", function(e){
						if(_preventBubble == true)
							_preventBubble = false;
						else{
							if(mySquare!=undefined){
								mySquare.hide();
								mySquare = undefined;
							}
						}
					});  
				});
			}
	}
})(jQuery);