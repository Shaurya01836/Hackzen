const { model } = require('mongoose');

const { TeamSchema } = require('../schema/TeamSchema');

const TeamModel = new model("team", TeamSchema);

module.exports = { TeamModel };
