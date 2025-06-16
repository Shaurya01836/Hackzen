const mongoose = require('mongoose');
const projectSchema = require('../schema/Project.schema');

module.exports = mongoose.model('Project', projectSchema);
