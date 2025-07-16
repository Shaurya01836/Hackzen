const mongoose = require('mongoose');
const { Schema } = mongoose;
const HackathonSchema = new Schema({
  title: { type: String, required: true },
  description: String,

  images: {
    banner: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" }
    },
    logo: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" }
    },
    gallery: [{
      url: { type: String, default: "" },
      publicId: { type: String, default: "" }
    }]
  },

  organizer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  organizerTelegram: { type: String }, // Organizer's Telegram handle

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
  submissionDeadline: { type: Date }, // optional

  maxParticipants: { type: Number, default: 100 },

  submissionType: { type: String, enum: ['single-project', 'multi-project'], default: 'single-project' },
  roundType: { type: String, enum: ['single-round', 'multi-round'], default: 'single-round' },

  problemStatements: [
    {
      statement: { type: String, required: true },
      type: { type: String, required: true }
    }
  ],
  problemStatementTypes: [String], // <-- NEW FIELD

    // ✅ New field for teamSize
  teamSize: {
    min: { type: Number, default: 1 },
    max: { type: Number, default: 1 },
    allowSolo: { type: Boolean, default: true }
  },

  rounds: [{ // <-- NEW FIELD
    name: { type: String },
    type: { type: String }, // <-- Added type field for round type
    description: { type: String },
    startDate: { type: Date },
    endDate: { type: Date }
  }],

  // Track which participants/teams advance per round
  roundProgress: [
    {
      roundIndex: { type: Number }, // index in rounds array
      advancedParticipantIds: [{ type: Schema.Types.ObjectId, ref: 'User' }], // or ref: 'Team' if team-based
    }
  ],

  requirements: [String],
  perks: [String],
  tags: [String],

  judges: [{ type: String }],       // Email strings
  mentors: [{ type: String }],      // Email strings
  participants: [{ type: String }],
  
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

  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  customForm: {
  questions: [
    {
      id: { type: String },
      text: { type: String },
      required: { type: Boolean, default: true },
    },
  ],
  terms: [
    {
      id: { type: String },
      text: { type: String },
    },
  ],
},
submittedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],

  // Maximum number of submissions allowed per participant
  maxSubmissionsPerParticipant: { type: Number, default: 1 },

  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'ended'],
    default: 'upcoming'
  },

  // Sponsored Problem Statement fields
  wantsSponsoredProblems: { type: Boolean, default: false },
  sponsoredPSConfig: {
    type: {
      type: String // 'open-innovation' or 'other'
    },
    customDescription: String,
    judges: String, // 'organizer' or 'sponsor'
    prizeAmount: Number,
    prizeDescription: String
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = HackathonSchema;
