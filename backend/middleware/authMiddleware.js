const jwt = require("jsonwebtoken");
const User = require("../model/UserModel"); // Adjust if needed

// Middleware: Require Auth
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-passwordHash");
      if (!user) {
        return res.status(401).json({ message: "User not found for token" });
      }

      req.user = user;
      next();
    } catch (err) {
      console.error("JWT error:", err.message);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  } else {
    return res.status(401).json({ message: "No token provided in Authorization header" });
  }
};

// Middleware: Admin Only
const isAdmin = (req, res, next) => {
  if (req.user?.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Access denied: Admins only" });
};

// Middleware: Organizer or Admin
const isOrganizerOrAdmin = (req, res, next) => {
  const role = req.user?.role;
  if (role === "organizer" || role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Access denied: Organizer or Admins only" });
};

module.exports = {
  protect,
  isAdmin,
  isOrganizerOrAdmin,
};
