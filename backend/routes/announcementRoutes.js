// routes/announcementRoutes.js
const express = require('express');
const router = express.Router();
const { sendAnnouncement, getAnnouncements } = require('../controllers/announcementController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.post('/send', protect, isAdmin, sendAnnouncement);
// GET = Any user fetches visible announcements
router.get('/', protect, getAnnouncements);
module.exports = router;
