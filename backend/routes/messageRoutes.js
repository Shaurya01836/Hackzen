// routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getMessagesByRoom,
  sendMessage
} = require('../controllers/messageController');

// Get all messages for a chat room
router.get('/:roomId', protect, getMessagesByRoom);

// Send a message to a room
router.post('/:roomId', protect, sendMessage);

module.exports = router;
