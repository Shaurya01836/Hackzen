const { Schema } = require('mongoose');

const ProjectSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  repoLink: String,
  websiteLink: String,
  videoLink: String,
  socialLinks: [String],
  logo: {
    url: { type: String, default: "" },
    publicId: { type: String, default: "" }
  },
  category: {
    type: String,
    enum: [
      'AI/ML', 'Blockchain', 'Fintech', 'DevTools', 'Education',
      'HealthTech', 'Sustainability', 'Gaming', 'Productivity', 'Other'
    ],
    required: true
  },
  customCategory: String,

  team: { type: Schema.Types.ObjectId, ref: 'Team' },
  submittedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  hackathon: { type: Schema.Types.ObjectId, ref: 'Hackathon' }, // ✅ now optional

  scores: [{ type: Schema.Types.ObjectId, ref: 'Score' }],
  status: { type: String, enum: ['draft', 'submitted', 'reviewed'], default: 'draft' },
  submittedAt: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = { ProjectSchema };
