const { Schema } = require('mongoose');

const HackathonSchema = new Schema({
  title: { type: String, required: true },
  description: String,

  image: {
    type: String, // optional main thumbnail (can also use banner in images)
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

  location: { type: String },

  // Dates
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  registrationDeadline: { type: Date, required: true },
  submissionDeadline: { type: Date },

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

  // Lifecycle status of hackathon
  status: {
    type: String,
    enum: ['draft', 'submitted', 'approved', 'upcoming', 'ongoing', 'ended'],
    default: 'draft'
  },

  // Media
  images: {
    banner: {
      url: String,
      publicId: String
    },
    logo: {
      url: String,
      publicId: String
    },
    gallery: [
      {
        url: String,
        publicId: String
      }
    ]
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = HackathonSchema;
