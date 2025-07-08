const Project = require("../model/ProjectModel");
const Hackathon = require("../model/HackathonModel");

// Create a new project
exports.createProject = async (req, res) => {
  try {
    const {
      title,
      oneLineIntro,
      description,
      repoLink,
      websiteLink,
      videoLink,
      socialLinks,
      logo,
      category,
      customCategory,
      team,
      hackathon,
      skills,
      teamIntro,
    } = req.body;

    // Validate required fields
    if (!title || !description || !category || !oneLineIntro) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ✅ Pull user from token (middleware adds it)
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const newProject = new Project({
      title,
      oneLineIntro,
      description,
      teamIntro,
      skills,
      repoLink,
      websiteLink,
      videoLink,
      socialLinks,
      logo,
      category,
      customCategory,
      team: team || null,
      hackathon: hackathon || null,
      submittedBy: userId, // ✅ required field
      status: "draft",
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) {
    console.error("❌ Error creating project:", err);
    res.status(500).json({ message: "Failed to create project", error: err.message });
  }
};


// Get all projects
// Get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("submittedBy", "name profileImage role") // 👈 key line
      .populate("hackathon", "title")
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects", error: error.message });
  }
};


// Get my projects
exports.getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ submittedBy: req.user._id })
      .populate("submittedBy", "name profileImage role") // ✅ this is the fix
      .populate("hackathon", "title"); // if you want hackathon title also

    res.status(200).json(projects);
  } catch (err) {
    console.error("Error fetching user projects:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get projects by hackathon
exports.getProjectsByHackathon = async (req, res) => {
  try {
    const projects = await Project.find({ hackathon: req.params.hackathonId, status: "submitted" })
      .populate("submittedBy", "name profileImage role"); // ✅ Add this
    res.json(projects);
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('hackathon', 'title status prizeTrack')
      .populate('submittedBy', 'name profileImage')
      .populate('team');

    console.log("🔍 Populated project:", project); // 👈 ADD THIS

    if (!project) return res.status(404).json({ message: 'Project not found' });

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving project' });
  }
};


// Update project
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // 🛡️ Only allow the user who created the project
    if (!project.submittedBy.equals(req.user._id)) {
      return res.status(403).json({ message: "Unauthorized to update this project" });
    }

    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: "Error updating project", error: error.message });
  }
};


exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // 🛡️ Only allow deletion by the user who submitted it
    if (!project.submittedBy.equals(req.user._id)) {
      return res.status(403).json({ message: "Unauthorized to delete this project" });
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting project", error: error.message });
  }
};


// Submit project
exports.submitProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (!project.submittedBy.equals(req.user._id)) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    if (!project.hackathon) {
      return res.status(400).json({ message: "No hackathon linked to this project" });
    }
    project.status = "submitted";
    project.submittedAt = new Date();
    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Error submitting project", error: error.message });
  }
};

// Assign hackathon to a project
exports.assignHackathonToProject = async (req, res) => {
  try {
    const { hackathonId } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ message: "Project not found" });
    if (!project.submittedBy.equals(req.user._id)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) return res.status(404).json({ message: "Hackathon not found" });

    if (project.hackathon) {
      return res.status(400).json({ message: "Project already linked to a hackathon" });
    }

    project.hackathon = hackathonId;
    await project.save();

    res.json({ message: "Hackathon assigned to project", project });
  } catch (error) {
    res.status(500).json({ message: "Error assigning hackathon", error: error.message });
  }
};
exports.getProjectsByHackathon = async (req, res) => {
  try {
    const { hackathonId } = req.params;

    const projects = await Project.find({
      hackathon: hackathonId,
      status: "submitted",
    })
      .populate("submittedBy", "name profileImage role") // ✅ FIXED LINE
      .sort({ updatedAt: -1 });

    res.status(200).json(projects);
  } catch (err) {
    console.error("Error fetching projects for hackathon:", err);
    res.status(500).json({ message: "Server error" });
  }
};
