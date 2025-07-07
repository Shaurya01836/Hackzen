const mongoose = require('mongoose');
const { CertificatePageSchema } = require('../schema/CertificatePageSchema');

const CertificatePage = mongoose.models.CertificatePage || mongoose.model('CertificatePage', CertificatePageSchema);
module.exports = CertificatePage;
