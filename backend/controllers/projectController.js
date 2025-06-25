const Project = require('../model/ProjectModel');

exports.createProject = async (req, res) => {
  try {
    const { title, description, repoLink, videoLink, team, hackathon } = req.body;

    const newProject = await Project.create({
      title,
      description,
      repoLink,
      videoLink,
      team,
      hackathon,
      submittedBy: req.user._id,
      status: 'draft',
    });

   res.status(201).json(newProject);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create project', error: err.message });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const filters = {};
    if (req.query.hackathon) filters.hackathon = req.query.hackathon;
    if (req.query.team) filters.team = req.query.team;

    const projects = await Project.find(filters)
      .populate('team submittedBy hackathon scores');
    
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch projects', error: err.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('team submittedBy hackathon scores');

    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching project', error: err.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (!project.submittedBy.equals(req.user._id)) {
      return res.status(403).json({ message: 'Not allowed to update this project' });
    }

    const updates = req.body;
    Object.assign(project, updates);

    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update project', error: err.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (!project.submittedBy.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }

    await project.remove();
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete project', error: err.message });
  }
};
