const jwt = require('jsonwebtoken');
const User = require('../model/UserModel'); // Make sure this path is correct

const protect = async (req, res, next) => {
  let token;

<<<<<<< Updated upstream
=======
  // Check if Authorization header exists and starts with Bearer
>>>>>>> Stashed changes
  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

<<<<<<< Updated upstream
      // Verify token using JWT secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user based on the ID in the token
      const user = await User.findById(decoded.id).select('-passwordHash');

      if (!user) {
        return res.status(401).json({ message: 'User not found, invalid token' });
      }

      req.user = user; // Attach user to request for use in controllers
      next();

=======
      // Decode the token using your secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user and exclude passwordHash
      req.user = await User.findById(decoded.id).select('-passwordHash');

      next(); // continue to the next middleware or route
>>>>>>> Stashed changes
    } catch (err) {
      console.error('JWT verification failed:', err.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
