const express = require('express');
const passport = require('./passport');
require('../database/connection');
const router = express.Router();
router.use(express.json());
const cookieParser = require("cookie-parser");
router.use(cookieParser());
const GetProfile = require('../middleware/Profilemiddleware')
const LoginAuth = require('../middleware/jwtmiddleware');
const {  googleRoute, registerRoute , loginRoute , EditProfile, GetData } = require('../controller/accountControllers');


// google signin ( Oath2.0 ) routes 
router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
router.get('/auth/google/callback', passport.authenticate('google', { 
    failureRedirect: '/login',
    successRedirect: '/google'
}));

//  account, signin related routes

router.get('/google', googleRoute);  // google signin/login route
router.post('/register', registerRoute); // normal signup route 
router.post('/login' , loginRoute);   // normal signin route
router.post('/create/profile' , LoginAuth , GetProfile , EditProfile)   // create profile 
router.get('/get/profile' ,LoginAuth,  GetProfile , GetData) 
router.post('/logout', (req, res) => {
    res.clearCookie('jwtoken', { path: '/' });
    res.status(200).json({ message: 'Logout successful' });
  });



module.exports = router;