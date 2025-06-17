const express = require('express');
const router = express.Router();
const { createHackathon } = require('../controllers/hackathon.controller');
const { protect } = require('../middleware/authMiddleware'); // checks if user is logged in

router.post('/', protect, createHackathon); // POST /api/hackathons

module.exports = router;
