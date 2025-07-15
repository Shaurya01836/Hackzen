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
    const proposals = await SponsorProposal.find({ hackathon: req.params.hackathonId });
    res.json(proposals);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch proposals', error: err.message });
  }
};

// PATCH /api/sponsor-proposals/:proposalId
exports.updateProposalStatus = async (req, res) => {
  try {
    const { status, reviewMessage } = req.body;
    const update = { status };
    if (typeof reviewMessage === 'string') update.reviewMessage = reviewMessage;
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