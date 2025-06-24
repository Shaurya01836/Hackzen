const express = require("express");
const { registerForHackathon } = require("../controllers/registrationController");
const { isAuthenticated } = require("../middleware/authMiddleware");

const router = express.Router();
const { getUserRegistrations } = require("../controllers/registrationController");

router.get("/my", isAuthenticated, getUserRegistrations);
router.post("/", isAuthenticated, registerForHackathon);

module.exports = router;
