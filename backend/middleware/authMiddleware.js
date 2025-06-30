const jwt = require("jsonwebtoken");
const User = require("../model/UserModel"); // Adjust if needed

// Middleware: Require Auth
const protect = async (req, res, next) => {
  let token;

  console.log('Auth middleware called:', {
    hasAuthHeader: !!req.headers.authorization,
    authHeader: req.headers.authorization ? req.headers.authorization.substring(0, 20) + '...' : 'none',
    method: req.method,
    path: req.path
  });

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];

    try {
      if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET is not set in environment variables');
        return res.status(500).json({ message: "Server configuration error" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decoded successfully:', { userId: decoded.id });

      const user = await User.findById(decoded.id).select("-passwordHash");
      if (!user) {
        console.error('User not found for token:', decoded.id);
        return res.status(401).json({ message: "User not found for token" });
      }

      console.log('User authenticated:', { userId: user._id, email: user.email });
      req.user = user;
      next();
    } catch (err) {
      console.error("JWT error:", err.message);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  } else {
    console.error('No Bearer token provided');
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

const isAuthenticated = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-passwordHash");
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};



module.exports = {
  protect,
  isAdmin,
  isOrganizerOrAdmin,
   isAuthenticated,
};