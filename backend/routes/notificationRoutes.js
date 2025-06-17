const express = require('express');
const router = express.Router();
const controller = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');
const { validateNotificationInput } = require('../middleware/validators');

// 📩 Create a notification
router.post('/', protect, validateNotificationInput, controller.createNotification);

// 🔔 Get notifications for the logged-in user
router.get('/me', protect, controller.getMyNotifications);

// ✅ Mark a notification as read
router.put('/:id/read', protect, controller.markAsRead);

// ❌ Delete a notification
router.delete('/:id', protect, controller.deleteNotification);

module.exports = router;
