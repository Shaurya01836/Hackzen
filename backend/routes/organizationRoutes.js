const express = require("express");
const router = express.Router();

const {
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
} = require("../controllers/organizationController");

const upload = require("../middleware/cloudinaryUpload");
const validateOrgEmail = require("../middleware/validateOrgEmail");
const { protect, isAdmin, isOrganizerOrAdmin } = require("../middleware/authMiddleware");

// ✅ Register new organization (Public route)
router.post("/register", protect, validateOrgEmail, registerOrganization);

// ✅ Upload org logo (Organizer/Admin only)
router.post("/upload-logo", protect, upload.single("logo"), (req, res) => {
  if (!req.file || !req.file.path) {
    return res.status(400).json({ message: "No file uploaded." });
  }
  res.status(200).json({ url: req.file.path });
});

// ✅ Admin: View all organizations
router.get("/", protect, isAdmin, getAllOrganizations);

// ✅ Organizer/Admin: View users in my organization
router.get("/users", protect, isOrganizerOrAdmin, getUsersInMyOrganization);

// ✅ Organizer/Admin: Edit organization info
router.put("/edit", protect, isOrganizerOrAdmin, updateMyOrganization);

// ✅ Organizer/Admin: Approve or reject user application to org
router.patch("/application/:userId", protect, isOrganizerOrAdmin, updateApplicationStatus);

// ✅ Organizer/Admin: Remove user from organization
router.delete("/remove/:userId", protect, isOrganizerOrAdmin, removeUserFromOrganization);
router.get("/my", protect, getMyOrganization);
// ✅ Admin: Approve or Reject entire organization
router.patch("/:id/approve", protect, isAdmin, approveOrganization);
router.patch("/:id/reject", protect, isAdmin, rejectOrganization);

router.get("/my-application", protect, getMyApplicationStatus);

module.exports = router;
