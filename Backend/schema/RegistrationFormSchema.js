const { Schema } = require('mongoose');

const RegistrationFormSchema = new Schema({
  hackathonId: {
    type: Schema.Types.ObjectId,
    ref: 'Hackathon',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  formData: {
    fullName: String,
    email: String,
    phone: String,
    age: String,
    gender: String,
    collegeOrCompany: String,
    degreeOrRole: String,
    yearOfStudyOrExperience: String,
    teamName: String,
    teamCode: String,
    projectIdea: String,
    track: String,
    github: String,
    linkedin: String,
    resumeURL: String,
    heardFrom: String
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

module.exports = RegistrationFormSchema;
