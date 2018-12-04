var osm_ = function(){
	var map;
	var source;
	var callbacks;
	var raster;
	var draw;
	return {
		initialize: function(targets,lng,lat,zoom){
			raster = new ol.layer.Tile({
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
			    layers: [raster],
			    target: targets,
			    view:new ol.View({center:  ol.proj.transform([lng, lat], 'EPSG:4326', 'EPSG:3857'),zoom: zoom})
			});
			
		},
		addInteraction: function() {
          draw = new ol.interaction.Draw({
            source: source,
            type: "Point"
          });
          map.addInteraction(draw);
        
      }
	}
};