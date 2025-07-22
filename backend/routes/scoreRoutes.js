const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const scoreController = require("../controllers/scoreController");

router.post("/", protect, scoreController.createOrUpdateScore);
router.get("/project/:projectId", protect, scoreController.getScoresForProject);
router.get("/hackathon/:hackathonId", protect, scoreController.getProjectsToScore);
router.get("/my-scored-projects", protect, scoreController.getMyScoredProjects);
router.get("/all/hackathon/:hackathonId", protect, scoreController.getAllScoresForHackathon);

module.exports = router;
