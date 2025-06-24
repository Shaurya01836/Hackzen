// middleware/validateOrgEmail.js

const disallowedDomains = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "protonmail.com",
  "icloud.com",
  "aol.com",
  "zoho.com",
  "mail.com",
  "gmx.com"
];

const validateOrgEmail = (req, res, next) => {
  const { email } = req.body;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ message: "A valid email address is required." });
  }

  const trimmedEmail = email.trim().toLowerCase();
  const domain = trimmedEmail.split("@")[1];

  if (!domain) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  if (disallowedDomains.includes(domain)) {
    return res.status(400).json({
      message: "Please use an official organization email address, not a public provider.",
    });
  }

  next();
};

module.exports = validateOrgEmail;
