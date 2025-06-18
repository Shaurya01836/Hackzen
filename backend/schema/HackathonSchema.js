const { Schema } = require('mongoose');

const HackathonSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },

  organizer: { type: Schema.Types.ObjectId, ref: 'User', required: true },

  problemStatements: [String],
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  mentors: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  judges: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  teams: [{ type: Schema.Types.ObjectId, ref: 'Team' }],
  submissions: [{ type: Schema.Types.ObjectId, ref: 'Project' }],

  chatRoom: { type: Schema.Types.ObjectId, ref: 'ChatRoom' },

  // 🆕 Mode of the hackathon
  mode: {
    type: String,
    enum: ['online', 'offline', 'hybrid'],
    default: 'online'
  },

  // 🆕 Prize pool / bounty information
  prizePool: {
    amount: { type: Number },           // in USD or INR
    currency: { type: String, default: 'USD' },
    breakdown: { type: String }         // optional text description
  },

  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'ended'],
    default: 'upcoming'
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = HackathonSchema;
