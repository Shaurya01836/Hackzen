const express = require('express');
const router = express.Router();
const controller = require('../controllers/scoreController');
const { protect } = require('../middleware/authMiddleware');
const { validateScoreInput } = require('../middleware/validators');

// 🎯 Submit a score
router.post('/', protect, validateScoreInput, controller.submitScore);

// 📄 Get all scores for a project
router.get('/project/:projectId', protect, controller.getScoresByProject);

// 📄 Get scores submitted by a judge
router.get('/judge/:judgeId', protect, controller.getScoresByJudge);

// ❌ Delete a score (admin or judge)
router.delete('/:id', protect, controller.deleteScore);

module.exports = router;
