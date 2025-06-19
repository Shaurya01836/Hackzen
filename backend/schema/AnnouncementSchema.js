const { Schema } = require("mongoose");

const AnnouncementSchema = new Schema({
  hackathon: { type: Schema.Types.ObjectId, ref: 'Hackathon', required: false }, // optional for global
  title: { type: String, required: true },
  message: { type: String, required: true },
  postedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  audience: {
    type: String,
    enum: ['all', 'organizers', 'participants', 'mentors'],
    default: 'all',
  },
  type: {
    type: String,
    enum: ['general', 'reminder', 'alert'],
    default: 'general'
  },
  createdAt: { type: Date, default: Date.now },
  visibleUntil: { type: Date }
});

module.exports = { AnnouncementSchema };
