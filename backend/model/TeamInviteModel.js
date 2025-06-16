const { model } = require('mongoose');

const { TeamInviteSchema } = require('../schema/TeamInviteSchema');

const TeamInviteModel = new model("user", TeamInviteSchema);

module.exports = { TeamInviteModel };