const express = require("express");
const Newsletter = require("../model/NewsletterModel");
const nodemailer = require("nodemailer");
require("dotenv").config();

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

router.post("/send-newsletter", async (req, res) => {
  const { subject, content } = req.body;

  if (!subject || !content) {
    return res.status(400).json({ message: "Subject and content required" });
  }

  try {
    const subscribers = await Newsletter.find();

   const sendPromises = subscribers.map(async (user) => {
  try {
    await transporter.sendMail({
      from: `"HackZen" <${process.env.MAIL_USER}>`,
      to: user.email,
      subject,
      html: `<div style="font-family: Arial; font-size: 16px;">${content}</div>`,
    });
  } catch (error) {
    console.error(`Failed to send to ${user.email}:`, error.message);
  }
});

    await Promise.all(sendPromises);

    res.status(200).json({ message: "Newsletter sent to all subscribers." });
  } catch (err) {
    console.error("Sending Error:", err);
    res.status(500).json({ message: "Failed to send emails." });
  }
});

router.post("/subscribe", async (req, res) => {
const { email } = req.body;
if (!email || !email.includes("@")) {
return res.status(400).json({ message: "Invalid email" });
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