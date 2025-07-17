const mongoose = require('mongoose');
const { Schema } = mongoose;

const JudgeAssignmentSchema = new Schema({
  hackathon: {
    type: Schema.Types.ObjectId,
    ref: 'Hackathon',
    required: true
  },
  
  // Judge information
  judge: {
    email: { type: String, required: true },
    name: { type: String },
    type: {
      type: String,
      enum: ['platform', 'sponsor', 'hybrid'],
      default: 'platform'
    },
    sponsorCompany: { type: String }, // Only for sponsor judges
    canJudgeSponsoredPS: { type: Boolean, default: false }, // For platform judges who can also judge sponsored PS
    isActive: { type: Boolean, default: true }
  },

  // Problem Statement assignments
  assignedProblemStatements: [{
    problemStatementId: { type: String, required: true }, // Reference to problem statement
    problemStatement: { type: String, required: true }, // The actual problem statement text
    type: { type: String, required: true }, // 'general' or 'sponsored'
    sponsorCompany: { type: String }, // For sponsored problem statements
    isAssigned: { type: Boolean, default: true }
  }],

  // Round assignments (for multi-round hackathons)
  assignedRounds: [{
    roundIndex: { type: Number, required: true },
    roundName: { type: String, required: true },
    roundType: { type: String, required: true }, // 'project', 'pitch', 'quiz', etc.
    isAssigned: { type: Boolean, default: true }
  }],

  // Judge permissions and settings
  permissions: {
    canJudgeGeneralPS: { type: Boolean, default: true },
    canJudgeSponsoredPS: { type: Boolean, default: false },
    canJudgeAllRounds: { type: Boolean, default: true },
    maxSubmissionsPerJudge: { type: Number, default: 50 }
  },

  // Assignment metadata
  assignedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  },

  // Status tracking
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'removed'],
    default: 'pending'
  },

  // Performance metrics
  metrics: {
    totalSubmissionsJudged: { type: Number, default: 0 },
    averageScoreGiven: { type: Number, default: 0 },
    totalTimeSpent: { type: Number, default: 0 }, // in minutes
    lastJudgmentAt: { type: Date }
  },

  // Invitation tracking
  invitation: {
    sentAt: { type: Date },
    acceptedAt: { type: Date },
    declinedAt: { type: Date },
    reminderSentAt: { type: Date }
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
JudgeAssignmentSchema.index({ hackathon: 1, 'judge.email': 1 });
JudgeAssignmentSchema.index({ 'judge.type': 1, status: 1 });
JudgeAssignmentSchema.index({ 'assignedProblemStatements.problemStatementId': 1 });

// Virtual for checking if judge can judge a specific problem statement
JudgeAssignmentSchema.virtual('canJudgeProblemStatement').get(function(problemStatementType, sponsorCompany) {
  if (problemStatementType === 'general') {
    return this.permissions.canJudgeGeneralPS;
  } else if (problemStatementType === 'sponsored') {
    if (this.judge.type === 'sponsor') {
      return this.judge.sponsorCompany === sponsorCompany;
    } else if (this.judge.type === 'hybrid') {
      return this.permissions.canJudgeSponsoredPS;
    } else if (this.judge.type === 'platform' && this.judge.canJudgeSponsoredPS) {
      return this.permissions.canJudgeSponsoredPS;
    }
  }
  return false;
});

module.exports = JudgeAssignmentSchema; 