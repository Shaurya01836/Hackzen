const Newsletter = require("../model/NewsletterModel");
const nodemailer = require("nodemailer");
require("dotenv").config(); // ensure dotenv is configured

// Setup nodemailer transporter
const transporter = nodemailer.createTransport({
service: "gmail",
auth: {
user: process.env.MAIL_USER,
pass: process.env.MAIL_PASS,
},
});

// Controller function to send newsletter
const sendNewsletter = async (req, res) => {
const { subject, content } = req.body;

// Basic validation
if (!subject || !content) {
return res.status(400).json({ message: "Subject and content are required." });
}

try {
const subscribers = await Newsletter.find();
const sendPromises = subscribers.map(async (subscriber) => {
  try {
    await transporter.sendMail({
      from: `"HackZen" <${process.env.MAIL_USER}>`,
      to: subscriber.email,
      subject: subject,
      html: `<div style="font-family: Arial, sans-serif; font-size: 16px;">${content}</div>`,
    });
  } catch (err) {
    console.error(`❌ Failed to send to ${subscriber.email}:`, err.message);
  }
});

await Promise.all(sendPromises);

res.status(200).json({ message: "✅ Newsletter sent to all subscribers." });
} catch (error) {
console.error("❌ Newsletter sending failed:", error.message);
res.status(500).json({ message: "Server error while sending newsletter." });
}
};

module.exports = { sendNewsletter };