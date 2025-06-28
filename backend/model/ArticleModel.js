const mongoose = require('mongoose');
const ArticleSchema = require('../schema/ArticleSchema'); // ❌ no destructuring here

const Article = mongoose.models.Article || mongoose.model('Article', ArticleSchema);

module.exports = Article;
