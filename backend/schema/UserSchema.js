const { Schema } = require("mongoose");

const UserSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,

  authProvider: { type: String, enum: ['email', 'github', 'google'] },

  profileImage: {
    type: String,
    default: "",
  },

  bannerImage: {
    type: String,
    default: "/assets/default-banner.png"
  },

  role: {
    type: String,
    enum: ['participant', 'organizer', 'mentor', 'judge', 'admin'],
    default: 'participant'
  },
savedHackathons: [{ type: Schema.Types.ObjectId, ref: "Hackathon"}],
  phone: String,
  location: String,
  bio: String,
  website: String,
  linkedin: String,

  skills: [String],
  badges: [{ 
    badge: { type: Schema.Types.ObjectId, ref: 'Badge' },
    unlockedAt: { type: Date, default: Date.now }
  }],
  hackathonsJoined: [{ type: Schema.Types.ObjectId, ref: 'Hackathon' }],
  registeredHackathonIds: [{ type: Schema.Types.ObjectId, ref: 'Hackathon' }],
  projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],

  createdAt: { type: Date, default: Date.now },
  lastVisit: { type: Date },
  activityLog: [{ type: Date }],
  
  // Streak tracking
  currentStreak: { type: Number, default: 0 },
  maxStreak: { type: Number, default: 0 },
  lastActivityDate: { type: Date },

  githubUsername: String,
  githubProfile: String,
  github: String,

  organization: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
  },

  applicationStatus: {
    type: String,
    enum: ["pending", "submitted", "approved", "rejected"],
    default: "pending"
  },
  twoFA: {
  enabled: { type: Boolean, default: false },
  secret: { type: String },
},

});

module.exports = { UserSchema };
