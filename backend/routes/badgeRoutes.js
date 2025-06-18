const express = require('express');
const router = express.Router();
const controller = require('../controllers/badgeController');
const { protect, isAdmin } = require('../middleware/authMiddleware');
const { validateBadgeInput } = require('../middleware/validators');

// 🟢 Admin: Create a new badge
router.post('/', protect, isAdmin, validateBadgeInput, controller.createBadge);

// 🔍 Public: Get all badges
router.get('/', controller.getAllBadges);

// 📄 Get a single badge
router.get('/:id', controller.getBadgeById);

// 🗑️ Admin: Delete a badge
router.delete('/:id', protect, isAdmin, controller.deleteBadge);

// 🎖️ Admin: Assign badge to user
router.post('/assign', protect, isAdmin, controller.assignBadgeToUser);

module.exports = router;
