const dotenv = require("dotenv");
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo'); // Import connect-mongo
const mongoose = require('mongoose');
const path = require('path');
const passport = require('./router/passport');  // Corrected path to passport
dotenv.config({ path: "./config.env" });
const cors = require('cors');
const app = express();

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);


const allowedOrigins = [
  'http://localhost:3000', 
  'https://ecomprodb.onrender.com',
  'https://ecomprodf.onrender.com'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests from allowed origins or no origin (like Postman)
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS')); // Reject the request
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // This must be true to allow cookies and credentials
};

app.use(cors(corsOptions));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ 
        mongoUrl: process.env.MONGODB_URI, // MongoDB connection string
        collectionName: 'sessions', // Optional: name of the sessions collection
    }),
    cookie: {
        secure: true, // Set to true for production; ensure you use HTTPS
        httpOnly: true,
        sameSite: 'none' // Allow cross-origin cookies
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
