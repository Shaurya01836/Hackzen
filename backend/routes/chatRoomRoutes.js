// routes/chatRoomRoutes.js
const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/authMiddleware');
const {
  createChatRoom,
  getHackathonRooms,
  getGeneralRoom
} = require('../controllers/chatRoomController');

// Admin can manually create chat rooms
router.post('/', protect, isAdmin, createChatRoom);

// Get all rooms of a hackathon (e.g., for community tab)
router.get('/hackathon/:hackathonId', protect, getHackathonRooms);

// Get the public general room for a hackathon
router.get('/hackathon/:hackathonId/general', protect, getGeneralRoom);

module.exports = router;
