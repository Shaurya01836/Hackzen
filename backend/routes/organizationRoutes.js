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
} = require("../controllers/organizationController");

const validateOrgEmail = require("../middleware/validateOrgEmail");
const { protect, isAdmin, isOrganizerOrAdmin } = require("../middleware/authMiddleware");

// ✅ Register new organization
router.post("/register", validateOrgEmail, registerOrganization);

// ✅ Admin can fetch all organizations
router.get("/", protect, isAdmin, getAllOrganizations);

// ✅ Organizer/Admin: View users in my org
router.get("/users", protect, isOrganizerOrAdmin, getUsersInMyOrganization); // this one is sufficient

// ✅ Organizer/Admin: Approve/reject user
router.patch("/application/:userId", protect, isOrganizerOrAdmin, updateApplicationStatus);

// ✅ Organizer/Admin: Remove user from org
router.delete("/remove/:userId", protect, isOrganizerOrAdmin, removeUserFromOrganization);

router.patch("/:id/approve", protect, isAdmin, approveOrganization);


module.exports = router;
