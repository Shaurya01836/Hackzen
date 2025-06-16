const { Schema } = require("mongoose");

const SubmissionHistorySchema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
  version: Number,
  repoSnapshot: String,
  changes: String,
  submittedAt: Date
});

module.exports = { SubmissionHistorySchema };