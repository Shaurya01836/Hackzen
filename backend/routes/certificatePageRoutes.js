const express = require('express');
const router = express.Router();

const {
  getCertificates,
  createCertificate,
  deleteCertificate,
  updateCertificate
} = require('../controllers/certificatePageController');

const { protect } = require('../middleware/authMiddleware'); // ✅ Renamed middleware

// GET: fetch all certificate pages (admin + user-created)
router.get('/', protect, getCertificates);

// POST: create a new certificate page
router.post('/', protect, createCertificate);

// DELETE: delete a certificate page by ID (only owner or admin)
router.delete('/:id', protect, deleteCertificate);

// PUT: update a certificate page by ID (only owner or admin)
router.put('/:id', protect, updateCertificate);

module.exports = router;
