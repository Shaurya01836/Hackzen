// schemas/OrganizationSchema.js
const mongoose = require("mongoose");

const disallowedDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "protonmail.com"];

const OrganizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 80,
    },
    contactPerson: {
      type: String,
      required: true,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: function (email) {
          const domain = email.split("@")[1];
          return !disallowedDomains.includes(domain);
        },
        message: "Please use an official organization email address.",
      },
    },
    contactMethods: {
      whatsapp: { type: String },
      telegram: { type: String },
    },
    organizationType: {
      type: String,
      enum: ["Ecosystem", "Company", "University", "Other"],
      required: true,
    },
    supportNeeds: {
      type: [String],
      enum: [
        "Run a Hackathon",
        "Sponsor a Hackathon",
        "Promote Developer Tooling",
        "Mentorship Opportunities",
        "Collaborate on Events",
        "Feature Us on the Platform",
        "Other",
      ],
      required: true,
    },logo: { type: String },

    purpose: {
      type: String,
      maxlength: 1000,
    },
    website: { type: String },
    github: { type: String },
    approved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = OrganizationSchema;
