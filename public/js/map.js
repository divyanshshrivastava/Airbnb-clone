// Only initialize the map if coordinate data and the #map element exist
if (typeof coordinates !== "undefined" && document.getElementById("map")) {
  let points = JSON.parse(coordinates).reverse();

  const map = L.map("map").setView(points, 12);

  L.tileLayer(
    `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${apiKey}`,
    {
      attribution: "© OpenStreetMap contributors",
    },
  ).addTo(map);

  const redIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    iconRetinaUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  L.marker(points, { icon: redIcon })
    .addTo(map)
    .bindPopup("Exact Location will be provided after booking")
    .openPopup();
}
