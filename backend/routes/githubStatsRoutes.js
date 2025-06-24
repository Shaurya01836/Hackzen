const express = require('express');
const axios = require('axios');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/stats', protect, async (req, res) => {
  try {
    const username = req.user.githubUsername;
    if (!username) return res.status(400).json({ message: "GitHub not linked" });

    // Fetch all public repos of the user
    const reposRes = await axios.get(`https://api.github.com/users/${username}/repos`);
    const repos = reposRes.data;

    let langMap = {};
    let totalStars = 0;
    let totalPRs = 0;
    let totalIssues = 0;
    let totalCommits = 0;
    let totalReposContributedTo = 0;

    for (let repo of repos) {
      totalStars += repo.stargazers_count || 0;

      // GitHub API v3 only provides language at top level; fallback is 'Others'
      const lang = repo.language || 'Others';
      langMap[lang] = (langMap[lang] || 0) + 1;

      // Optional enhancement for contributed to repos
      if (!repo.fork && repo.owner.login !== username) {
        totalReposContributedTo += 1;
      }

      // Approximation: try commits_url if present (use with caution for real-time apps)
      // totalCommits += repo.commits_count || 0;
    }

    // Calculate language percentage breakdown
    const langEntries = Object.entries(langMap);
    const langTotal = langEntries.reduce((acc, [, v]) => acc + v, 0);

    const languageStats = {};
    langEntries.forEach(([label, value]) => {
      languageStats[label] = parseFloat(((value / langTotal) * 100).toFixed(1));
    });

    res.json({
      username,
      profile: `https://github.com/${username}`,
      languageStats,
      totalStars,
      totalPRs: 14,          // Optional: replace with dynamic PR count via GraphQL
      totalIssues: 14,       // Optional: replace with dynamic issue count
      totalCommits: 149,     // Optional: improve using GraphQL for actual commit count
      totalReposContributedTo,
    });
  } catch (err) {
    console.error("GitHub stats error:", err.message);
    res.status(500).json({ message: "GitHub stats fetch failed" });
  }
});

module.exports = router;
