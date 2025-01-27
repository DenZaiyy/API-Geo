const inputCP = document.getElementById("codepostal");
const selectVille = document.getElementById("ville");
const map = L.map("map");
let coordinates = [];

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

inputCP.addEventListener("input", () => {
    let value = inputCP.value;
    selectVille.innerHTML = null;

    fetch(
        `https://geo.api.gouv.fr/communes?codePostal=${value}&fields=region,nom,code,codesPostaux,codeRegion,centre&format=json&geometry=centre`
    )
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            data.forEach((ville) => {
                let option = document.createElement("option");
                option.value = `${ville.code}`;
                option.innerHTML = `${ville.nom}`;
                selectVille.appendChild(option);
                L.marker([
                    ville.centre.coordinates[1],
                    ville.centre.coordinates[0],
                ])
                    .addTo(map)
                    .bindPopup(ville.nom);
                coordinates.push({
                    code: ville.code,
                    name: ville.nom,
                    lat: ville.centre.coordinates[1],
                    lng: ville.centre.coordinates[0],
                });
            });
        });
});

selectVille.addEventListener("change", () => {
    let value = selectVille.value;
    coordinates.forEach((ville) => {
        if (ville.code === value) {
            map.setView([ville.lat, ville.lng], 14); // Inversé (latitude, longitude)
        }
    });
});
