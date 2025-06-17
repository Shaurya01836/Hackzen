const SubmissionHistory = require('../model/SubmissionHistoryModel');

exports.createSubmissionHistory = async (req, res) => {
  try {
    const { projectId, version, repoSnapshot, changes } = req.body;

    const submission = await SubmissionHistory.create({
      projectId,
      version,
      repoSnapshot,
      changes,
      submittedAt: new Date(),
    });

    res.status(201).json(submission);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create submission history', details: err.message });
  }
};

exports.getSubmissionHistoryByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const history = await SubmissionHistory.find({ projectId }).sort({ version: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch submission history', details: err.message });
  }
};

exports.getLatestSubmissionByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const latest = await SubmissionHistory.findOne({ projectId })
      .sort({ version: -1 });

    if (!latest) return res.status(404).json({ message: 'No submissions found' });

    res.json(latest);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch latest submission', details: err.message });
  }
};


exports.getSubmissionHistoryById = async (req, res) => {
  try {
    const entry = await SubmissionHistory.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Submission not found' });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving submission', details: err.message });
  }
};

exports.deleteSubmissionHistory = async (req, res) => {
  try {
    const result = await SubmissionHistory.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Entry not found' });

    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete submission', details: err.message });
  }
};
