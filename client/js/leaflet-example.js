var cityData = cityData || [];

(() => {
  "use strict";
  main();

  function main() {
    const myMap = L.map("circuit-map").setView([45.586111, -95.913889], 13);
    addMapboxTiles(myMap);
    addCityData(cityData, myMap);
    addRandomCircuit(cityData, myMap);
  }


  function addMapboxTiles(myMap) {
    L.tileLayer(
      "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
      {
        attribution:
          `
            Map data &copy;
            <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>
            contributors,
            Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>
          `.replace(/\n/, " ").trim(),
        maxZoom: 18,
        minZoom: 1,
        id: "mapbox/streets-v11",
        tileSize: 512,
        zoomOffset: -1,
        accessToken: "pk.eyJ1Ijoid2FsYnIwMzciLCJhIjoiY2tuZTBlaHhnMmNpcjJ3bGc4cGJvNW9tNCJ9.2tzm5cKgtdqznvB521ozLQ",
      }
    ).addTo(myMap);
  }

  function addCityData(cityData, myMap) {
    const geoJsonProcessing = {
      // Turns GeoJSON points to Leaflet circle markers.
      pointToLayer: (_, latLng) => {
        return new L.CircleMarker(latLng, { radius: 5, color: "#f00" });
      },
      // Adds a popup to each city, if popup information exists in the GeoJSON.
      onEachFeature: (feature, geoJsonLayer) => {
        if (feature.properties.popupContent) {
          geoJsonLayer.bindPopup(feature.properties.popupContent);
        }
      },
    };
    const cityLayer = L.geoJSON(cityData, geoJsonProcessing).addTo(myMap);
  }

  function addRandomCircuit(cityData, myMap) {
    const cityCoordinates = cityData
      .map(cityFeature => cityFeature.geometry.coordinates)
      .map(([longitude, latitude]) => [latitude, longitude]);

    const path = shuffledCopy(cityCoordinates);
    // Close the path.
    path.push(path[0]);

    const lineStyle = {
      dashArray: [10, 20],
      weight: 5,
      color: "#00f"
    };
    const fillStyle = {
      weight: 5,
      color: "#fff"
    };
    L.polyline(path, fillStyle).addTo(myMap);
    L.polyline(path, lineStyle).addTo(myMap);
  }

  /**
   * Shuffle an array out-of-place.
   */
  function shuffledCopy(array) {
    const copy = Array.from(array);
    shuffle(copy);
    return copy;
  }

  /**
   * Shuffle an array in place.
   * (With the Fisher-Yates algorithm.)
   */
  function shuffle(array) {
    for (let i = array.length - 1; i >= 1; i--) {
      const j = Math.floor((i + 1) * Math.random());
      const tmp = array[i];
      array[i] = array[j];
      array[j] = tmp;
    }
  }
})();

