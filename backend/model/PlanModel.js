const mongoose = require('mongoose');
const { PlanSchema } = require('../schema/PlanSchema');

const Plan = mongoose.models.Plan || mongoose.model('Plan', PlanSchema);
module.exports = Plan;
