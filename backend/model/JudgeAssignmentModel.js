const mongoose = require('mongoose');
const JudgeAssignmentSchema = require('../schema/JudgeAssignmentSchema');

const JudgeAssignment = mongoose.model('JudgeAssignment', JudgeAssignmentSchema);

module.exports = JudgeAssignment; 