// Define the API endpoint URL
const queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request and create the map
d3.json(queryUrl).then(createMap);

// Create markers for earthquake features
function createMarker(feature, latlng) {
    return L.circleMarker(latlng, {
        radius: feature.properties.mag * 5,
        fillColor: markerColor(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 0.5,
        opacity: 0.5,
        fillOpacity: 1
    });
}

// Create popups for earthquake features
function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>Location:</h3> ${feature.properties.place}<h3> Magnitude:</h3> ${feature.properties.mag}<h3> Depth:</h3> ${feature.geometry.coordinates[2]}`);
}

// Create the map with layers and legend
function createMap(earthquakeData) {
    const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    const earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: createMarker
    });

    const myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [streetLayer, earthquakes]
    });

    const legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {
        const div = L.DomUtil.create('div', 'info legend');
        const grades = [-10, 10, 30, 60, 90];
        let legendInfo = "<h5>Magnitude</h5>";

        for (let i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + markerColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(myMap);
}

// Define a function to determine marker color based on depth
function markerColor(depth) {
    return depth > 90 ? '#d73027' :
        depth > 70 ? '#fc8d59' :
        depth > 50 ? '#fee08b' :
        depth > 30 ? '#d9ef8b' :
        depth > 10 ? '#91cf60' :
        '#1a9850';
}