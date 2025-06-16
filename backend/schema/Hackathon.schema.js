const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hackathonSchema = new Schema({
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
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'ended'],
    default: 'upcoming'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = hackathonSchema;
