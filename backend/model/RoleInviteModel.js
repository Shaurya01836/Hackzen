const mongoose = require('mongoose');
const { RoleInviteSchema } = require('../schema/RoleInviteSchema');

const RoleInvite = mongoose.models.RoleInvite || mongoose.model('RoleInvite', RoleInviteSchema);
module.exports = RoleInvite; 