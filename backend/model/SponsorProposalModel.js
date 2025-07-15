const mongoose = require('mongoose');
const { Schema } = mongoose;

const SponsorProposalSchema = new Schema({
  hackathon: { type: Schema.Types.ObjectId, ref: 'Hackathon', required: true },
  // Basic Info
  name: { type: String, required: true },
  email: { type: String, required: true },
  organization: { type: String, required: true },
  website: { type: String },
  // Proposal Details
  title: { type: String, required: true },
  description: { type: String, required: true },
  deliverables: { type: String, required: true },
  techStack: { type: String, required: true },
  // Target Audience
  targetAudience: { type: String, required: true },
  // Prize
  prizeAmount: { type: String, required: true },
  prizeDescription: { type: String, required: true },
  // Judging Preferences
  provideJudges: { type: String, required: true }, // 'yes' or 'no'
  judgeName: { type: String },
  judgeEmail: { type: String },
  judgeRole: { type: String },
  // Timeline
  customStartDate: { type: Date },
  customDeadline: { type: Date },
  // Additional Notes
  notes: { type: String },
  // Status
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  reviewMessage: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SponsorProposal', SponsorProposalSchema); 