const { model } = require('mongoose');

const { BadgeSchema } = require('../schema/BadgeSchema');

const BadgeModel = new model("user", BadgeSchema);

module.exports = { BadgeModel };