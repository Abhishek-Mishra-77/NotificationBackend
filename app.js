const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

// Initialize the app and server
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow all origins
    methods: ["GET", "POST"], // Allowed methods
  },
});

// Middleware
app.use(cors());

// Handle socket connection
io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle incoming messages from clients
  socket.on("message", (data) => {
    const response = {
      type: data.type,
      text: `Message "${data.text}" received by the server.`,
    };
    socket.emit("response", response);

    // Broadcast the original message to all clients (if needed)
    io.emit("message", data);
  });

  // Handle socket disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Define a route (optional)
app.get("/", (req, res) => {
  return res.status(200).json({ message: "Connected with the server" });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
