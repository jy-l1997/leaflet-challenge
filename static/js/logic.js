const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_day.geojson";

// took a lot of code from 15.1 example 10

d3.json(url).then(function(data){

    createFeatures(data.features); // createFeatures function needs to be made
    console.log(data)

    

});

function createFeatures(earthquakeData) {
    earthquakeMarkers = {};
    
    function onEachFeature(feature, layer) {
                
        layer.bindPopup(`<h3>${feature.properties.place} </h3>   
                        <p> Time: ${new Date(feature.properties.time)} </p>
                        <p> Magnitude: ${feature.properties.mag}</p>
                        <p> Depth: ${feature.geometry.coordinates[2]}</p>`);
    }  

    function circles(feature, latlng) {
        let details = {
            radius: feature.properties.mag *10,
            fillOpacity: 0.7,
            color: 'red',
            fillColor: colorScale(feature.geometry.coordinates[2]),
            weight: 0.5
        }

        return L.circleMarker(latlng, details)
    }
    
    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: circles
    });

    createMap(earthquakes);
}

function colorScale(depth) {
    const scale = ["#ffffb2", "#b10026"];

    const colScale = d3.scaleLinear().domain([-10,100]).range(scale);

    return colScale(depth);
}

function createMap(earthquakesLayer) {

    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

        let baseMaps = {
        Street: street
    };

    let overlayMaps = {
        Earthquakes: earthquakesLayer
    };

    let map = L.map("map", {

        center: [35.09, -100],
        zoom: 6,
        layers: [street, earthquakesLayer]

    }); 

    L.control.layers(baseMaps, overlayMaps).addTo(map);

    let legend = L.control({position: 'bottomright'});
    legend.onAdd = function () {
        let div = L.DomUtil.create('div', 'info legend');
        let grades = [-10, 10, 30, 50, 70, 100];

        colors = [
            colorScale(-10),
            colorScale(10),
            colorScale(30),
            colorScale(50),
            colorScale(70),
            colorScale(100),
        ]

      
        for (let i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + colors[i]  + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(map);

}