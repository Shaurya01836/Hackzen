const mongoose = require('mongoose');
const { SubmissionSchema } = require('../schema/SubmissionSchema');

const Submission = mongoose.models.Submission || mongoose.model('Submission', SubmissionSchema);
module.exports = Submission; 