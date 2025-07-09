const mongoose = require("mongoose");
const { Schema } = mongoose;

const ScoreSchema = new Schema({
  project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  hackathon: { type: Schema.Types.ObjectId, ref: "Hackathon", required: true },
  judge: { type: Schema.Types.ObjectId, ref: "User", required: true },

  scores: {
    innovation: { type: Number, min: 0, max: 10, required: true },
    impact: { type: Number, min: 0, max: 10, required: true },
    technicality: { type: Number, min: 0, max: 10, required: true },
    presentation: { type: Number, min: 0, max: 10, required: true },
  },
  
  feedback: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports ={ ScoreSchema};
