const express = require('express');
const router = express.Router();
const controller = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const { validateProjectInput } = require('../middleware/validators');

// 🔽 Create new project (draft or submitted)
router.post('/', protect, validateProjectInput, controller.createProject);

// 📄 Get all projects (optionally by hackathon/team)
router.get('/', controller.getAllProjects);

// 📄 Get single project
router.get('/:id', controller.getProjectById);

// ✏️ Update a project (only by submitter)
router.put('/:id', protect, controller.updateProject);

// ❌ Delete a project (admin or creator)
router.delete('/:id', protect, controller.deleteProject);

module.exports = router;
