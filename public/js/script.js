// public/js/script.js
const socket = io();

// Prompt for a name or bus ID
const userName = prompt("Enter your name or bus ID:") || "Anonymous";
socket.emit("register-user", userName);

// Google Maps variables
let map;
let myMarker = null;          // Marker for our own location (if not a bus)
const busMarkers = {};        // Dictionary of bus markers keyed by socket ID

// Check if we're a bus

// const isBus = userName.startsWith("Citybus-2901");

const isBus = (userName === "Citybus-2901");

// OPTIONAL: a custom bus icon. If you have /public/bus-icon.png, you can define:
const busIcon = {
  url: "/bus-icon.png",            // your bus icon
  scaledSize: new google.maps.Size(35, 35),  // size of the icon
};

// Initialize the Google map once the page loads
window.onload = () => {
  // Center on (0,0) initially, zoom level 3
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 0, lng: 0 },
    zoom: 3,
  });
};

// Listen for "your-location" event (sent to normal users)
socket.on("your-location", (data) => {
  const { lat, lng, name } = data;

  // Create (or update) your own marker
  if (!myMarker) {
    myMarker = new google.maps.Marker({
      position: { lat, lng },
      map: map,
      title: `User: ${name}`,
    });
    // Zoom/center the map on your location first time
    map.setCenter({ lat, lng });
    map.setZoom(15);
  } else {
    myMarker.setPosition({ lat, lng });
  }
});

// Listen for "bus-location" event (for all city buses)
socket.on("bus-location", (data) => {
  const { id, name, lat, lng } = data;

  // If this bus already has a marker, just move it
  if (busMarkers[id]) {
    busMarkers[id].setPosition({ lat, lng });
  } else {
    // Otherwise, create a new marker for the bus
    busMarkers[id] = new google.maps.Marker({
      position: { lat, lng },
      map: map,
      icon: busIcon,
      title: `Bus: ${name}`,
    });
  }
});

// If a bus disconnects, remove its marker
socket.on("bus-disconnected", (busId) => {
  if (busMarkers[busId]) {
    busMarkers[busId].setMap(null);
    delete busMarkers[busId];
  }
});

// Use HTML5 geolocation to send location updates to server
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      // Send location to server
      socket.emit("send-location", { latitude, longitude });
    },
    (err) => console.error(err),
    { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
  );
} else {
  console.warn("Geolocation is not supported in this browser.");
}
