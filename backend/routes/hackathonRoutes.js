const express = require('express');
const router = express.Router();
const {
  createHackathon,
  getAllHackathons,
  getHackathonById,
  updateHackathon,
  deleteHackathon
} = require('../controllers/hackathonController');
const { protect, isOrganizerOrAdmin } = require('../middleware/authMiddleware');

// 🛡️ Organizer or Admin required to create/update/delete
router.post('/', protect, isOrganizerOrAdmin, createHackathon);
router.put('/:id', protect, isOrganizerOrAdmin, updateHackathon);
router.delete('/:id', protect, isOrganizerOrAdmin, deleteHackathon);

// 🆓 Public routes
router.get('/', getAllHackathons);
router.get('/:id', getHackathonById);

module.exports = router;
