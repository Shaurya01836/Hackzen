const {
  createArticle,
  getPublishedArticles,
  approveArticle,
  getAllArticles,
  updateStatus,
  likeArticle, // 👈 Add this
} = require("../controllers/articleController");

const { isAuthenticated, isAdmin } = require("../middleware/authMiddleware");

const router = require("express").Router();

router.post("/", isAuthenticated, createArticle);
router.get("/", isAuthenticated, getPublishedArticles);
router.get("/all", isAuthenticated, isAdmin, getAllArticles);

router.patch("/approve/:id", isAuthenticated, isAdmin, approveArticle);
router.patch("/status/:id", isAuthenticated, isAdmin, updateStatus);

// 👇 This is the new PATCH route for likes (no auth needed)
router.patch("/:id/like", isAuthenticated, likeArticle);

module.exports = router;
