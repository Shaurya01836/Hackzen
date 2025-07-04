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

    const existing = await Organization.findOne({ email });
    if (existing) {
      // If there's an existing application, check if it was rejected
      if (existing.rejected) {
        // Allow reapplication by updating the existing record
        existing.name = name;
        existing.contactPerson = contactPerson;
        existing.whatsapp = whatsapp;
        existing.telegram = telegram;
        existing.organizationType = organizationType;
        existing.supportNeeds = supportNeeds;
        existing.purpose = purpose;
        existing.website = website;
        existing.github = github;
        existing.approved = false;
        existing.rejected = false;
        existing.rejectedAt = null;
        existing.createdAt = new Date(); // Reset creation date
        await existing.save();

        // Update user applicationStatus to "submitted"
        const user = await User.findById(req.user._id);
        user.applicationStatus = "submitted";
        await user.save();

        res.status(200).json({ message: "Application resubmitted successfully", organization: existing });
        return;
      } else {
        return res.status(409).json({ message: "You've already submitted an organization application." });
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

// ✅ Get current user's organization
const getMyOrganization = async (req, res) => {
  try {
    const user = req.user;

    if (!user.organization) {
      return res.status(404).json({ message: "You are not part of any organization" });
    }

    const org = await Organization.findById(user.organization);
    if (!org) {
      return res.status(404).json({ message: "Organization not found" });
    }

    res.status(200).json({
      ...org.toObject(),
      applicationStatus: user.applicationStatus,
    });
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
    const org = await Organization.findOne({ createdBy: req.user._id });
    if (!org) {
      return res.status(404).json({ message: "No application found" });
    }
    
    let status = "pending";
    if (org.approved) {
      status = "approved";
    } else if (org.rejected) {
      status = "rejected";
    }
    
    // For debugging (uncomment if needed)
    // console.log("Application status check:", {
    //   orgId: org._id,
    //   approved: org.approved,
    //   rejected: org.rejected,
    //   finalStatus: status,
    //   createdAt: org.createdAt,
    //   rejectedAt: org.rejectedAt
    // });
    
    res.json({
      status: status,
      organizationName: org.name,
      contactPerson: org.contactPerson,
      rejectedAt: org.rejectedAt,
      createdAt: org.createdAt,
      // add more org fields if needed
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch application status" });
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
};
