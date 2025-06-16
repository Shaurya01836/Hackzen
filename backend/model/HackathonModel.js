const { model } = require('mongoose');

const { HackathonSchema } = require('../schema/HackathonSchema');

const HackathonModel = new model("user", HackathonSchema);

module.exports = { HackathonModel };
