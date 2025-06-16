const { Schema } = require("mongoose");

const ScoreSchema = new Schema({
  project: { type: Schema.Types.ObjectId, ref: 'Project' },
  judge: { type: Schema.Types.ObjectId, ref: 'User' },
  criteria: String,
  score: Number,
  feedback: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = { ScoreSchema };