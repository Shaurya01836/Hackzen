const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  hackathonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hackathon",
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  formData: {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true
    },
    phone: {
      type: String,
      default: null
    },
    age: {
      type: Number,
      default: null
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      default: null
    },
    collegeOrCompany: {
      type: String,
      required: true
    },
    degreeOrRole: {
      type: String,
      default: null
    },
    yearOfStudyOrExperience: {
      type: Number,
      default: null
    },
    teamName: {
      type: String,
      default: null
    },
    teamCode: {
      type: String,
      default: null
    },
    projectIdea: {
      type: String,
      maxlength: 500
    },
    track: {
      type: String,
      enum: ['Web Development', 'AI/ML', 'Blockchain', 'Cybersecurity', 'Open Innovation'],
      required: true
    },
    github: {
      type: String,
      default: null
    },
    linkedin: {
      type: String,
      default: null
    },
    resumeURL: {
      type: String,
      default: null
    },
    heardFrom: {
      type: String,
      default: null
    }
  },
  acceptedTerms: {
    type: Boolean,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('HackathonRegistration', registrationSchema);
