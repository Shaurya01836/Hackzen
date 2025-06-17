const express = require('express');
const router = express.Router();
const User = require('../model/UserModel');
const Team = require('../model/TeamModel');

router.get('/users', async (req, res) => {
try {
const users = await User.find();
res.json(users);
} catch (err) {
res.status(500).json({ error: 'Failed to fetch users' });
}
});

router.get('/teams', async (req, res) => {
try {
const teams = await Team.find();
res.json(teams);
} catch (err) {
res.status(500).json({ error: 'Failed to fetch teams' });
}
});

module.exports = router;