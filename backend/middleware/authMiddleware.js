const jwt = require('jsonwebtoken');
const User = require('../model/UserModel'); // Make sure this path is correct

// ✅ Protect any route (requires valid token)
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log("🪪 Incoming token:", token); // 🔍 Step 3 log

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("🔓 Decoded Token:", decoded); // 🔍 Step 3 log

      const user = await User.findById(decoded.id).select('-passwordHash');
      if (!user) {
        console.log("❌ No user found for decoded ID:", decoded.id); // 🔍 Step 3 log
        return res.status(401).json({ message: 'User not found, invalid token' });
      }

      req.user = user;
      console.log("✅ User found and attached to req.user:", user.email); // 🔍 Optional

      next();
    } catch (err) {
      console.error('JWT verification failed:', err.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// ✅ Admin-only access
const isAdmin = (req, res, next) => {
  if (req.user?.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admins only' });
  }
};

// ✅ Organizer or Admin access
const isOrganizerOrAdmin = (req, res, next) => {
  const role = req.user?.role;
  if (role === 'organizer' || role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Organizer or Admins only' });
  }
};

module.exports = { protect, isAdmin, isOrganizerOrAdmin };
