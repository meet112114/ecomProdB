const jwt = require('jsonwebtoken');
const User = require('../models/user');

const LoginAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']; // Get the Authorization header
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized: No authorization header' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token from the 'Bearer <token>' format
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    // Verify the token using the secret key
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    
    // Find the user based on the decoded email from the token
    const rootUser = await User.findOne({ email: decodedToken.email });
    if (!rootUser) {
      return res.status(401).json({ error: 'Unauthorized: User not found' });
    }

    // Attach user information to the request object for use in subsequent handlers
    req.token = token;
    req.rootUser = rootUser;
    req.userID = rootUser._id;
    next(); // Proceed to the next middleware or route handler

  } catch (err) {
    console.error('Authentication error:', err);
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }
};

module.exports = LoginAuth;
