const { Schema } = require("mongoose");

const NotificationSchema = new Schema({
  recipient: { type: Schema.Types.ObjectId, ref: 'User' },
  sender: { type: Schema.Types.ObjectId, ref: 'User' }, // NEW: sender of the notification
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ['info', 'warning', 'success', 'announcement', 'team-invite'], // add 'team-invite'
    required: true
  },
  hackathon: { type: Schema.Types.ObjectId, ref: 'Hackathon' }, // optional
  team: { type: Schema.Types.ObjectId, ref: 'Team' }, // NEW: team reference
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' }, // NEW: status for invite
  link: { type: String }, // NEW: link to accept/decline
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});


module.exports = { NotificationSchema };
