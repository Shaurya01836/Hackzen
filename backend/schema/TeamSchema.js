const { Schema } = require('mongoose');

const TeamSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  teamCode: { type: String, unique: true, required: true }, // Unique team code for invites
  maxMembers: { type: Number, default: 4, min: 1, max: 10 },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  leader: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  hackathon: { type: Schema.Types.ObjectId, ref: 'Hackathon' }, // Optional - can be for projects
  mentor: { type: Schema.Types.ObjectId, ref: 'User' }, // Optional
  project: { type: Schema.Types.ObjectId, ref: 'Project' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

// Generate unique team code before saving
TeamSchema.pre('save', async function(next) {
  if (this.isNew && !this.teamCode) {
    const crypto = require('crypto');
    this.teamCode = crypto.randomBytes(4).toString('hex').toUpperCase();
  }
  next();
});

module.exports = { TeamSchema };