const Notification = require('../model/NotificationModel');

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log('🟢 User connected:', socket.id);

    // ✅ User joins personal room based on their userId
    socket.on('registerUser', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their personal notification room`);
    });

    // ✅ Send real-time notification to a user
    socket.on('sendNotification', async ({ recipientId, message, type = 'info' }) => {
      try {
        const notification = await Notification.create({
          recipient: recipientId,
          message,
          type
        });

        io.to(recipientId).emit('receiveNotification', notification); // push to user's room
      } catch (err) {
        console.error('Failed to send notification:', err.message);
        socket.emit('errorMessage', 'Notification failed');
      }
    });

    // 💬 Existing chat logic...
    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
      console.log(`User joined chat room ${roomId}`);
    });

    socket.on('sendMessage', async ({ roomId, senderId, content }) => {
      try {
        const message = await Message.create({ chatRoom: roomId, sender: senderId, content });
        const populated = await message.populate('sender', 'name role');
        io.to(roomId).emit('receiveMessage', populated);
      } catch (err) {
        socket.emit('errorMessage', 'Message failed');
      }
    });

    socket.on('disconnect', () => {
      console.log('🔴 Disconnected:', socket.id);
    });
  });
};

module.exports = socketHandler;
