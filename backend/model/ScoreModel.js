const { model } = require('mongoose');

const { ScoreSchema } = require('../schema/ScoreSchema');

const ScoreModel = new model("user", ScoreSchema);

module.exports = { ScoreModel };