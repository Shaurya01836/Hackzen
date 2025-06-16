
const mongoose = require('mongoose');
const teamSchema = require('../schema/Team.schema');

module.exports = mongoose.model('Team', teamSchema);
