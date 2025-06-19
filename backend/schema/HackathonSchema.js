const { Schema } = require('mongoose');

const HackathonSchema = new Schema({
  title: { type: String, required: true },
  description: String,

  image: {
    type: String, // URL to hosted image or Cloudinary/public asset
    required: false
  },

  organizer: { type: Schema.Types.ObjectId, ref: 'User', required: true },

  category: {
    type: String,
    enum: [
  'Artificial Intelligence', 'Blockchain', 'Cybersecurity',
  'FinTech', 'Gaming', 'Healthcare', 'Sustainability',
  'Mobile Development', 'Web Development', 'IoT', 'Data Science', 'DevOps'
],
    required: true
  },

  difficultyLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },

  location: { type: String }, // Virtual, City, etc.

  // Dates
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  registrationDeadline: { type: Date, required: true },
  submissionDeadline: { type: Date }, // optional but recommended

  maxParticipants: { type: Number, default: 100 },

  problemStatements: [String],
  requirements: [String],
  perks: [String],
  tags: [String],

  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  mentors: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  judges: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  teams: [{ type: Schema.Types.ObjectId, ref: 'Team' }],
  submissions: [{ type: Schema.Types.ObjectId, ref: 'Project' }],

  chatRoom: { type: Schema.Types.ObjectId, ref: 'ChatRoom' },

  mode: {
    type: String,
    enum: ['online', 'offline', 'hybrid'],
    default: 'online'
  },

  prizePool: {
    amount: { type: Number },
    currency: { type: String, default: 'USD' },
    breakdown: { type: String }
  },

  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'ended'],
    default: 'upcoming'
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = HackathonSchema;
