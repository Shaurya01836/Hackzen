const jwt = require('jsonwebtoken');
const User = require('../model/UserModel'); // Adjust if your file is named differently

const protect = async (req, res, next) => {
  let token;

  // ✅ Check if Authorization header exists and starts with Bearer
  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // ✅ Decode the token using your secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ✅ Find the user and exclude passwordHash
      req.user = await User.findById(decoded.id).select('-passwordHash');

      next(); // ✅ continue to the next middleware or route
    } catch (err) {
      console.error(err);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
