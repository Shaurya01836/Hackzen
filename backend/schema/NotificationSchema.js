const { Schema } = require("mongoose");

const NotificationSchema = new Schema({
  recipient: { type: Schema.Types.ObjectId, ref: 'User' },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ['info', 'warning', 'success', 'announcement'],
    required: true
  },
  hackathon: { type: Schema.Types.ObjectId, ref: 'Hackathon' }, // optional
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});


module.exports = { NotificationSchema };
