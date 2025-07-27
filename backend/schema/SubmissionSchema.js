const { Schema } = require('mongoose');

const SubmissionSchema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project' }, // not required for all rounds
  hackathonId: { type: Schema.Types.ObjectId, ref: 'Hackathon', required: true },
  submittedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  roundIndex: { type: Number }, // index in hackathon.rounds
  pptFile: { type: String }, // URL to uploaded PPT file
  quizAnswers: [
    {
      questionId: { type: String },
      answer: { type: String },
    },
  ],
  submittedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['submitted', 'reviewed', 'shortlisted', 'rejected', 'winner'], default: 'submitted' },
  shortlistedAt: { type: Date }, // When the submission was shortlisted
  shortlistedForRound: { type: Number }, // Which round the submission was shortlisted for (e.g., 2 for Round 2)
  problemStatement: { type: String },
  customAnswers: [
    {
      questionId: { type: String },
      answer: { type: String },
    },
  ],
  selectedMembers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  likes: { type: Number, default: 0 },
  likedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  views: { type: Number, default: 0 },
  viewedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  teamId: { type: Schema.Types.ObjectId, ref: 'Team' },
  teamName: { type: String },
  // Score fields for Round 2
  pptScore: { type: Number, default: 0 },
  projectScore: { type: Number, default: 0 },
  combinedScore: { type: Number, default: 0 },
});

module.exports = { SubmissionSchema }; 