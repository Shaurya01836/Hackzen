const { Schema } = require("mongoose");

const AnnouncementSchema = new Schema({
  hackathon: { type: Schema.Types.ObjectId, ref: 'Hackathon', required: true },
  message: { type: String, required: true },
  postedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['general', 'reminder', 'alert'],
    default: 'general'
  },
  createdAt: { type: Date, default: Date.now },
  visibleUntil: { type: Date } // Optional expiry
});

module.exports = { AnnouncementSchema };
