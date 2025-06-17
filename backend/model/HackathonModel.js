const mongoose = require('mongoose');
const HackathonSchema = require('../schema/HackathonSchema');

const Hackathon = mongoose.models.Hackathon || mongoose.model('Hackathon', HackathonSchema);
module.exports = Hackathon;