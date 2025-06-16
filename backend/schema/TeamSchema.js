const { Schema } = require('mongoose');

const TeamSchema = new Schema({
  name: { type: String, required: true },
  members: { type: Schema.Types.ObjectId, ref: 'User' },
  hackathon: { type: Schema.Types.ObjectId, ref: 'Hackathon', required: true },
  mentor: { type: Schema.Types.ObjectId, ref: 'User' }, // Optional
  project: { type: Schema.Types.ObjectId, ref: 'Project' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = TeamSchema;