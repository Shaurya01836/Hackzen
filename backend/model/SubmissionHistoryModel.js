const mongoose = require('mongoose');
const { SubmissionHistorySchema } = require('../schema/SubmissionHistorySchema');

const SubmissionHistory = mongoose.models.SubmissionHistory || mongoose.model('SubmissionHistory', SubmissionHistorySchema);
module.exports = SubmissionHistory;
