const { Schema } = require("mongoose");

const ChatRoomSchema = new Schema({
  hackathon: { type: Schema.Types.ObjectId, ref: 'Hackathon', required: true },
  team: { type: Schema.Types.ObjectId, ref: 'Team' },
  type: { type: String, enum: ['general', 'team', 'mentor'], required: true },
  name: { type: String }, // ✅ NEW
  description: { type: String }, // ✅ NEW
  unreadCount: { type: Number, default: 0 }, // ✅ Optional (for future use)
  createdAt: { type: Date, default: Date.now }
});

module.exports = { ChatRoomSchema };
