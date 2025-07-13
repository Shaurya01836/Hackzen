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
  
  // Basic Contact Information
  phone: String,
  location: String,
  bio: String,
  website: String,
  linkedin: String,

  // Comprehensive Profile Information for Hackathon Management
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say'],
    default: 'prefer-not-to-say'
  },
  
  userType: {
    type: String,
    enum: ['school', 'college', 'fresher', 'professional']
  },
  
  domain: {
    type: String,
    enum: [
      'engineering',
      'computer-science',
      'information-technology',
      'data-science',
      'artificial-intelligence',
      'machine-learning',
      'cybersecurity',
      'web-development',
      'mobile-development',
      'game-development',
      'design',
      'business',
      'management',
      'finance',
      'marketing',
      'law',
      'medicine',
      'pharmacy',
      'nursing',
      'architecture',
      'arts',
      'humanities',
      'social-sciences',
      'education',
      'agriculture',
      'environmental-science',
      'other'
    ]
  },
  
  course: String,
  courseDuration: {
    type: String,
    enum: ['1-year', '2-years', '3-years', '4-years', '5-years', '6-years', 'other']
  },
  
  collegeName: String,
  country: String,
  city: String,
  courseSpecialization: String,
  
  // Professional Information
  companyName: String,
  jobTitle: String,
  yearsOfExperience: {
    type: String,
    enum: ['0-1', '1-2', '2-3', '3-5', '5-10', '10+']
  },
  
  // Academic Information
  currentYear: {
    type: String,
    enum: ['1st-year', '2nd-year', '3rd-year', '4th-year', 'final-year', 'other']
  },
  
  // Skills and Interests
  skills: [String],
  interests: [String],
  
  // Social Media and Professional Links
  github: String,
  githubUsername: String,
  githubProfile: String,
  twitter: String,
  instagram: String,
  portfolio: String,
  
  // Hackathon Specific Information
  preferredHackathonTypes: [{
    type: String,
    enum: ['web-development', 'mobile-app', 'ai-ml', 'blockchain', 'iot', 'game-dev', 'design', 'social-impact', 'fintech', 'healthtech', 'edtech', 'other']
  }],
  
  teamSizePreference: {
    type: String,
    enum: ['solo', '2-3', '4-5', '6+', 'any']
  },
  
  // Profile Completion Status
  profileCompleted: {
    type: Boolean,
    default: false
  },
  
  // Badges and Achievements
  badges: [{ 
    badge: { type: Schema.Types.ObjectId, ref: 'Badge' },
    unlockedAt: { type: Date, default: Date.now }
  }],
  
  // Hackathon Participation
  hackathonsJoined: [{ type: Schema.Types.ObjectId, ref: 'Hackathon' }],
  registeredHackathonIds: [{ type: Schema.Types.ObjectId, ref: 'Hackathon' }],
  projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],

  // Timestamps and Activity
  createdAt: { type: Date, default: Date.now },
  lastVisit: { type: Date },
  activityLog: [{ type: Date }],
  
  // Streak tracking
  currentStreak: { type: Number, default: 0 },
  maxStreak: { type: Number, default: 0 },
  lastActivityDate: { type: Date },

  // Organization and Application Status
  organization: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
  },

  applicationStatus: {
    type: String,
    enum: ["pending", "submitted", "approved", "rejected"],
    default: "pending"
  },
  
  // Two-Factor Authentication
  twoFA: {
    enabled: { type: Boolean, default: false },
    secret: { type: String },
  },
});

module.exports = { UserSchema };
