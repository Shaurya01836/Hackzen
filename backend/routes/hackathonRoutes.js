const express = require('express');
const router = express.Router();

const {
  createHackathon,
  getAllHackathons,
  getHackathonById,
  updateHackathon,
  deleteHackathon,
  updateApprovalStatus,
  getAllHackathonsRaw,
  getMyHackathons, // ✅ ADD THIS
  sendCertificates // <-- add this
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

// ✅ Admin Dashboard Routes
router.get('/admin/stats', protect, isAdmin, require('../controllers/hackathonController').getHackathonStats);
router.get('/admin/monthly-stats', protect, isAdmin, require('../controllers/hackathonController').getMonthlyHackathonStats);
router.get('/admin/category-breakdown', protect, isAdmin, require('../controllers/hackathonController').getCategoryBreakdown);
router.get('/admin/status-breakdown', protect, isAdmin, require('../controllers/hackathonController').getHackathonStatusBreakdown);

// Organizer-only route: get hackathons created by logged-in organizer
router.get('/my', protect, getMyHackathons); 

// Organizer/Admin: Mark which participants advance to a round
router.patch('/:id/round-advancement', protect, isOrganizerOrAdmin, require('../controllers/hackathonController').markRoundAdvancement);

// Add: Send certificates to registered participants
router.post('/:hackathonId/send-certificates', protect, isOrganizerOrAdmin, sendCertificates);

// 🆓 Public routes
router.get('/', getAllHackathons);
router.get('/:id', getHackathonById);

module.exports = router; // ✅ this was already correct
