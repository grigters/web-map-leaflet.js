// Store API requests
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var plates = "https://github.com/fraxen/tectonicplates/blob/master/GeoJSON/PB2002_steps.json";

var earthCircle = [];
// Perform a GET request to the query URL
d3.json(url, function(data) {

  //print json data to be used to create circles
  // console.log(data.features);
  // console.log(data)
  // console.log(data.features[0].geometry.coordinates)
  // console.log(data.features[0].properties.mag)
  // console.log(data.features[1].properties.mag)
  // console.log(data.features[2].properties.mag)
  // console.log(data.features[3].properties.mag)
  // console.log(data.features[0].properties.place)
  // console.log(new Date(data.features[0].properties.time))
  // console.log(data.features[0].geometry.coordinates[0])
  // console.log(data.features[0].geometry.coordinates[1])

  // Create a different color based on the magnitude of the earthquake
  for (var i = 0; i < data.features.length; i++) {
    var color = "";
    if (data.features[i].properties.mag > 5)
        color = "#EF6B6A";
    else if (data.features[i].properties.mag > 4)
        color = "#F0A76A";
    else if (data.features[i].properties.mag > 3)
        color = "#F3BA4C";
    else if (data.features[i].properties.mag > 2)
        color = "#F2DB4D";
    else if (data.features[i].properties.mag > 1)
        color = "#E0EE4C";
    else
        color = "#B4EB4B";

    // Pass the circle properties into a variable 
    earthCircle.push(
      L.circle([data.features[i].geometry.coordinates[1], data.features[i].geometry.coordinates[0]], {
        stroke: true,
        weight: 1,
        fillOpacity: 0.90,
        color: "white",
        fillColor: color,
        radius: data.features[i].properties.mag * 20000
      }).bindPopup("<h1>" + data.features[i].properties.place + "</h1> <hr> <h3>" + new Date(data.features[0].properties.time) +
      "</h3> <hr> <h3>Lat, Long, Height: " + data.features[i].geometry.coordinates + "</h3>")
    );
    // console.log(earthCircle)
  }
  
// add the circles to a layer group to be placed in the overlayMap
var earthquakeLayer = L.layerGroup(earthCircle);

// Create the 3 layers
var light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  // attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  // id: "mapbox.streets",
  // id: "mapbox.satellite",
  // id: "mapbox.dark",
  // id: "mapbox.outdoors",
  accessToken: API_KEY
});

var satallite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  maxZoom: 18,
  id: "mapbox.satellite",
  accessToken: API_KEY
});

var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  maxZoom: 18,
  id: "mapbox.outdoors",
  accessToken: API_KEY
});

// Create baseMap
var baseMaps = {
  Light: light,
  Satellite: satallite,
  Outdoors: outdoors
};

// Create OverlayMap
var overlayMaps = {
  Earthquakes: earthquakeLayer
};

// Create a map object
var myMap = L.map("map", {
  center: [41.8719, 12.5674],
  zoom: 3,
  layers: [light, earthquakeLayer]
});

// Add the control to the map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);

//Tectonic plates
// Error message: Access to XMLHttpRequest blocked by CORS policy:
// var tect = []
// d3.json(plates, function(plate) {

//   console.log(plate.features[0].geometry.coordinates[1])
//   console.log(plate.features[0].geometry.coordinates[0])
//   // console.log(plate.features[0].geometry.coordinates)
//   for (var i = 0; i < plate.features.length; i++)
//   {
//     tect.push(plate.features[i].geometry.coordinates)
//   }
//   console.log(tect)
//   // create a red polyline from an array of LatLng points
// var latlngs = tect;
// var polyline = L.polyline(latlngs, {color: 'red'}).addTo(myMap);
// // zoom the map to the polyline
// myMap.fitBounds(polyline.getBounds());
// })


// Set up legend
function getColor(d) {
  return d > 5 ? "#EF6B6A" :
         d > 4 ? "#F0A76A" :
         d > 3 ? "#F3BA4C" :
         d > 2 ? "#F2DB4D" :
         d > 1 ? "#E0EE4C" :
                 "#B4EB4B";
}

var legend = L.control({ position: "bottomright" });
    legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend');
    grades = [0,1,2,3,4,5];

    for (var i = 0; i < grades.length; i++) {
      div.innerHTML += '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' + grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
      return div;
      };

legend.addTo(myMap);

})