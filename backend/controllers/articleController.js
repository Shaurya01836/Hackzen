const Article = require("../model/ArticleModel");

// ✅ Create a new article (initially pending)
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
      status: "pending", // Starts as pending
      publishedAt: new Date(), // Set submission time
      author: {
        name: req.user?.name || "Current User",
        avatar: req.user?.avatar || "/placeholder.svg",
      },
    });

    await newArticle.save();
    res.status(201).json(newArticle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get only published articles (for public blog page)
exports.getPublishedArticles = async (req, res) => {
  try {
    const userId = req.user?._id;

    const articles = await Article.find({ status: "published" }).sort({
      publishedAt: -1,
    });

    const articlesWithLikedFlag = articles.map((article) => {
      const likedByUser = userId
        ? article.likedBy.includes(userId.toString())
        : false;
      return {
        ...article.toObject(),
        likedByUser,
      };
    });

    res.status(200).json(articlesWithLikedFlag);
  } catch (error) {
    res.status(500).json({ message: "Error fetching articles", error });
  }
};


// ✅ Get all articles (for admin dashboard)
exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find().sort({ publishedAt: -1 });
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching all articles", error });
  }
};

// ✅ Approve article (admin only)
exports.approveArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Article.findById(id);
    if (!article) return res.status(404).json({ message: "Article not found" });

    article.status = "published";
    await article.save();

    res.status(200).json({ message: "Article approved", article });
  } catch (error) {
    res.status(500).json({ message: "Error approving article", error });
  }
};

// ✅ Update article status (admin only)
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await Article.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating status", error });
  }
};

// ✅ Like article (public)
exports.likeArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const article = await Article.findById(id);
    if (!article) return res.status(404).json({ message: "Article not found" });

    const hasLiked = article.likedBy.includes(userId);

    if (hasLiked) {
      // Dislike
      article.likes--;
      article.likedBy.pull(userId);
    } else {
      // Like
      article.likes++;
      article.likedBy.push(userId);
    }

    await article.save();
    res.status(200).json({
      liked: !hasLiked,
      likes: article.likes,
    });
  } catch (err) {
    res.status(500).json({ message: "Error toggling like", error: err.message });
  }
};


