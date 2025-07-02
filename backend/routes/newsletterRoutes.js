const express = require("express");
const router = express.Router();
const { sendNewsletter } = require("../controllers/newsletterController");
const Newsletter = require("../model/NewsletterModel");

// Route to send styled newsletter using the controller
router.post("/send-newsletter", sendNewsletter);

// Route to subscribe a new email
router.post("/subscribe", async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  try {
    const existing = await Newsletter.findOne({ email });

    if (existing) {
      return res.status(200).json({ message: "Already subscribed" });
    }

    const newSub = new Newsletter({ email });
    await newSub.save();

    res.status(201).json({ message: "Subscribed successfully" });
  } catch (err) {
    console.error("❌ Subscription error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
