const express = require('express');
const router = express.Router();
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  submitProject,
  assignHackathonToProject,
  getMyProjects,
  getProjectsByHackathon,
  likeProject
} = require('../controllers/projectController');

const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createProject);
router.get('/mine', protect, getMyProjects); // ✅ must be before :id
router.get('/hackathon/:hackathonId', getProjectsByHackathon); // ✅ must be before :id
router.get('/', getAllProjects);
router.get('/:id', getProjectById);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);
router.put('/:id/submit', protect, submitProject);
router.put('/:id/assign-hackathon', protect, assignHackathonToProject);
router.patch('/:id/like', protect, likeProject);

module.exports = router;