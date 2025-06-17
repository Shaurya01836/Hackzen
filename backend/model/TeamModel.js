const mongoose = require('mongoose');
const { TeamSchema } = require('../schema/TeamSchema');

const Team = mongoose.models.Team || mongoose.model('Team', TeamSchema);
module.exports = Team;
