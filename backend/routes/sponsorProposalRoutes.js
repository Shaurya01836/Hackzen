const express = require('express');
const router = express.Router();
const sponsorProposalController = require('../controllers/sponsorProposalController');

// Create a sponsor proposal
router.post('/', sponsorProposalController.createProposal);
// Get all proposals for a hackathon
router.get('/:hackathonId', sponsorProposalController.getProposalsForHackathon);
// Update proposal status (approve/reject)
router.patch('/:proposalId', sponsorProposalController.updateProposalStatus);
// Edit a sponsor proposal (by sponsor)
router.put('/:proposalId', sponsorProposalController.editProposal);
// Get all proposals by user (by email as userId)
router.get('/user/:userId', sponsorProposalController.getProposalsForUser);
// Update message to sponsor (by organizer)
router.patch('/:proposalId/message', sponsorProposalController.updateMessageToSponsor);

module.exports = router; 