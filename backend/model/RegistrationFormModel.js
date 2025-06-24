const mongoose = require('mongoose');
const RegistrationFormSchema = require('../schema/RegistrationFormSchema'); // ❌ no destructuring here

const RegistrationForm = mongoose.models.RegistrationForm || mongoose.model('RegistrationForm', RegistrationFormSchema);

module.exports = RegistrationForm;
