const mongoose = require('mongoose');
const { RegistrationFormSchema } = require('../schema/RegistrationFormSchema');

const RegistrationForm = mongoose.models.RegistrationForm || mongoose.model('RegistrationForm', RegistrationFormSchema);
module.exports =RegistrationForm;