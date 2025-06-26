const Article = require("../model/ArticleModel");

// Create a new article with status "pending"
exports.createArticle = async (req, res) => {
  try {
    const {
      title,
      excerpt,
      content,
      category,
      tags,
      image,
      readTime,
    } = req.body;

    const newArticle = new Article({
      title,
      excerpt,
      content,
      category,
      tags,
      image,
      readTime,
      status: "pending", // important: starts as pending
      publishedAt: new Date(), // set submission time
      author: {
        name: req.user?.name || "Current User", // attach from auth
        avatar: req.user?.avatar || "/placeholder.svg",
      },
    });

    await newArticle.save();
    res.status(201).json(newArticle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
//   console.log("Received body:", req.body); (check ke liye lgaya tha)
};

// Get only published articles for blogs page
exports.getPublishedArticles = async (req, res) => {
  try {
    const articles = await Article.find({ status: "published" }).sort({
      publishedAt: -1,
    });
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching articles", error });
  }
};

// Admin approves an article (sets status to "published")
exports.approveArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Article.findByIdAndUpdate(
      id,
      { status: "published" },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Article not found" });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error approving article", error });
  }
};
