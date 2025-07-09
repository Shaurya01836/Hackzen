const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const scoreController = require("../controllers/scoreController");

router.post("/", protect, scoreController.createOrUpdateScore);
router.get("/project/:projectId", protect, scoreController.getScoresForProject);
router.get("/hackathon/:hackathonId", protect, scoreController.getProjectsToScore);

module.exports = router;
