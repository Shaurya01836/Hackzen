const { Schema } = require("mongoose");

const ChatRoomSchema = new Schema({
  hackathon: { type: Schema.Types.ObjectId, ref: 'Hackathon' },
  team: { type: Schema.Types.ObjectId, ref: 'Team' },
  type: { type: String, enum: ['general', 'team', 'mentor'] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = { ChatRoomSchema };
