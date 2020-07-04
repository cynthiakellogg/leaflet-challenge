// Store our API endpoint inside queryUrl
// console.log("connected alrighty");

function getColor(d) {
    return d > 8 ? '#800026' :
            d > 7  ? '#BD0026' :
            d > 6  ? '#E31A1C' :
            d > 5  ? '#FC4E2A' :
            d > 4   ? '#FD8D3C' :
                      '#FEB24C' 
           
}

function markerBubble(value){
    return value*30000
}


var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
	var earthquakes = L.geoJSON(earthquakeData,{
		onEachFeature: function(feature,layer){

			layer.bindPopup("<h3>" + feature.properties.place +"</h3><hr><p>" + new Date(feature.properties.time)+ "</p>" + "<hr><p>Magnitude " + feature.properties.mag + "</p>" )
          },
		pointToLayer:function(feature,latlng){
			return new L.circle(latlng,{
				radius: markerBubble(feature.properties.mag),
				fillColor: getColor(feature.properties.mag),
				fillOpacity:.9,
				stroke:false,
			})
		}
	});


  



  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
//   L.geoJson(earthquakes, {style: style}).addTo(myMap);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: api_key,
  });

  

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    // "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 2,
    layers: [streetmap, earthquakes]
    
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);



// Create a legend to display information about our map
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        magnitude = [ 4, 5, 6, 7, 8],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < magnitude.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(magnitude[i] + 1) + '"></i> ' +
            magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);
  
}
