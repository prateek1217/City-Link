// app.js
const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// Store user info and bus locations in-memory
const userInfo = {};       // { socketId: { name, isBus } }
const busLocations = {};   // { socketId: { name, lat, lng } }

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // 1) Each client registers their name (or bus ID) once
  socket.on("register-user", (name) => {
    console.log("User registering:", name);
    // const isBus = name.startsWith("Citybus-");
    const isBus = (name === "Citybus-2901");

    userInfo[socket.id] = { name, isBus };
  });

  // 2) Location updates
  socket.on("send-location", ({ latitude, longitude }) => {
    const info = userInfo[socket.id];
    if (!info) return; // No user info found? Safety check

    if (info.isBus) {
      // This is a city bus. Broadcast location to all clients.
      busLocations[socket.id] = {
        name: info.name,
        lat: latitude,
        lng: longitude,
      };
      io.emit("bus-location", {
        id: socket.id,
        name: info.name,
        lat: latitude,
        lng: longitude,
      });
    } else {
      // This is a regular user. Send only to themselves.
      socket.emit("your-location", {
        id: socket.id,
        name: info.name,
        lat: latitude,
        lng: longitude,
      });

      // Also, right after they update location, send them any known buses
      // so that the user sees all Citybus markers, too.
      for (const [busId, busData] of Object.entries(busLocations)) {
        socket.emit("bus-location", {
          id: busId,
          name: busData.name,
          lat: busData.lat,
          lng: busData.lng,
        });
      }
    }
  });

  // 3) Cleanup on disconnect
  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
    const info = userInfo[socket.id];
    if (!info) return; // Just in case

    if (info.isBus) {
      // If a bus goes offline, remove it from the busLocations store
      delete busLocations[socket.id];
      io.emit("bus-disconnected", socket.id);
    } else {
      // If a normal user leaves, only they cared about their own location
      // (they won’t see themselves anyway). Usually, no broadcast needed.
      // But if you had code showing other users, you'd do something like:
      // io.emit("user-disconnected", socket.id);
    }

    delete userInfo[socket.id];
  });
});

// Render the main page
app.get("/", (req, res) => {
  res.render("index"); // views/index.ejs
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
