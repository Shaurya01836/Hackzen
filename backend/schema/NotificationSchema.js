const { Schema } = require("mongoose");

const NotificationSchema = new Schema({
  recipient: { type: Schema.Types.ObjectId, ref: 'User' },
  message: String,
  type: { type: String, enum: ['info', 'warning', 'success'] },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = { NotificationSchema };