const { Schema } = require("mongoose");

const BadgeSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  iconUrl: { type: String, required: true },
  criteria: { type: String, required: true },
  type: { 
    type: String, 
    required: true 
  },
  role: {
    type: String,
    enum: ['participant', 'organizer', 'judge', 'mentor'],
    required: true
  },
  rarity: { 
    type: String, 
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    default: 'common',
    required: true 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = { BadgeSchema };