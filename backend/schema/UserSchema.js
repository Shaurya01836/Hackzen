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
bannerImage: { type: String,
   default: "/assets/default-banner.png"
   },

  role: {
    type: String,
    enum: ['participant', 'organizer', 'mentor', 'judge', 'admin'],
    default: 'participant'
  },
   phone: String,
  location: String,
  bio: String,
  website: String,
  linkedin: String,
  skills: [String],
  badges: [{ type: Schema.Types.ObjectId, ref: 'Badge' }],
  hackathonsJoined: [{ type: Schema.Types.ObjectId, ref: 'Hackathon' }],
  projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
  createdAt: { type: Date, default: Date.now },
  lastVisit: { type: Date },
activityLog: [{ type: Date }],
githubUsername: String,
githubProfile: String,
github: String,
organization: {
  type: Schema.Types.ObjectId,
  ref: "Organization",
},
applicationStatus: {
  type: String,
  enum: ["pending", "approved", "rejected"],
  default: "pending"
}
});

module.exports = { UserSchema };
