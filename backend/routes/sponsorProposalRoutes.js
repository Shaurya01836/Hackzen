const express = require('express');
const router = express.Router();
const sponsorProposalController = require('../controllers/sponsorProposalController');

// Create a sponsor proposal
router.post('/', sponsorProposalController.createProposal);
// Get all proposals for a hackathon
router.get('/:hackathonId', sponsorProposalController.getProposalsForHackathon);
// Update proposal status (approve/reject)
router.patch('/:proposalId', sponsorProposalController.updateProposalStatus);

module.exports = router; 