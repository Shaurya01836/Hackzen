const express = require("express");
const {
  createArticle,
  getPublishedArticles,
  approveArticle,
} = require("../controllers/articleController");
const { isAuthenticated, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", isAuthenticated, createArticle);
router.get("/", getPublishedArticles);
router.patch("/approve/:id", isAdmin, approveArticle); // only admin

module.exports = router;
