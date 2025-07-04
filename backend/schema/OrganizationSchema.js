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
      lowercase: true,
      validate: {
        validator: function (email) {
          const domain = email.split("@")[1];
          const isValidFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
          return isValidFormat && !disallowedDomains.includes(domain);
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
    },
    logo: { type: String },
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
    rejected: {
      type: Boolean,
      default: false,
    },
    rejectedAt: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    // New fields for pending changes and primary organization
    isPrimary: {
      type: Boolean,
      default: false,
    },
    pendingChanges: {
      name: String,
      contactPerson: String,
      email: String,
      organizationType: String,
      supportNeeds: [String],
      purpose: String,
      website: String,
      github: String,
      contactMethods: {
        whatsapp: String,
        telegram: String,
      },
      submittedAt: Date,
      submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
    changeHistory: [{
      field: String,
      oldValue: mongoose.Schema.Types.Mixed,
      newValue: mongoose.Schema.Types.Mixed,
      submittedAt: Date,
      approvedAt: Date,
      rejectedAt: Date,
      reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
      },
    }],
  },
  { timestamps: true }
);

module.exports = OrganizationSchema;
