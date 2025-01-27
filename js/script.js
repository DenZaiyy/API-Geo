// Instanciation des variables pour récuperer les éléments du DOM
const inputCP = document.getElementById("codepostal");
const selectVille = document.getElementById("ville");

// Instanciation de la carte avec les coordonnées de l'adresse d'Elan Formation par défaut
const elan = [47.7272966, 7.2939856];
let map = L.map("map").setView(elan, 15);
let marker = L.marker(elan).addTo(map);
var popup = L.popup()
    .setLatLng([47.7282966, 7.2939856])
    .setContent(
        "<p>Welcome to Elan Formation<br />from Brunstatt-Didenheim</p>"
    )
    .openOn(map);
// Instancier un tableau pour stocker les coordonnées des villes
let coordinates = [];

// Ajout de la couche OpenStreetMap
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// Ecouter l'événement input sur l'input code postal pour pouvoir récupérer sa valeur et faire le call API
inputCP.addEventListener("input", () => {
    // Récupérer la valeur de l'input code postal
    let value = inputCP.value;
    // Définir le contenu de la select a null
    selectVille.innerHTML = null;

    // Faire le call API pour récupérer les villes correspondant au code postal saisi par l'utilisateur
    fetch(
        `https://geo.api.gouv.fr/communes?codePostal=${value}&fields=region,nom,code,codesPostaux,codeRegion,centre&format=json&geometry=centre`
    )
        // Récupérer la réponse de l'API en format JSON
        .then((response) => response.json())
        // Traiter les données récupérées
        .then((data) => {
            // Parcourir les données récupérées
            data.forEach((ville) => {
                // Créer un élément option pour chaque ville
                let option = document.createElement("option");
                // Définir la valeur et le texte de l'option
                option.value = `${ville.code}`;
                option.innerHTML = `${ville.nom}`;
                // Ajouter l'option à la select
                selectVille.appendChild(option);
                // Ajouter un marqueur pour chaque ville sur la carte
                L.marker([
                    ville.centre.coordinates[1],
                    ville.centre.coordinates[0],
                ])
                    .addTo(map)
                    .bindPopup(ville.nom);
                // Ajouter les coordonnées de chaque ville dans le tableau coordinates
                coordinates.push({
                    code: ville.code,
                    name: ville.nom,
                    lat: ville.centre.coordinates[1],
                    lng: ville.centre.coordinates[0],
                });
            });
        });
});

// Ecouter l'événement change sur la select ville pour centrer la carte sur la ville sélectionnée
selectVille.addEventListener("change", () => {
    // Récupérer la valeur de la select ville
    let value = selectVille.value;
    // Parcourir le tableau coordinates pour trouver les coordonnées de la ville sélectionnée
    coordinates.forEach((ville) => {
        // Si le code de la ville correspond à la valeur de la select ville
        if (ville.code === value) {
            // Centrer la carte sur la ville sélectionnée
            map.setView([ville.lat, ville.lng], 14);
        }
    });
});
