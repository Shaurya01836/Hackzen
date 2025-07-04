const Organization = require("../model/OrganizationModel");
const User = require("../model/UserModel");




// ✅ Register a new organization
const registerOrganization = async (req, res) => {
  try {
    console.log("👉 Org data from frontend:", req.body);
console.log("👉 User from token:", req.user);

    const {
      name,
      contactPerson,
      whatsapp,
      telegram,
      organizationType,
      supportNeeds,
      purpose,
      website, 
      github
    } = req.body;

    const email = req.body.email?.toLowerCase();

    // Check if user already has a pending or approved application for this specific organization
    const existingForThisOrg = await Organization.findOne({ 
      email: email,
      createdBy: req.user._id 
    });
    
    if (existingForThisOrg) {
      // If there's an existing application for this org, check if it was rejected
      if (existingForThisOrg.rejected) {
        // Allow reapplication by updating the existing record
        existingForThisOrg.name = name;
        existingForThisOrg.contactPerson = contactPerson;
        existingForThisOrg.whatsapp = whatsapp;
        existingForThisOrg.telegram = telegram;
        existingForThisOrg.organizationType = organizationType;
        existingForThisOrg.supportNeeds = supportNeeds;
        existingForThisOrg.purpose = purpose;
        existingForThisOrg.website = website;
        existingForThisOrg.github = github;
        existingForThisOrg.approved = false;
        existingForThisOrg.rejected = false;
        existingForThisOrg.rejectedAt = null;
        existingForThisOrg.createdAt = new Date(); // Reset creation date
        await existingForThisOrg.save();

        res.status(200).json({ message: "Application resubmitted successfully", organization: existingForThisOrg });
        return;
      } else if (existingForThisOrg.approved) {
        return res.status(409).json({ message: "You're already an approved organizer for this organization." });
      } else {
        return res.status(409).json({ message: "You already have a pending application for this organization." });
      }
    }

    if (!name || !contactPerson || !organizationType || !supportNeeds?.length || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }


    const newOrg = new Organization({
      name,
      contactPerson,
      email,
      whatsapp,
      telegram,
      organizationType,
      supportNeeds,
      purpose,
      website,
      github,
      approved: false,
      createdBy: req.user._id
    });

    await newOrg.save();

    // Update user applicationStatus to "submitted"
    const user = await User.findById(req.user._id);
    user.applicationStatus = "submitted";
    await user.save();

    res.status(201).json({ message: "Application submitted successfully", organization: newOrg });
  } catch (err) {
    console.error("Org registration error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// ✅ Get all organizations (Admin only)
const getAllOrganizations = async (req, res) => {
  try {
    const orgs = await Organization.find().sort({ createdAt: -1 });
    res.status(200).json(orgs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch organizations." });
  }
};

// ✅ Get all users in current user's organization
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

// ✅ Get users in any organization (admin/organizer)
const getUsersInOrganization = async (req, res) => {
  try {
    const orgId = req.user.organization;

    if (!orgId) {
      return res.status(403).json({ message: "You are not part of any organization." });
    }

    const users = await User.find({ organization: orgId }).select("-passwordHash");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch organization users", error: err.message });
  }
};

// ✅ Get current user's organizations
const getMyOrganization = async (req, res) => {
  try {
    const user = req.user;

    // Get all approved organizations created by this user
    const approvedOrgs = await Organization.find({ 
      createdBy: user._id, 
      approved: true 
    }).sort({ createdAt: -1 });

    if (approvedOrgs.length === 0) {
      return res.status(404).json({ message: "You are not part of any approved organization" });
    }

    // Get all organizations created by this user for context
    const allUserOrgs = await Organization.find({ createdBy: user._id }).sort({ createdAt: -1 });

    // If user has only one approved organization, return it as before for backward compatibility
    if (approvedOrgs.length === 1) {
      const org = approvedOrgs[0];
      res.status(200).json({
        ...org.toObject(),
        applicationStatus: user.applicationStatus,
        totalApplications: allUserOrgs.length,
        approvedApplications: allUserOrgs.filter(o => o.approved).length,
        rejectedApplications: allUserOrgs.filter(o => o.rejected).length,
        pendingApplications: allUserOrgs.filter(o => !o.approved && !o.rejected).length,
      });
    } else {
      // Return all approved organizations
      res.status(200).json({
        organizations: approvedOrgs,
        primaryOrganization: approvedOrgs[0], // First approved org as primary
        applicationStatus: user.applicationStatus,
        totalApplications: allUserOrgs.length,
        approvedApplications: allUserOrgs.filter(o => o.approved).length,
        rejectedApplications: allUserOrgs.filter(o => o.rejected).length,
        pendingApplications: allUserOrgs.filter(o => !o.approved && !o.rejected).length,
        hasMultipleOrgs: true,
      });
    }
  } catch (err) {
    console.error("Error in getMyOrganization:", err.message);
    res.status(500).json({ message: "Server error retrieving organization" });
  }
};

// ✅ Update organization info (Organizer/Admin)
const updateMyOrganization = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.organization) return res.status(400).json({ message: "Not in an organization." });

    const allowedFields = [
      "name", "contactPerson", "email", "contactMethods", "organizationType",
      "supportNeeds", "purpose", "website", "github", "logo"
    ];

    const updates = Object.fromEntries(
      Object.entries(req.body).filter(([key]) => allowedFields.includes(key))
    );

    const updatedOrg = await Organization.findByIdAndUpdate(user.organization, updates, { new: true });
    res.json({ message: "Organization updated.", updatedOrg });
  } catch (err) {
    res.status(500).json({ message: "Failed to update organization.", error: err.message });
  }
};

// ✅ Approve or Reject a user's application
const updateApplicationStatus = async (req, res) => {
  const { userId } = req.params;
  const { status, organizationId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    const isSameOrg = req.user.organization && user.organization?.toString() === req.user.organization.toString();
    const isAdmin = req.user.role === "admin";

    if (!isSameOrg && !isAdmin) {
      return res.status(403).json({ message: "Unauthorized to update this user." });
    }

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Must be 'approved' or 'rejected'." });
    }

    user.applicationStatus = status;

    if (status === "approved") {
      if (organizationId) {
        user.organization = organizationId;
        user.role = "organizer";
      } else {
        // fallback to old domain-matching logic
        const domain = user.email.split('@')[1];
        const org = await Organization.findOne({ email: { $regex: new RegExp(domain, 'i') } });
        if (org) {
          user.organization = org._id;
          user.role = "organizer";
        }
      }
    }

    await user.save();
    res.json({ message: `User application ${status}.`, user });
  } catch (err) {
    res.status(500).json({ message: "Failed to update application status.", error: err.message });
  }
};

// ✅ Approve an organization
const approveOrganization = async (req, res) => {
  try {
    const org = await Organization.findById(req.params.id);
    if (!org) return res.status(404).json({ message: "Organization not found." });

    if (org.approved) {
      return res.status(400).json({ message: "Organization already approved." });
    }

    org.approved = true;
    org.rejected = false; // Reset rejected flag for resubmissions
    org.rejectedAt = null; // Clear rejection date
    await org.save();

    // Link the applicant user to this organization
    if (org.createdBy) {
      const user = await User.findById(org.createdBy);
      if (user) {
        user.organization = org._id;
        user.role = "organizer";
        user.applicationStatus = "approved";
        await user.save();
        
        // Check if this is the user's first approved organization
        const approvedOrgs = await Organization.find({ 
          createdBy: org.createdBy, 
          approved: true 
        });
        
        if (approvedOrgs.length === 1) {
          // This is the first approved organization, set it as primary
          org.isPrimary = true;
          await org.save();
        }
      }
    }

    res.json({ message: "Organization approved successfully.", org });
  } catch (err) {
    res.status(500).json({ message: "Failed to approve organization.", error: err.message });
  }
};

// ✅ Reject an organization (mark as rejected instead of deleting)
const rejectOrganization = async (req, res) => {
  try {
    const org = await Organization.findById(req.params.id);
    if (!org) return res.status(404).json({ message: "Not found" });

    // Mark as rejected instead of deleting
    org.approved = false;
    org.rejected = true;
    org.rejectedAt = new Date();
    await org.save();

    // Update the user's application status
    if (org.createdBy) {
      const user = await User.findById(org.createdBy);
      if (user) {
        user.applicationStatus = "rejected";
        await user.save();
      }
    }

    res.json({ message: "Rejected" });
  } catch (err) {
    res.status(500).json({ message: "Failed to reject organization.", error: err.message });
  }
};

// ✅ Remove user from org
const removeUserFromOrganization = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user || !user.organization || user.organization.toString() !== req.user.organization.toString()) {
      return res.status(403).json({ message: "Unauthorized to remove this user." });
    }

    user.organization = null;
    user.applicationStatus = null;
    user.role = "participant";
    await user.save();

    res.json({ message: "User removed from organization.", user });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove user from organization." });
  }
};

const getMyApplicationStatus = async (req, res) => {
  try {
    const orgs = await Organization.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    if (!orgs || orgs.length === 0) {
      return res.status(404).json({ message: "No applications found" });
    }
    
    const applications = orgs.map(org => {
      let status = "pending";
      if (org.approved) {
        status = "approved";
      } else if (org.rejected) {
        status = "rejected";
      }
      
      return {
        id: org._id,
        status: status,
        organizationName: org.name,
        contactPerson: org.contactPerson,
        email: org.email,
        organizationType: org.organizationType,
        purpose: org.purpose,
        website: org.website,
        github: org.github,
        rejectedAt: org.rejectedAt,
        createdAt: org.createdAt,
        approvedAt: org.approved ? org.updatedAt : null,
        isPrimary: org.isPrimary,
        hasPendingChanges: !!org.pendingChanges.submittedAt,
      };
    });
    
    res.json({
      applications: applications,
      totalApplications: applications.length,
      approvedCount: applications.filter(app => app.status === "approved").length,
      rejectedCount: applications.filter(app => app.status === "rejected").length,
      pendingCount: applications.filter(app => app.status === "pending").length,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch application status" });
  }
};

// ✅ Set primary organization
const setPrimaryOrganization = async (req, res) => {
  try {
    const { organizationId } = req.body;
    
    // Verify the organization belongs to the user
    const org = await Organization.findOne({ 
      _id: organizationId, 
      createdBy: req.user._id,
      approved: true 
    });
    
    if (!org) {
      return res.status(404).json({ message: "Organization not found or not approved" });
    }
    
    // Remove primary flag from all user's organizations
    await Organization.updateMany(
      { createdBy: req.user._id },
      { isPrimary: false }
    );
    
    // Set the selected organization as primary
    org.isPrimary = true;
    await org.save();
    
    res.json({ message: "Primary organization updated successfully", organization: org });
  } catch (err) {
    res.status(500).json({ message: "Failed to update primary organization" });
  }
};

// ✅ Submit organization changes for review
const submitOrganizationChanges = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const changes = req.body;
    
    // Verify the organization belongs to the user
    const org = await Organization.findOne({ 
      _id: organizationId, 
      createdBy: req.user._id,
      approved: true 
    });
    
    if (!org) {
      return res.status(404).json({ message: "Organization not found or not approved" });
    }
    
    // Check if there are already pending changes
    if (org.pendingChanges.submittedAt) {
      return res.status(400).json({ message: "You already have pending changes for this organization" });
    }
    
    // Store the current values and new values for change tracking
    const changeHistory = [];
    const allowedFields = ['name', 'contactPerson', 'email', 'organizationType', 'supportNeeds', 'purpose', 'website', 'github'];
    
    allowedFields.forEach(field => {
      if (changes[field] !== undefined && changes[field] !== org[field]) {
        changeHistory.push({
          field: field,
          oldValue: org[field],
          newValue: changes[field],
          submittedAt: new Date(),
          status: 'pending',
        });
      }
    });
    
    // Store pending changes
    org.pendingChanges = {
      ...changes,
      submittedAt: new Date(),
      submittedBy: req.user._id,
    };
    
    // Add to change history
    org.changeHistory.push(...changeHistory);
    
    await org.save();
    
    res.json({ 
      message: "Changes submitted for review", 
      organization: org,
      pendingChanges: org.pendingChanges 
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to submit changes" });
  }
};

// ✅ Get pending changes for admin review
const getPendingChanges = async (req, res) => {
  try {
    const orgsWithPendingChanges = await Organization.find({
      'pendingChanges.submittedAt': { $exists: true, $ne: null }
    }).populate('createdBy', 'name email');
    
    res.json(orgsWithPendingChanges);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch pending changes" });
  }
};

// ✅ Approve organization changes (admin only)
const approveOrganizationChanges = async (req, res) => {
  try {
    const { organizationId } = req.params;
    
    const org = await Organization.findById(organizationId);
    if (!org) {
      return res.status(404).json({ message: "Organization not found" });
    }
    
    if (!org.pendingChanges.submittedAt) {
      return res.status(400).json({ message: "No pending changes found" });
    }
    
    // Apply the pending changes
    const pendingChanges = org.pendingChanges;
    Object.keys(pendingChanges).forEach(key => {
      if (key !== 'submittedAt' && key !== 'submittedBy') {
        org[key] = pendingChanges[key];
      }
    });
    
    // Update change history status
    org.changeHistory.forEach(change => {
      if (change.status === 'pending') {
        change.status = 'approved';
        change.approvedAt = new Date();
        change.reviewedBy = req.user._id;
      }
    });
    
    // Clear pending changes
    org.pendingChanges = {};
    
    await org.save();
    
    res.json({ message: "Changes approved successfully", organization: org });
  } catch (err) {
    res.status(500).json({ message: "Failed to approve changes" });
  }
};

// ✅ Reject organization changes (admin only)
const rejectOrganizationChanges = async (req, res) => {
  try {
    const { organizationId } = req.params;
    
    const org = await Organization.findById(organizationId);
    if (!org) {
      return res.status(404).json({ message: "Organization not found" });
    }
    
    if (!org.pendingChanges.submittedAt) {
      return res.status(400).json({ message: "No pending changes found" });
    }
    
    // Update change history status to rejected
    org.changeHistory.forEach(change => {
      if (change.status === 'pending') {
        change.status = 'rejected';
        change.rejectedAt = new Date();
        change.reviewedBy = req.user._id;
      }
    });
    
    // Clear pending changes (revert to original data)
    org.pendingChanges = {};
    
    await org.save();
    
    res.json({ message: "Changes rejected successfully", organization: org });
  } catch (err) {
    res.status(500).json({ message: "Failed to reject changes" });
  }
};

module.exports = {
  registerOrganization,
  getAllOrganizations,
  getUsersInMyOrganization,
  updateApplicationStatus,
  removeUserFromOrganization,
  getUsersInOrganization,
  approveOrganization,
  rejectOrganization,
  updateMyOrganization,
  getMyOrganization,
  getMyApplicationStatus,
  setPrimaryOrganization,
  submitOrganizationChanges,
  getPendingChanges,
  approveOrganizationChanges,
  rejectOrganizationChanges,
};
