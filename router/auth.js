const express = require('express');
const passport = require('./passport');
const cookieParser = require("cookie-parser");
require('../database/connection');
const router = express.Router();
const GetProfile = require('../middleware/Profilemiddleware')
const LoginAuth = require('../middleware/jwtmiddleware');
const {   createProductWithImages , updateStock , GetProducts , getProductById , addToCart, getCart ,deleteCartItem ,checkout ,stripeWebhookHandler ,GetOrders} = require("../controller/programController")
const {verifyLogin,  googleRoute, registerRoute , loginRoute , EditProfile, GetData } = require('../controller/accountControllers');

const bodyParser = require('body-parser');
router.post('/webhook', bodyParser.raw({ type: 'application/json' }), stripeWebhookHandler);

router.use(express.json());
router.use(cookieParser());

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)

const path = require('path');
const multer  = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './assets/images')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname); // Get the original file extension
    const originalName = path.basename(file.originalname, ext); // Get the original file name without extension
    cb(null, `${originalName}-${uniqueSuffix}${ext}`); // Save file with original name and extension
  }
})

const upload = multer({ storage: storage })

const uploadFiles = upload.fields([
  { name: 'imageUrl', maxCount: 1 }, // Single image field
  { name: 'imagesUrl', maxCount: 10 } // Multiple images field
]);



// google signin ( Oath2.0 ) routes 
router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
router.get('/google/callback', passport.authenticate('google', { 
    failureRedirect: '/login',
    successRedirect: '/google'
}));

//  account, signin related routes

router.get('/auth/verify' , verifyLogin )
router.get('/google', googleRoute);  // google signin/login route
router.post('/register', registerRoute); // normal signup route 
router.post('/login' , loginRoute);   // normal signin route
router.post('/create/profile' , LoginAuth , GetProfile , EditProfile)   // create profile 
router.get('/get/profile' ,LoginAuth,  GetProfile , GetData) 
router.post('/logout', (req, res) => {
    res.clearCookie('jwtoken', { path: '/' });
    res.status(200).json({ message: 'Logout successful' });
  });

  router.get('/get/products' , GetProducts )
  router.post('/add/product' , uploadFiles , createProductWithImages)
  router.put('/update/stock' , updateStock)
  router.get('/get/product/:id' , getProductById )
  router.post('/add/cart' , LoginAuth , GetProfile , addToCart)
  router.get('/get/cart', LoginAuth , GetProfile  , getCart )
  router.delete("/delete/cart-item/:itemId", LoginAuth , GetProfile ,deleteCartItem)
  router.post("/checkout" ,LoginAuth , GetProfile,  checkout)
  router.get("/get/orders" ,LoginAuth , GetProfile, GetOrders)



module.exports = router;
