const mongoose = require('mongoose');
const { ScoreSchema } = require('../schema/ScoreSchema');

const Score = mongoose.models.Score || mongoose.model('Score', ScoreSchema);
module.exports = Score;
