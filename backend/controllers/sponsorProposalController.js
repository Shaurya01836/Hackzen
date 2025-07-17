const SponsorProposal = require('../model/SponsorProposalModel');
const ChatMessage = require('../model/ChatMessageModel');

// POST /api/sponsor-proposals
exports.createProposal = async (req, res) => {
  try {
    const proposal = await SponsorProposal.create(req.body);
    res.status(201).json(proposal);
  } catch (err) {
    res.status(400).json({ message: 'Failed to submit proposal', error: err.message });
  }
};

// GET /api/sponsor-proposals/:hackathonId
exports.getProposalsForHackathon = async (req, res) => {
  try {
    const { email } = req.query;
    const query = { hackathon: req.params.hackathonId };
    if (email) query.email = email;
    const proposals = await SponsorProposal.find(query);
    res.json(proposals);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch proposals', error: err.message });
  }
};

// PUT /api/sponsor-proposals/:proposalId
exports.editProposal = async (req, res) => {
  try {
    const proposal = await SponsorProposal.findById(req.params.proposalId);
    if (!proposal) return res.status(404).json({ message: 'Proposal not found' });
    // Remove status check so editing is always allowed
    // Only allow editing certain fields
    const editableFields = [
      'title', 'description', 'deliverables', 'techStack', 'targetAudience',
      'prizeAmount', 'prizeDescription', 'provideJudges', 'judgeName', 'judgeEmail', 'judgeRole',
      'customStartDate', 'customDeadline', 'notes', 'telegram', 'discord', 'website', 'organization', 'name', 'email'
    ];
    editableFields.forEach(field => {
      if (req.body[field] !== undefined) proposal[field] = req.body[field];
    });
    await proposal.save();
    res.json(proposal);
  } catch (err) {
    res.status(400).json({ message: 'Failed to edit proposal', error: err.message });
  }
};

// PATCH /api/sponsor-proposals/:proposalId
exports.updateProposalStatus = async (req, res) => {
  try {
    const { status, reviewMessage, priceAmount } = req.body;
    const update = {};
    if (status) update.status = status;
    if (typeof reviewMessage === 'string') update.reviewMessage = reviewMessage;
    if (typeof priceAmount === 'string') update.prizeAmount = priceAmount;
    const proposal = await SponsorProposal.findByIdAndUpdate(
      req.params.proposalId,
      update,
      { new: true }
    );
    res.json(proposal);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update status', error: err.message });
  }
};

// GET /api/sponsor-proposals/user/:userId
exports.getProposalsForUser = async (req, res) => {
  try {
    // Only return approved proposals for this user
    const proposals = await SponsorProposal.find({ email: req.params.userId, status: 'approved' });
    res.json(proposals);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch proposals', error: err.message });
  }
};

// PATCH /api/sponsor-proposals/:proposalId/message
exports.updateMessageToSponsor = async (req, res) => {
  try {
    const { messageToSponsor } = req.body;
    const proposal = await SponsorProposal.findByIdAndUpdate(
      req.params.proposalId,
      { messageToSponsor },
      { new: true }
    );
    res.json(proposal);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update message', error: err.message });
  }
};

// GET /api/sponsor-proposals/:proposalId/chat
exports.getChatMessages = async (req, res) => {
  try {
    const { proposalId } = req.params;
    // Optionally: check if user is sponsor or organizer for this proposal
    const messages = await ChatMessage.find({ proposal: proposalId }).sort({ sentAt: 1 }).populate('sender', 'name email telegram');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch chat messages', error: err.message });
  }
};
// POST /api/sponsor-proposals/:proposalId/chat
exports.sendChatMessage = async (req, res) => {
  try {
    const { proposalId } = req.params;
    const { message } = req.body;
    const userId = req.user._id;
    if (!message) return res.status(400).json({ message: 'Message is required' });
    const chatMsg = await ChatMessage.create({ proposal: proposalId, sender: userId, message });
    await chatMsg.populate('sender', 'name email telegram');
    // Emit real-time event
    const io = req.app.get('io');
    if (io) io.to(proposalId).emit('chat message', chatMsg);
    res.status(201).json(chatMsg);
  } catch (err) {
    res.status(500).json({ message: 'Failed to send chat message', error: err.message });
  }
};
// PATCH /api/sponsor-proposals/:proposalId/chat/:messageId/edit
exports.editChatMessage = async (req, res) => {
  try {
    const { proposalId, messageId } = req.params;
    const { message } = req.body;
    const userId = req.user._id;
    const chatMsg = await ChatMessage.findById(messageId);
    if (!chatMsg) return res.status(404).json({ message: 'Message not found' });
    if (String(chatMsg.sender) !== String(userId)) return res.status(403).json({ message: 'Not allowed' });
    chatMsg.message = message;
    chatMsg.edited = true;
    chatMsg.editedAt = new Date();
    await chatMsg.save();
    const io = req.app.get('io');
    if (io) io.to(proposalId).emit('chat message edited', chatMsg);
    res.json(chatMsg);
  } catch (err) {
    res.status(500).json({ message: 'Failed to edit chat message', error: err.message });
  }
};
// DELETE /api/sponsor-proposals/:proposalId/chat/:messageId
exports.deleteChatMessageForBoth = async (req, res) => {
  try {
    const { proposalId, messageId } = req.params;
    const userId = req.user._id;
    const chatMsg = await ChatMessage.findById(messageId);
    if (!chatMsg) return res.status(404).json({ message: 'Message not found' });
    if (String(chatMsg.sender) !== String(userId)) return res.status(403).json({ message: 'Not allowed' });
    await chatMsg.deleteOne();
    const io = req.app.get('io');
    if (io) io.to(proposalId).emit('chat message deleted', { _id: messageId, proposal: proposalId, forBoth: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete chat message', error: err.message });
  }
};
// POST /api/sponsor-proposals/:proposalId/chat/:messageId/delete-for-me
exports.deleteChatMessageForMe = async (req, res) => {
  try {
    const { proposalId, messageId } = req.params;
    const userId = req.user._id;
    const chatMsg = await ChatMessage.findById(messageId);
    if (!chatMsg) return res.status(404).json({ message: 'Message not found' });
    if (!chatMsg.deletedFor.includes(userId)) {
      chatMsg.deletedFor.push(userId);
      await chatMsg.save();
    }
    const io = req.app.get('io');
    if (io) io.to(proposalId).emit('chat message deleted', { _id: messageId, proposal: proposalId, forBoth: false, user: userId });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete chat message for me', error: err.message });
  }
}; 