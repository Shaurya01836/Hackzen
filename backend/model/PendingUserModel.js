const mongoose = require('mongoose');

const PendingUserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  verificationCode: { type: String, required: true },
  codeExpiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  role: { type: String, enum: ['participant', 'organizer', 'mentor', 'judge', 'admin'], default: 'participant' }
});

const PendingUser = mongoose.models.PendingUser || mongoose.model('PendingUser', PendingUserSchema);
module.exports = PendingUser; 