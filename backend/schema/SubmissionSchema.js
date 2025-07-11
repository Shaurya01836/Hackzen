const { Schema } = require('mongoose');

const SubmissionSchema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  hackathonId: { type: Schema.Types.ObjectId, ref: 'Hackathon', required: true },
  submittedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  submittedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['submitted', 'reviewed'], default: 'submitted' },
  problemStatement: { type: String },
  customAnswers: [
    {
      questionId: { type: String },
      answer: { type: String },
    },
  ],
});

module.exports = { SubmissionSchema }; 