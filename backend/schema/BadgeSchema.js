const { Schema } = require("mongoose");

const BadgeSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  iconUrl: { type: String, required: true },
  criteria: { type: String, required: true }, // e.g., "Win 3 hackathons"
  type: { 
    type: String, 
    enum: [
      'first-win', 'streak-master', 'team-player', 'code-wizard', 
      'mentor', 'organizer', 'hackathon-veteran', 'innovation-leader',
      'early-adopter', 'problem-solver'
    ],
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