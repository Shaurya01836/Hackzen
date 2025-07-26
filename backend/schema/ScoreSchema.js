const mongoose = require("mongoose");
const { Schema } = mongoose;

const ScoreSchema = new Schema({
  submission: { type: Schema.Types.ObjectId, ref: "Submission", required: true },
  judge: { type: Schema.Types.ObjectId, ref: "User", required: true },
  roundIndex: { type: Number, required: true },
  submissionType: { type: String, enum: ['project', 'presentation'], required: true },
  scores: {
    type: Map,
    of: {
      score: { type: Number, min: 0, required: true },
      maxScore: { type: Number, required: true },
      weight: { type: Number, default: 1 }
    }
  },
  totalScore: { type: Number, required: true },
  feedback: { type: String },
  createdAt: { type: Date, default: Date.now }
});


module.exports ={ ScoreSchema};
