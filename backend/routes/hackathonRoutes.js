const express = require('express');
const router = express.Router();

const {
  createHackathon,
  getAllHackathons,
  getHackathonById,
  updateHackathon,
  deleteHackathon,
  updateApprovalStatus,
  getAllHackathonsRaw, // ✅ ADD THIS
} = require('../controllers/hackathonController');


const {
  protect,
  isOrganizerOrAdmin,
  isAdmin // ✅ correct name
} = require('../middleware/authMiddleware');

// 🛡️ Organizer or Admin required for creation/modification
router.post('/', protect, isOrganizerOrAdmin, createHackathon);
router.put('/:id', protect, isOrganizerOrAdmin, updateHackathon);
router.delete('/:id', protect, isOrganizerOrAdmin, deleteHackathon);

// ✅ Admin-only route for approving/rejecting hackathons
router.patch('/:id/approval', protect, isAdmin, updateApprovalStatus);
// ✅ Admin-only route to get all hackathons regardless of approval status
router.get('/all', protect, isAdmin, getAllHackathonsRaw);

// 🆓 Public routes
router.get('/', getAllHackathons);
router.get('/:id', getHackathonById);

module.exports = router; // ✅ this was already correct
