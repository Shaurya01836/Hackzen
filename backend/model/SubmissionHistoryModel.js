const { model } = require('mongoose');

const { SubmissionHistorySchema } = require('../schema/SubmissionHistorySchema');

const SubmissionHistoryModel = new model("user", SubmissionHistorySchema);

module.exports = { SubmissionHistoryModel };