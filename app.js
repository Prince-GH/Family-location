// Import the necessary Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDHOhSQ1CuvFRIWRzg7Qt-lI2tv4aU3Tjw",
    authDomain: "locationapp-a9a54.firebaseapp.com",
    databaseURL: "https://locationapp-a9a54-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "locationapp-a9a54",
    storageBucket: "locationapp-a9a54.appspot.com",
    messagingSenderId: "1025210412464",
    appId: "1:1025210412464:web:cb2a537bbf607ef39bba75"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Initialize the map
const map = L.map('map').setView([51.505, -0.09], 13);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Function to update location in Firebase
function updateLocation(userId, latitude, longitude) {
    set(ref(database, 'locations/' + userId), {
        latitude: latitude,
        longitude: longitude
    });
}

const USER_ID = prompt("Enter your name:");

// Check for geolocation support
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(position => {
        const { latitude, longitude } = position.coords;

        // Update map view and user location
        map.setView([latitude, longitude], 13);
        updateLocation(USER_ID, latitude, longitude); // Replace with actual user ID
    }, err => {
        console.error(err);
        alert("Unable to retrieve your location.");
    });
} else {
    alert("Geolocation is not supported by this browser.");
}

// Function to read locations from Firebase
onValue(ref(database, 'locations'), snapshot => {
    const locations = snapshot.val();
    if (locations) {
        // Clear existing markers before adding new ones
        map.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        // Add markers for each user location
        for (const userId in locations) {
            const { latitude, longitude } = locations[userId];
            L.marker([latitude, longitude]).addTo(map).bindPopup(`${userId} is here!`);
        }
    }
});
