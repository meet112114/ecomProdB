const dotenv = require("dotenv");
const express = require('express');
const session = require('express-session');
const path = require('path');
const passport = require('./router/passport');  // Corrected path to passport
dotenv.config({ path: "./config.env" });
const cors = require('cors');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

// Define allowed origins for CORS
const allowedOrigins = ['http://localhost:3000', 'https://ecomprodb.onrender.com'];

// Apply CORS middleware globally
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,  // Allow credentials like cookies and sessions
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
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
