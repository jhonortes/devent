var OSM = function(){
	var map;
	var draw; 
	var source;
	var vector;
	var addpoly = false;
	var popup;
	var raster;
	var result_poly;
	var markerLayer;
	var polygonClickCallbacks;
	var click_enable_map = false;
	var polygonOnclick = function(evt){
		map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
		  	// (polygonClickCallbacks[feature.getId()])({id:feature.getId()});
		  	//console.log(evt.coordinate);
		  	if(feature.get('description') != null || feature.get('description') != ""){
		  		(polygonClickCallbacks)({id:feature.getId()});
		    	//popup.show(evt.coordinate, '<div><center>' + feature.get('description') + '</center><hr/><div ><button class="btn btn-primary" id="mapedit" onclick="editproperty(this)"  data-value="' + feature.getId() + '">Edit</button><button class="btn btn-danger" data-value="' + feature.getId() + '" onclick="markerdelete(this)" id="markerdelete" >Delete</button> </div></div>');
		  	}
		});
	};
	var PolyResultDrawCoor;
	var PolyResultDrawCoorResult = function(evt){
		(PolyResultDrawCoor)({coor:evt});
	}
	var PointResultDrawCoor;
	var PointResultDrawCoorResult = function(evt,evt2){		
		(PointResultDrawCoor)({coordinate:evt});
		popup.show(evt2,'<div><center>Do you want to save This place? <br /></center><div ><button type="button" id="aa" onClick="alert(1);" >Save</button > <button onclick="cancel();" >Cancel</button> </div></div>');
	}
	var NewPlaceCoor;
	var NewEventPlace = function(evt,evt2){		
		(NewPlaceCoor)({coordinate:evt2});
		popup.show(evt,'<div><center>Do you want to save This place? </div>');
	}
	return{
		create:function (targets,lng,lat,zoom){
		// map = new OpenLayers.Map(targets);
  //       layer = new OpenLayers.Layer.OSM( "Simple OSM Map");
  //       map.addLayer(layer);
  //       map.setCenter(
  //           new OpenLayers.LonLat(lng,lat).transform(
  //               new OpenLayers.Projection("EPSG:4326"),
  //               map.getProjectionObject()
  //           ), zoom
  //       );
			var raster = new ol.layer.Tile({
			    source: new ol.source.OSM(),
			});

			source = new ol.source.Vector({wrapX: false});
			vector = new ol.layer.Vector({
			    source: source
			});

			markerLayer = new ol.layer.Vector({
			      source: new ol.source.Vector({ features: [], projection: 'EPSG:4326' })
			});
			
			map = new ol.Map({
			    layers: [raster,vector,markerLayer],
			    target: targets,
			    renderer: 'canvas',
			    interaction:null,
			    controls: ol.control.defaults({
			      attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
			        collapsible: true
			      })
			    }),
			    view:new ol.View({center:  ol.proj.transform([lng, lat], 'EPSG:4326', 'EPSG:3857'),zoom: zoom})
			});

			popup = new ol.Overlay.Popup();
			map.addOverlay(popup);	

			map.on('singleclick', function(evt) {
				//if(click_enable_map){
					polygonOnclick(evt);
				//} 
				// PointResultDrawCoorResult(evt);
				 map.renderSync();
			});


			polygonClickCallbacks = Object();
			PolyResultDrawCoor = Object();
			PointResultDrawCoor = Object();
			NewPlaceCoor = Object();
			// var olGM = new olgm.OLGoogleMaps({map: map}); // map is the ol.Map instance
			// olGM.activate();	
		},
		// move_position : function(lng,lat,zoom){
		// 	console.log("set");
		// 	map.getView().setCenter(ol.proj.transform([lng, lat], 'EPSG:4326', 'EPSG:3857'));
  //           map.getView().setZoom(zoom);
		// },
		addInteraction : function(draw) {
		  draw = new ol.interaction.Draw({
		    source: source,
		    type: /** @type {ol.geom.GeometryType} */ (draw)
		  });
		  map.addInteraction(draw);
		},
		removeInteractions : function(){
			var dblClickInteraction;
			// find DoubleClickZoom interaction
			map.getInteractions().getArray().forEach(function(interaction) {
			  if (interaction instanceof ol.interaction.DoubleClickZoom) {
			    dblClickInteraction = interaction;
			  }
			});
			// remove from map
			map.removeInteraction(dblClickInteraction);
		},
		/***************************************/
		getResultDrawPoint : function(callback){
			PointResultDrawCoor = callback;			
		},
		getNewEventPoint : function(callback){
			NewPlaceCoor = callback;			
		},
		mapclickcallback : function(callback){
			polygonClickCallbacks = callback;
		},
		drawMarker : function(){
			this.addInteraction("Point");
			source.on('addfeature', function(evt){
				var feature = evt.feature;
				var coords = feature.getGeometry().getCoordinates();	
	        	var geom =  new ol.geom.Point( ol.proj.transform([coords[0], coords[1]], 'EPSG:3857','EPSG:4326') ).getCoordinates();
				map.removeInteraction("Point");							
				// console.log(geom);
				PointResultDrawCoorResult(geom,coords);	
			});
		},
		drawNewPoint : function(){
			this.addInteraction("Point");
			source.on('addfeature', function(evt){
				var feature = evt.feature;
				var coords = feature.getGeometry().transform('EPSG:3857','EPSG:4326').getCoordinates();
	        	var geom = new ol.geom.Point( ol.proj.transform([coords[0], coords[1]], 'EPSG:4326', 'EPSG:3857') ).getCoordinates();
				map.removeInteraction("Point");
				NewEventPlace(geom,coords);	
			});
		},
		removeDrawMarker : function() {
			source.clear();
		},
		/***************************************/ 
		addMarker: function(lon, lat, id ,details)
  		{
	        //create a point
	        console.log(lon + " " + lat);
	        var feature = new ol.Feature({
	        	id:id,
	        	geometry:new ol.geom.Point( ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857')),
	        	description:details
	        });
  			
  			feature.setStyle([
  	        new ol.style.Style({
	  	          image: new ol.style.Icon(({
	  	            	anchor: [0.5,1],
	  	            	anchorXUnits: 'fraction',
	  	            	anchorYUnits: 'fraction',
	  					opacity: 1,
	  					src: 'data:image/png;base64,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'
	  	          }))

	  	        })
  	    	]);

	        feature.set('description', details);

			feature.setId(id);
  			
			source.addFeature(feature);		
			// map.render();
  			map.getLayers().item(1).getSource().addFeature(feature);

  		},
  		addMarkerStar: function(lon, lat, id ,details)
  		{	        //create a point
	        //console.log(lon + " " + lat);
	        var feature = new ol.Feature({
	        	id:id,
	        	geometry:new ol.geom.Point( ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857')),
	        	description:details
	        });  			
  			feature.setStyle([
  	        new ol.style.Style({
	  	          image: new ol.style.Icon(({
	  	            	anchor: [0.5,1],
	  	            	anchorXUnits: 'fraction',
	  	            	anchorYUnits: 'fraction',
	  					opacity: 1,
	  					src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAdCAYAAAC9pNwMAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAAAuVJREFUeNq8lj1IW1EUx39p+iJITIxpWj+C8Zk0oiA4OjiqHYJDps4SdHNwdAgZurg6CIIYdCyIOIggZMju5iB+JKkWNLa2iRKtWIynw0tIjC/SF40HDu/y7j3nd7/e/zyo3b4U/FWtzevl3OvlHGh7TfDM8jKyvIwAM68FbVFVUtksks0iqkoKaHkN8PTsLCKi+ewsAkzXG2p3uzk8OyuBz84Qt5tDwF5P8FQkUoIWPRJBgKl6QZtbW9k9PdVg9/eaiyCnp0hrK7tAcz3Ak+HwQ2g5PBxGgMn/TWbSeWcB3gMfCt+oF+jy+fgci9Hm8YBIRRITHB/D8DDpRIKvwBGQBNLAD+An8LcS/An4aDLhtVpRm5ro7OjA6fHwzuejsbsbPB7w+6Gr6zG0HH50BAcH2iRSKUgk+HN8zK+TE37ncny/uuKbCEngECA2MoJsbiLb20g6jeTzjy+Q3hbrbXml5/Nazu1tjTEyggAxgDaXi/j6unGQ0YmsryMuF/FymXU2NBCLRl8GqDeBaBRpaCAGOCuPyaUoJfhLrjgaRRSFGOCqdsudisLW0tLz4cX4pSVEUdjSW+kjWVQUNhcWaocX4xYWEEVh04icOsxmNubnawfPzyNmMxuAw6hS2ZxOdpJJY3ARJJlEnE52AFu15G+eAN/YbIjDYVxbHQ6w2RDgphawqqq01wpWVdoBtRZwZ0+Pdj56MmkyaV5pxbGF2M5awL6+PszVdFmvXW6FWF+15G+fAPv9fn3g5SUsLmrtiQmw2x+uVgvWHkaPyWS1srG//1Brr681FervJw2EgXB/P+loVOsrH7u/j1itbFQpvVWtsbeXvUymVGFWV5HBQS6AuUKNLpoXmBsc5GJ1tVTZMhmkt5c9oNEI2BcMkhNB4nEkEOAWWAEGnogZAFYCAW7jcQ0eDJJ76pz1bCwQQEIh7iwW1oAhA7FDFgtroRB3gQACjBkBjxeK9egz/tFGCznG9Tr/DQAMvPvucmoDMAAAAABJRU5ErkJggg=='
	  	          }))

	  	        })
  	    	]);
	        feature.set('description', details);
			feature.setId(id);  			
			source.addFeature(feature);		
			// map.render();
  			map.getLayers().item(1).getSource().addFeature(feature);
  		},
		deleteMarker: function(id)   {
			popup.hide();
			//console.log(id);
			var xx = 1;
			//console.log(map.getLayers().item(1).getSource().getFeatures(id));
			var id2 = map.getLayers().item(1).getSource().getFeatureById(id);
			if(id2 == null){
				//console.log("wala");
				xx = 2;
				id2 = map.getLayers().item(2).getSource().getFeatureById(id);
				if(id2 == null){
					//console.log("wala2");
					xx = 0;
					id = map.getLayers().item(0).getSource().getFeatureById(id);
				}
			}
			//console.log(id2);
			map.getLayers().item(xx).getSource().removeFeature(id2);
			delete polygonClickCallbacks[id];
			/*
			popup.hide();
			var id = map.getLayers().item(1).getSource().getFeatureById(id);
			map.getLayers().item(1).getSource().removeFeature(id);
			delete polygonClickCallbacks[id];
			*/
		},
		deletePinMarker: function(id)  
		{
			// popup.hide();
			// console.log(id);
			// var xx = 1;

			// var id2 = map.getLayers().item(1).getSource().getFeatureById(id);
			// if(id2 == null){
			// 	console.log("wala");
			// 	xx = 2;
			// 	id2 = map.getLayers().item(2).getSource().getFeatureById(id);
			// 	if(id2 == null){
			// 		console.log("wala2");
			// 		xx = 0;
			// 		id = map.getLayers().item(0).getSource().getFeatureById(id);
			// 	}
			// }
			// console.log(id2);
			// map.getLayers().item(xx).getSource().removeFeature(id2);
			// delete PointResultDrawCoor[id];
			popup.hide();
			var id = map.getLayers().item(1).getSource().getFeatureById(id);
			map.getLayers().item(1).getSource().removeFeature(id);
			delete PointResultDrawCoor[id];
		},
		deletePoly: function(id)  
		{
			var id = map.getLayers().item(2).getSource().getFeatureById(id);
			map.getLayers().item(2).getSource().removeFeature(id);
			delete polygonClickCallbacks[id];
		},
		deleteMarkers : function (evt){
			var id = $(evt).attr('data-value');
		    this.deleteMarker(id);
		    this.deletePoly(id);
		}
	};
};

