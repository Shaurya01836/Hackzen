const Score = require('../model/ScoreModel');

exports.submitScore = async (req, res) => {
  try {
    const { project, criteria, score, feedback } = req.body;

    const newScore = await Score.create({
      project,
      judge: req.user._id,
      criteria,
      score,
      feedback
    });

    res.status(201).json(newScore);
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit score', error: err.message });
  }
};

exports.getScoresByProject = async (req, res) => {
  try {
    const scores = await Score.find({ project: req.params.projectId }).populate('judge');
    res.json(scores);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch project scores', error: err.message });
  }
};

exports.getScoresByJudge = async (req, res) => {
  try {
    const scores = await Score.find({ judge: req.params.judgeId }).populate('project');
    res.json(scores);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch judge scores', error: err.message });
  }
};

exports.deleteScore = async (req, res) => {
  try {
    const score = await Score.findById(req.params.id);
    if (!score) return res.status(404).json({ message: 'Score not found' });

    if (!score.judge.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this score' });
    }

    await score.remove();
    res.json({ message: 'Score deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete score', error: err.message });
  }
};
