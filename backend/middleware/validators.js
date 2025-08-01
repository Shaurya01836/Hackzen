exports.validateSubmissionInput = (req, res, next) => {
  const { projectId, version, repoSnapshot, changes } = req.body;

  if (!projectId || !version || !repoSnapshot || !changes) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  if (typeof version !== 'number' || version < 1) {
    return res.status(400).json({ message: 'Version must be a positive number' });
  }

  next();
};

exports.validateProjectInput = (req, res, next) => {
  const { title, repoLink, team } = req.body;

  if (!title || !repoLink || !team) {
    return res.status(400).json({ message: 'title, repoLink and team are required' });
  }

  next();
};

exports.validateNotificationInput = (req, res, next) => {
  const { recipient, message, type } = req.body;

  if (!recipient || !message || !type) {
    return res.status(400).json({ message: 'recipient, message, and type are required' });
  }

  const allowedTypes = ['info', 'warning', 'success'];
  if (!allowedTypes.includes(type)) {
    return res.status(400).json({ message: 'Invalid notification type' });
  }

  next();
};

exports.validateScoreInput = (req, res, next) => {
  const { project, criteria, score } = req.body;

  if (!project || !criteria || typeof score !== 'number') {
    return res.status(400).json({ message: 'project, criteria and numeric score are required' });
  }

  if (score < 0 || score > 10) {
    return res.status(400).json({ message: 'Score must be between 0 and 10' });
  }

  next();
};

exports.validateBadgeInput = (req, res, next) => {
  const { name, description, iconUrl, criteria } = req.body;

  if (!name || !description || !iconUrl || !criteria) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  next();
};
