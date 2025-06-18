// config/socket.js
const Message = require('../model/MessageModel');

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log('🟢 A user connected:', socket.id);

    // Join a room
    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
      console.log(`User joined room ${roomId}`);
    });

    // Handle sending a message
    socket.on('sendMessage', async ({ roomId, senderId, content }) => {
      try {
        const message = await Message.create({
          chatRoom: roomId,
          sender: senderId,
          content
        });

        const populatedMessage = await message.populate('sender', 'name role');

        // Emit to everyone in that room
        io.to(roomId).emit('receiveMessage', populatedMessage);
      } catch (error) {
        console.error('Socket sendMessage error:', error.message);
        socket.emit('errorMessage', 'Failed to send message');
      }
    });

    socket.on('disconnect', () => {
      console.log('🔴 A user disconnected:', socket.id);
    });
  });
};

module.exports = socketHandler;
