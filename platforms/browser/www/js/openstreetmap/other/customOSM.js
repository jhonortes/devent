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
	var markerimg = 'data:image/png;base64,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';
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
		move_position : function(lng,lat,zoom){
			console.log("set");
			map.getView().setCenter(ol.proj.transform([lng, lat], 'EPSG:4326', 'EPSG:3857'));
            map.getView().setZoom(zoom);
		},
		move_position_track : function(lng,lat){
			console.log("set");
			map.getView().setCenter(ol.proj.transform([lng, lat], 'EPSG:4326', 'EPSG:3857'));
            map.getView().setZoom(map.getView().getZoom());
		},
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
			source.addfeature(function(evt){
				var feature = evt.feature;
				var coords = feature.getGeometry().getCoordinates();	
	        	var geom =  new ol.geom.Point( ol.proj.transform([coords[0], coords[1]], 'EPSG:3857','EPSG:4326') ).getCoordinates();
				map.removeInteraction(draw);							
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
				map.removeInteraction(draw);
				NewEventPlace(geom,coords);	
			});
		},
		removeDrawMarker : function() {
			source.clear();
		},
		draw_route : function(coord,color){
			styles = {
			  route: new ol.style.Style({
			    stroke: new ol.style.Stroke({
			      width:9, color: color
			    }),
			  }),
			  icon: new ol.style.Style({
			    image: new ol.style.Icon({
			      anchor: [0.5, 1],
			      src: markerimg//'data:image/png;base64,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'
			    })
			  })
			};
			var route = new ol.format.Polyline({
		      factor: 1e5,
		    }).readGeometry(coord, {
		      dataProjection: 'EPSG:4326',
		      featureProjection: 'EPSG:3857'
		    });
		    var feature = new ol.Feature({
		      type: 'line',
		      geometry: route
		    });
		    feature.setStyle(styles.route);
		    source.addFeature(feature);
		},
		draw_route_2 : function(coord,color){
			styles = {
			  route: new ol.style.Style({
			    stroke: new ol.style.Stroke({
			      width:3, color: color
			    }),
			  }),
			  icon: new ol.style.Style({
			    image: new ol.style.Icon({
			      anchor: [0.5, 1],
			      src: markerimg//'data:image/png;base64,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'
			    })
			  })
			};
			var route = new ol.format.Polyline({
		      factor: 1e5,
		    }).readGeometry(coord, {
		      dataProjection: 'EPSG:4326',
		      featureProjection: 'EPSG:3857'
		    });
		    var feature = new ol.Feature({
		      type: 'line',
		      geometry: route
		    });
		    feature.setStyle(styles.route);
		    source.addFeature(feature);
		},
		/***************************************/ 
		addMarker: function(lon, lat, id ,details)
  		{
	        //create a point
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
	  					src: markerimg//'data:image/png;base64,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'
	  	          }))

	  	        })
  	    	]);

	        feature.set('description', details);

			feature.setId(id);
  			
			source.addFeature(feature);		
			// map.render();
  			//map.getLayers().item(1).getSource().addFeature(feature);

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
	  					src: 'data:image/png;base64,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'
	  	          }))

	  	        })
  	    	]);
	        feature.set('description', details);
			feature.setId(id);  			
			source.addFeature(feature);		
  			//map.getLayers().item(1).getSource().addFeature(feature);
  		},
  		addMarkererr: function(lon, lat, id ,details)
  		{	        //create a point
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
	  					scale: 0.50,
	  					src: 'data:image/png;base64,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'
	  	          }))

	  	        })
  	    	]);
	        feature.set('description', details);
			feature.setId(id);  			
			source.addFeature(feature);		
  		},
		deleteMarker: function(id)   {
			try{
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
			}catch(er){
				//console.log(er);
			}
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

