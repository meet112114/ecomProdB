const dotenv = require("dotenv");
const express = require('express');
const session = require('express-session');
const passport = require('./router/passport'); // Corrected path
dotenv.config({path:"./config.env"});
const cors = require('cors');
const app = express();
app.use(cors({
    origin: ['http://localhost:3000', 'http://192.168.1.107:3000']
}));
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET 
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(require('./router/auth'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running at port number ${PORT}`);
});