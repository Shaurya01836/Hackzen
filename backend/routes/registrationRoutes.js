const express = require("express");
const { registerForHackathon } = require("../controllers/registrationController");
const { isAuthenticated } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", isAuthenticated, registerForHackathon);

module.exports = router;