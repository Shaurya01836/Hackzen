const { Schema } = require('mongoose');

const ProjectSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  repoLink: { type: String, required: true },
  videoLink: String,
  team: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  submittedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  hackathon: { type: Schema.Types.ObjectId, ref: 'Hackathon' },
  scores: [{ type: Schema.Types.ObjectId, ref: 'Score' }],
  status: {
    type: String,
    enum: ['draft', 'submitted', 'reviewed'],
    default: 'draft'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = { ProjectSchema };
