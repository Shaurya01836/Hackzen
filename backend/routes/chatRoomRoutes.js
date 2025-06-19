const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/authMiddleware');
const {
  createChatRoom,
  getHackathonRooms,
  getGeneralRoom
} = require('../controllers/chatRoomController');

// ✅ Health check route for testing
router.get('/ping', (req, res) => {
  res.json({ message: '✅ chatRoomRoutes working' });
});

// ✅ Unprotected test route (use for Postman/dev testing only)
router.post('/test', createChatRoom);

// ✅ Admin-only route to create a chat room (secure production use)
router.post('/', protect, isAdmin, createChatRoom);

// ✅ Get all chat rooms for a specific hackathon
router.get('/hackathon/:hackathonId', protect, getHackathonRooms);

// ✅ Get the general/public chat room for a hackathon
router.get('/hackathon/:hackathonId/general', protect, getGeneralRoom);

module.exports = router;
