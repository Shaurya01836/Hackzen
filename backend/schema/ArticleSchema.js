const { Schema } = require('mongoose');


const ArticleSchema = new Schema({
  title: {
    type: String,
    required: [true, "Article title is required"],
  },
  excerpt: {
    type: String,
    required: [true, "Article excerpt is required"],
  },
  content: {
    type: String,
    required: [true, "Article content is required"],
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: [
      "Web Development",
      "AI/ML",
      "Blockchain",
      "Cybersecurity",
      "Mobile",
      "DevOps",
    ],
  },
  tags: {
    type: [String],
    required: [true, "At least one tag is required"],
  },
  image: {
    type: String, // URL or Base64 string
    default: "",  // optional
  },
  readTime: {
    type: Number,
    required: [true, "Read time is required"],
    min: [1, "Read time must be at least 1 minute"],
  },
  author: {
    name: {
      type: String,
      default: "Anonymous",
    },
    avatar: {
      type: String,
      default: "/placeholder.svg",
    },
    role: {
      type: String,
      default: "Content Creator",
    },
  },
  publishedAt: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Number,
    default: 0,
  },
  comments: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["pending", "published", "draft"],
    default: "pending",
  },
});

module.exports = ArticleSchema;
