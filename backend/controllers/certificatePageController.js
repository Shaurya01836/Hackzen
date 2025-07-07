const CertificatePage = require('../model/CertificatePageModel');

// Get all certificates
exports.getCertificates = async (req, res) => {
  try {
    const certificates = await CertificatePage.find();
    res.status(200).json(certificates);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch certificate pages.' });
  }
};

// Create a new certificate
exports.createCertificate = async (req, res) => {
  try {
    const { title, description, preview, color, isDefault } = req.body;

    const newCertificate = new CertificatePage({
      title,
      description,
      preview, // optional, defaults to placeholder.svg if not sent
      color,   // optional, defaults to defined default in schema
      isDefault
    });

    await newCertificate.save();
    res.status(201).json(newCertificate);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create certificate page.' });
  }
};

// Delete a certificate
exports.deleteCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    await CertificatePage.findByIdAndDelete(id);
    res.status(200).json({ message: 'Certificate deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete certificate page.' });
  }
};
