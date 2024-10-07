const jwt = require('jsonwebtoken');
const UserPro  = require('../models/userProfile') 

const GetProfile = async (req, res, next) => {
  try {
   
    const userProfile = await UserPro.findOne({refId:req.rootUser._id})
    
    if(!userProfile ){
      return res.status(401).send('User Profile not found');
    } 
    req.userProfile = userProfile ;
    next();

  } catch (err) {
    res.status(401).send('Unauthorized: No valid token found');
    console.log(err);
  }
};

module.exports = GetProfile;