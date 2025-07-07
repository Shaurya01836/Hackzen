const express = require('express');
const router = express.Router();
const {
  getCertificates,
  createCertificate,
  deleteCertificate
} = require('../controllers/certificatePageController');

// GET all certificate pages
router.get('/', getCertificates);

// POST a new certificate page
router.post('/', createCertificate);

// DELETE a certificate page by ID
router.delete('/:id', deleteCertificate);

module.exports = router;
