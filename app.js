const dotenv = require("dotenv");
const express = require('express');
const session = require('express-session');
const path = require('path');
const passport = require('./router/passport');  // Corrected path to passport
dotenv.config({ path: "./config.env" });
const cors = require('cors');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
// Update CORS to specify the allowed origin
app.use(cors({ 
  origin: 'http://localhost:3000', // Use the full URL with http/https and port
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials: true // This must be true to allow credentials (cookies)
}));

app.options('*', cors());

// Express session configuration
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  cookie: {
    secure: true, // Set to true for production with HTTPS
    httpOnly: true, 
    sameSite: 'none' // Necessary for cross-origin requests
  }
}));


// Initialize passport for authentication
app.use(passport.initialize());
app.use(passport.session());

// Auth routes and static assets
app.use(require('./router/auth'));

// Serve static files (like images)
app.use('/assets/images', express.static(path.join(__dirname, './assets/images')));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running at port number ${PORT}`);
});
