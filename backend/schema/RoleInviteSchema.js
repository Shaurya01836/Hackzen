const { Schema } = require('mongoose');

const RoleInviteSchema = new Schema({
  email: { type: String, required: true },
  hackathon: { type: Schema.Types.ObjectId, ref: 'Hackathon', required: true },
  role: { type: String, enum: ['judge', 'mentor'], required: true },
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
  token: { type: String, required: true, unique: true },
  sentAt: { type: Date, default: Date.now },
  respondedAt: { type: Date },
  invitedUser: { type: Schema.Types.ObjectId, ref: 'User' },
});

module.exports = { RoleInviteSchema }; 