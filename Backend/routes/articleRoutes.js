const {
  createArticle,
  getPublishedArticles,
  approveArticle,
  getAllArticles,
  updateStatus,
} = require("../controllers/articleController");

const { isAuthenticated, isAdmin } = require("../middleware/authMiddleware");

const router = require("express").Router();

router.post("/", isAuthenticated, createArticle);
router.get("/", getPublishedArticles);
router.get("/all", isAuthenticated, isAdmin, getAllArticles);

router.patch("/approve/:id", isAuthenticated, isAdmin, approveArticle);
router.patch("/status/:id", isAuthenticated, isAdmin, updateStatus);

module.exports = router;
