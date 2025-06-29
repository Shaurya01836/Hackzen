const { Schema } = require("mongoose");

const TeamInviteSchema = new Schema({
  team: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  invitedUser: { type: Schema.Types.ObjectId, ref: 'User' },
  invitedEmail: { type: String, required: true },
  invitedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  hackathon: { type: Schema.Types.ObjectId, ref: 'Hackathon', required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending'
  },
  sentAt: { type: Date, default: Date.now },
  respondedAt: { type: Date }
});

module.exports = { TeamInviteSchema };