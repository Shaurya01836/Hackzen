const mongoose = require('mongoose');
const { BadgeSchema } = require('../schema/BadgeSchema');

const Badge = mongoose.models.Badge || mongoose.model('Badge', BadgeSchema);
module.exports = Badge;
