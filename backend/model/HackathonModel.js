const mongoose = require('mongoose');
const hackathonSchema = require('../schema/Hackathon.schema');

module.exports = mongoose.model('Hackathon', hackathonSchema);
