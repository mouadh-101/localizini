// src/socketHandlers/chatHandlers.js

// In-memory store for active rooms and users. For production, consider Redis or similar.
// For simplicity, we'll just use Socket.IO's built-in room functionality.
// We don't need to explicitly store users per room here if we're just broadcasting.

const registerChatHandlers = (io, socket) => {
  // Handler for when a client wants to join a chat room
  socket.on('joinRoom', ({ roomId }) => {
    if (!roomId) {
      socket.emit('chatError', { message: 'Room ID is required to join.' });
      return;
    }
    socket.join(roomId);
    console.log(`User ${socket.user?.name} (ID: ${socket.user?.id}, Socket: ${socket.id}) joined room: ${roomId}`);
    
    // Optional: Notify others in the room that a user has joined
    // socket.to(roomId).emit('userJoined', { userId: socket.user.id, userName: socket.user.name });

    // Optional: Send past messages if they were persisted (not in this subtask)
    // For now, client will request past messages if needed via 'requestPastMessages'
    // socket.emit('loadInitialMessages', []); // Send empty array or recent messages
  });

  // Handler for when a client sends a message
  socket.on('sendMessageToServer', (data) => {
    const { roomId, text } = data;
    const user = socket.user; // User info attached by auth middleware

    if (!user) {
      socket.emit('chatError', { message: 'Authentication error. Cannot send message.' });
      return;
    }
    if (!roomId || !text || String(text).trim() === '') {
      socket.emit('chatError', { message: 'Room ID and message text are required.' });
      return;
    }

    const messagePayload = {
      // id: uuidv4(), // Generate a unique ID for the message if not done by client or if needed for specific features
      user: { // Reconstruct user object for payload consistency
        id: user.id,
        name: user.name,
        avatarUrl: user.avatarUrl 
      },
      text: String(text).trim(),
      timestamp: new Date().toISOString(),
      roomId: roomId, 
    };

    // Broadcast the new message to all clients in the specified room
    io.to(roomId).emit('newMessageFromServer', messagePayload);
    console.log(`Message from ${user.name} in room ${roomId}: ${text}`);

    // Optional: Persist message to database here if implemented
  });
  
  // Handler for client requesting past messages (if implementing later with persistence)
  socket.on('requestPastMessages', ({ roomId }) => {
     if (!roomId) {
      socket.emit('chatError', { message: 'Room ID is required to fetch messages.' });
      return;
    }
    // TODO: Implement fetching past messages from a database if persistence is added.
    // For now, acknowledge or send an empty array.
    console.log(`User ${socket.user?.name} requested past messages for room ${roomId}. Persistence not implemented.`);
    // Emit an object with roomId and messages array, as expected by client
    socket.emit('loadInitialMessages', { roomId, messages: [] }); 
  });


  // Handler for when a client wants to leave a chat room
  socket.on('leaveRoom', ({ roomId }) => {
    if (!roomId) {
      // Not critical to emit error, but good for debugging
      console.log(`Socket ${socket.id} tried to leave room without roomId.`);
      return;
    }
    socket.leave(roomId);
    console.log(`User ${socket.user?.name} (ID: ${socket.user?.id}, Socket: ${socket.id}) left room: ${roomId}`);
    
    // Optional: Notify others in the room that a user has left
    // socket.to(roomId).emit('userLeft', { userId: socket.user.id, userName: socket.user.name });
  });

  // Note: 'disconnect' event is handled in src/socketHandlers/index.js
  // It can also be used to trigger cleanup like leaving all rooms.
  socket.on('disconnecting', () => {
    // socket.rooms is a Set which includes the socket's own ID as a room.
    // Iterate over rooms and emit 'leaveRoom' or 'userLeft' if needed.
    // For each room the socket is in (excluding its own ID room):
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        // console.log(`User ${socket.user?.name} auto-left room ${room} on disconnect`);
        // socket.to(room).emit('userLeft', { userId: socket.user?.id, userName: socket.user?.name, roomId: room });
      }
    }
  });
};

export default registerChatHandlers;
