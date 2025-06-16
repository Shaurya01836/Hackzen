const { Schema } = require("mongoose");

const PlanSchema = new Schema({
  organizer: { type: Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['standard', 'premium'] },
  active: Boolean,
  startedAt: Date,
  expiresAt: Date
});

module.exports = { PlanSchema };