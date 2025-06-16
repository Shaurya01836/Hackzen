const { Schema } = require("mongoose");

const BadgeSchema = new Schema({
  name: String,
  description: String,
  iconUrl: String,
  criteria: String // e.g., "Win 3 hackathons"
});

module.exports = { BadgeSchema };