const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
  proposal: { type: mongoose.Schema.Types.ObjectId, ref: 'SponsorProposal', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  sentAt: { type: Date, default: Date.now },
  deletedFor: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who deleted for themselves
  edited: { type: Boolean, default: false },
  editedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('ChatMessage', ChatMessageSchema); 