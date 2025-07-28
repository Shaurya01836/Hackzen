const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const scoreController = require("../controllers/scoreController");

router.post("/", protect, scoreController.createOrUpdateScore);
router.post("/submissions-scores", protect, scoreController.getScoresForSubmissions);
router.get("/submission/:submissionId", protect, scoreController.getScoresForSubmission);
router.get("/my-score/:submissionId", protect, scoreController.getMyScoreForSubmission);
router.get("/hackathon/:hackathonId", protect, scoreController.getSubmissionsToScore);
router.get("/my-scored-submissions", protect, scoreController.getMyScoredSubmissions);
router.get("/all/hackathon/:hackathonId", protect, scoreController.getAllScoresForHackathon);

module.exports = router;
