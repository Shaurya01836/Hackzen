const express = require('express');
const router = express.Router();
const controller = require('../controllers/submissionHistoryController');
const { protect } = require('../middleware/authMiddleware');
const { validateSubmissionInput } = require('../middleware/validators');

// 📥 Create new submission history entry
router.post('/', protect, validateSubmissionInput, controller.createSubmissionHistory);

// 📄 Get all versions for a project
router.get('/project/:projectId', protect, controller.getSubmissionHistoryByProject);

// 🆕 Get the latest version of a project
router.get('/latest/:projectId', protect, controller.getLatestSubmissionByProject);

// 📄 Get a specific version by ID
router.get('/:id', protect, controller.getSubmissionHistoryById);

// 🗑️ Delete a version (admin or project owner ideally)
router.delete('/:id', protect, controller.deleteSubmissionHistory);

module.exports = router;
