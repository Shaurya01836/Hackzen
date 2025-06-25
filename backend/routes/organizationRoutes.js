const express = require("express");
const router = express.Router();

const {
   registerOrganization,
  getAllOrganizations,
  getUsersInMyOrganization,
  updateApplicationStatus,
  removeUserFromOrganization,
  getUsersInOrganization,
  approveOrganization, // ✅ ADD THIS
  rejectOrganization ,updateMyOrganization
} = require("../controllers/organizationController");

const upload = require("../middleware/cloudinaryUpload");
const validateOrgEmail = require("../middleware/validateOrgEmail");
const { protect, isAdmin, isOrganizerOrAdmin } = require("../middleware/authMiddleware");

// ✅ Register new organization
router.post("/register", validateOrgEmail, registerOrganization);
router.post("/upload-logo", protect, upload.single("logo"), (req, res) => {
  if (!req.file || !req.file.path) {
    return res.status(400).json({ message: "No file uploaded." });
  }
  res.status(200).json({ url: req.file.path });
});
// ✅ Admin can fetch all organizations
router.get("/", protect, isAdmin, getAllOrganizations);

// ✅ Organizer/Admin: View users in my org
router.get("/users", protect, isOrganizerOrAdmin, getUsersInMyOrganization); // this one is sufficient
router.put("/edit", protect, isOrganizerOrAdmin, updateMyOrganization);
// ✅ Organizer/Admin: Approve/reject user
router.patch("/application/:userId", protect, isOrganizerOrAdmin, updateApplicationStatus);

// ✅ Organizer/Admin: Remove user from org
router.delete("/remove/:userId", protect, isOrganizerOrAdmin, removeUserFromOrganization);

router.patch("/:id/approve", protect, isAdmin, approveOrganization);
router.patch("/:id/reject", protect, isAdmin, rejectOrganization);


module.exports = router;
