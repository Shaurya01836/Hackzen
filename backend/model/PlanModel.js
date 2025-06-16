const { model } = require('mongoose');

const { PlanSchema } = require('../schema/PlanSchema');

const PlanModel = new model("user", PlanSchema);

module.exports = { PlanModel };