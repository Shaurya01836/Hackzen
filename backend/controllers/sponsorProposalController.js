const SponsorProposal = require('../model/SponsorProposalModel');

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
    // Only return approved proposals
    const proposals = await SponsorProposal.find({ hackathon: req.params.hackathonId, status: 'approved' });
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