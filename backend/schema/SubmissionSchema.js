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
  status: { type: String, enum: ['submitted', 'reviewed'], default: 'submitted' },
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
});

module.exports = { SubmissionSchema }; 