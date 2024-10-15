const dotenv = require("dotenv");
const express = require('express');
const session = require('express-session');
const path = require('path');
const passport = require('./router/passport'); // Corrected path
dotenv.config({path:"./config.env"});
const cors = require('cors');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)

const allowedOrigins = ['http://localhost:3000', 'https://ecomprodb.onrender.com'];

app.options('*', cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET 
}));

app.use(passport.initialize());
app.use(passport.session());


app.use(require('./router/auth'));
app.use('/assets/images', express.static(path.join(__dirname, './assets/images')));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running at port number ${PORT}`);
});

