const jwt = require('jsonwebtoken');
const User = require('../models/user');
const UserPro = require('../models/userProfile');

const LoginAuth = async (req, res, next) => {
  try {
    console.log(req.cookies)
    const token = req.cookies.jwtoken; 
    console.log(token)// Assuming jwtoken is the cookie name
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const rootUser = await User.findOne({ email: decodedToken.email });

    if (!rootUser) {
      return res.status(401).json({ error: 'Unauthorized: User not found' });
    }

    // Setting user info on the request object
    req.token = token;
    req.rootUser = rootUser;
    req.userID = rootUser._id;
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error('Authentication error:', err); // Better logging
    return res.status(401).json({ error: 'Unauthorized: No valid token found' });
  }
};

module.exports = LoginAuth;
