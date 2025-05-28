// src/socketHandlers/index.js
import registerChatHandlers from './chatHandlers.js';

const registerSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    // Note: socket.user is populated by the auth middleware (socketAuth.js)
    // If auth fails, the connection is rejected before reaching here.
    console.log(`Socket connected: ${socket.id}, User: ${socket.user?.name}`); // Updated log for clarity
    
    // Register chat-specific event handlers for this socket
    registerChatHandlers(io, socket);

    socket.on('disconnect', (reason) => {
      // 'disconnecting' event in chatHandlers.js is better for room-specific cleanup
      console.log(`Socket disconnected: ${socket.id}, Reason: ${reason}, User: ${socket.user?.name}`);
    });

    // General error handler for this specific socket connection
    socket.on('error', (error) => {
      console.error(`Socket error for ${socket.id} (User: ${socket.user?.name}):`, error);
    });
  });
};

export default registerSocketHandlers;
