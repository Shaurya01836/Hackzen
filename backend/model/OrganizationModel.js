// models/Organization.js
const mongoose = require("mongoose");
const OrganizationSchema = require("../schema/OrganizationSchema");

const Organization =
  mongoose.models.Organization || mongoose.model("Organization", OrganizationSchema);

module.exports = Organization;
