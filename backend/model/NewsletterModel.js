const mongoose = require('mongoose');
const { NewsletterSchema } = require('../schema/NewsletterSchema'); // ❌ no destructuring here

const Newsletter = mongoose.models.Newsletter || mongoose.model('Newsletter', NewsletterSchema);

module.exports = Newsletter;
