const { model } = require('mongoose');

const { ProjectSchema } = require('../schema/ProjectSchema');

const ProjectModel = new model("user", ProjectSchema);

module.exports = { ProjectModel };
