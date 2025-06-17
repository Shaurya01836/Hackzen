const express = require('express');
const router = express.Router();
const {
  createHackathon,
  getAllHackathons,
  getHackathonById,
  updateHackathon,
  deleteHackathon
} = require('../controllers/hackathonController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createHackathon);
router.get('/', getAllHackathons);
router.get('/:id', getHackathonById);
router.put('/:id', protect, updateHackathon);
router.delete('/:id', protect, deleteHackathon);

module.exports = router;
