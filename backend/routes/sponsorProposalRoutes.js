const express = require('express');
const router = express.Router();
const sponsorProposalController = require('../controllers/sponsorProposalController');
const { getChatMessages, sendChatMessage } = require('../controllers/sponsorProposalController');
const { protect } = require('../middleware/authMiddleware');

// Create a sponsor proposal
router.post('/', sponsorProposalController.createProposal);
// Get all proposals for a hackathon
router.get('/user/:userId', sponsorProposalController.getProposalsForUser);
router.get('/:proposalId/chat', protect, getChatMessages);
router.post('/:proposalId/chat', protect, sendChatMessage);
router.get('/:hackathonId', sponsorProposalController.getProposalsForHackathon);
// Update proposal status (approve/reject)
router.patch('/:proposalId', sponsorProposalController.updateProposalStatus);
// Edit a sponsor proposal (by sponsor)
router.put('/:proposalId', sponsorProposalController.editProposal);
// Update message to sponsor (by organizer)
router.patch('/:proposalId/message', sponsorProposalController.updateMessageToSponsor);
router.patch('/:proposalId/chat/:messageId/edit', protect, sponsorProposalController.editChatMessage);
router.delete('/:proposalId/chat/:messageId', protect, sponsorProposalController.deleteChatMessageForBoth);
router.post('/:proposalId/chat/:messageId/delete-for-me', protect, sponsorProposalController.deleteChatMessageForMe);

module.exports = router; 