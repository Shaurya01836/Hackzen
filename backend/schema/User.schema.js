const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  authProvider: { type: String, enum: ['email', 'github', 'google'] },
  githubUsername: String,
  profileImage: String,
  role: {
    type: String,
    enum: ['participant', 'organizer', 'mentor', 'judge', 'admin'],
    default: 'participant'
  },
  skills: [String],
  badges: [{ type: Schema.Types.ObjectId, ref: 'Badge' }],
  hackathonsJoined: [{ type: Schema.Types.ObjectId, ref: 'Hackathon' }],
  projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = userSchema;
