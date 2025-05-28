import app from './app.js';
import http from 'http';
import { Server } from 'socket.io'; // Import Server from socket.io
import setupSocketAuth from './config/socketAuth.js'; // To be created: Socket Auth Middleware
import registerSocketHandlers from './socketHandlers/index.js'; // To be created: Main handler registration

const PORT = process.env.PORT || 3001;
const httpServer = http.createServer(app); // Rename to httpServer for clarity

// Initialize Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000", // Allow frontend origin
    methods: ["GET", "POST"],
    // credentials: true // If using cookies or session-based auth with sockets
  }
});

// --- Socket.IO Authentication Middleware ---
// This middleware will authenticate connections before they proceed.
setupSocketAuth(io); // Pass the 'io' instance to setup auth

// --- Register Socket Event Handlers ---
// This function will set up all event listeners for connected sockets.
registerSocketHandlers(io);

httpServer.listen(PORT, () => { // Use httpServer to listen
  console.log(`Server is running on port ${PORT}`);
  console.log(`Socket.IO server initialized and listening.`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  // The NEXT_PUBLIC_API_URL is a frontend variable, so it won't be available here unless also defined in the backend's .env
  // For backend, it's more about its own configuration.
});

// Handle server startup errors
httpServer.on('error', (error) => { // Ensure this uses httpServer
  if (error.syscall !== 'listen') {
    throw error;
  }
  // Handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`Port ${PORT} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`Port ${PORT} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});
