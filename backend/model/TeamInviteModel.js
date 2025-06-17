const mongoose = require('mongoose');
const { TeamInviteSchema } = require('../schema/TeamInviteSchema');

const TeamInvite = mongoose.models.TeamInvite || mongoose.model('TeamInvite', TeamInviteSchema);
module.exports = TeamInvite;
