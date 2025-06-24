// controllers/organizationController.js
const Organization = require("../model/OrganizationModel");
const User = require("../model/UserModel");

// ✅ Register a new organization
const registerOrganization = async (req, res) => {
  try {
    const org = new Organization(req.body);
    await org.save();
    res.status(201).json({ message: "Organization registered successfully!", org });
  } catch (err) {
    console.error("Org registration error:", err);
    res.status(400).json({ message: err.message || "Failed to register organization." });
  }
};

// ✅ Get all organizations
const getAllOrganizations = async (req, res) => {
  try {
    const orgs = await Organization.find().sort({ createdAt: -1 });
    res.status(200).json(orgs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch organizations." });
  }
};

// ✅ View all users in my organization (Organizer/Admin)
const getUsersInMyOrganization = async (req, res) => {
  try {
    if (!req.user.organization) {
      return res.status(400).json({ message: "User does not belong to any organization." });
    }

    const users = await User.find({ organization: req.user.organization }).select("-passwordHash");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users in organization." });
  }
};

// ✅ Approve/Reject user application
// ✅ Approve/Reject user application
const updateApplicationStatus = async (req, res) => {
  const { userId } = req.params;
  const { status } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user || !user.organization) {
      return res.status(404).json({ message: "User or organization not found." });
    }

    const isSameOrg = req.user.organization && user.organization.toString() === req.user.organization.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isSameOrg && !isAdmin) {
      return res.status(403).json({ message: "Unauthorized to update this user." });
    }

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Must be 'approved' or 'rejected'." });
    }

    user.applicationStatus = status;
    await user.save();

    res.json({ message: `User application ${status}.`, user });
  } catch (err) {
    res.status(500).json({ message: "Failed to update application status.", error: err.message });
  }
};
const approveOrganization = async (req, res) => {
  const { id } = req.params;

  try {
    const org = await Organization.findById(id);

    if (!org) {
      return res.status(404).json({ message: "Organization not found." });
    }

    if (org.approved) {
      return res.status(400).json({ message: "Organization already approved." });
    }

    org.approved = true;
    await org.save();

    res.json({ message: "Organization approved successfully.", org });
  } catch (err) {
    res.status(500).json({ message: "Failed to approve organization.", error: err.message });
  }
};


// ✅ Remove user from organization
const removeUserFromOrganization = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user || !user.organization || user.organization.toString() !== req.user.organization.toString()) {
      return res.status(403).json({ message: "Unauthorized to remove this user." });
    }

    user.organization = null;
    user.applicationStatus = null;
    await user.save();

    res.json({ message: "User removed from organization.", user });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove user from organization." });
  }
};
const getUsersInOrganization = async (req, res) => {
  try {
    const orgId = req.user.organization;

    if (!orgId) {
      return res.status(403).json({ message: "You are not part of any organization." });
    }

    const users = await User.find({ organization: orgId }).select('-passwordHash');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch organization users", error: err.message });
  }
};

module.exports = {
  registerOrganization,
  getAllOrganizations,
  getUsersInMyOrganization,
  updateApplicationStatus,
  removeUserFromOrganization,
  getUsersInOrganization,
  approveOrganization
};
