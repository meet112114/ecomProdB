const dotenv = require("dotenv");
const express = require('express');
const session = require('express-session');
const path = require('path');
const passport = require('./router/passport');  // Corrected path to passport
dotenv.config({ path: "./config.env" });
const cors = require('cors');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

app.use(cors({ 
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  headers: ['Content-Type', 'Authorization'], 
  credentials: true // <--- Add this line
}));

// Handle preflight CORS requests for all routes
app.options('*', cors());

// Express session configuration
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  cookie: {
    secure: process.env.NODE_ENV === 'production',  // Use secure cookies in production
    sameSite: 'lax',  // Allows CORS credentials sharing with cross-origin
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
