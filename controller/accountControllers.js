const bcrypt = require('bcrypt');
const User = require('../models/user');
const UserPro = require('../models/userProfile')
const jwt = require('jsonwebtoken');
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const verifyLogin = (req , res) => {
  const token = req.cookies.jwtoken; 

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  // Verify the token
  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token is invalid or expired' });
    }

    // Send back user data if token is valid
    res.status(200).json({ user });
  });
}
const googleRoute = async (req, res) => {
  if (req.user) {
    const email = req.user.emails[0].value;
    const name = req.user.displayName;
    const googleId = req.user.id;
    try {
      let user = await User.findOne({ email });

      if (!user) {
        user = new User({ email, googleId, name });
        await user.save();
        const userprofile = new UserPro({ refId: user._id, name})
        await userprofile.save();
        console.log('User saved successfully.');

        let token = jwt.sign({  email },process.env.SECRET_KEY, { expiresIn: '1d' });
      
        res.cookie('jwtoken', token, {
        expires: new Date(Date.now() + 2589200000),
        httpOnly: true
        });

        res.redirect(`${BASE_URL}/google`);

      } else if (user.password) {
        return res.status(400).json({ message: 'User email exists with normal registration' });
      } 
      else {
      console.log('hi')
      let token = jwt.sign({  email },process.env.SECRET_KEY, { expiresIn: '1d' });
      console.log('Generated Token:', token);
      
      res.cookie('jwtoken', token, {
        expires: new Date(Date.now() + 2589200000),
        httpOnly: true
      });

      res.redirect(`${BASE_URL}/google`);
      }

    } catch (error) {
      console.error('Error handling user login:', error);
      res.status(500).json({ error: "An error occurred while processing the login" });
    }
  } else {
    res.status(400).json({ message: "Error logging in, try again later" });
  }
};




const registerRoute = async (req, res) => {
    if (req.body) {
      const { email, name, password } = req.body;
      const user = await User.findOne({ email });
  
      if (!user) {
        try {
          const newUser = new User({ email, password, name });
          await newUser.save();
          const userprofile = new UserPro({ refId: newUser._id, name})
          await userprofile.save();
          console.log('User saved successfully.');
          res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
          console.error('Error saving user:', error);
          res.status(500).json({ error: 'An error occurred while registering the user' });
        }
      } else if (user.googleId) {
        res.status(400).json({ message: 'User email exists with Google login' });
      } else {
        res.status(401).json({ message: 'User email already registered' });
      }
    } else {
      res.status(402).json({ message: 'Request body is missing' });
    }
  };
  



  const loginRoute = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
  
      const userLogin = await User.findOne({ email });
      if (!userLogin) {
        return res.status(400).json({ message: 'User not found' });
      }
      else if(!userLogin.password){
        return res.status(401).json({ message: 'User is registered with google' });
      }else{
        const isMatch = await bcrypt.compare(password, userLogin.password);
        if (!isMatch) {
          return res.status(400).json({ error: 'Invalid credentials' });
        }
    
        const token = jwt.sign({ email: userLogin.email }, process.env.SECRET_KEY, { expiresIn: '7d' });
    
        res.cookie('jwtoken', token, {
          expires: new Date(Date.now() + 2589200000),
          httpOnly: true,
        });
    
        return res.json({ message: 'User login successful', token });
      }     
      
     
    } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };


  
const EditProfile = async (req, res) => {
    if (req.body) {
      const { name, age, gender, height, weight } = req.body;
      const refId = req.userID;
  
      if (!refId ) {
        return res.status(400).json({ error: "refId" });
      }
  
      try {
        const updatedUserPro = await UserPro.findOneAndUpdate(
          { refId },
          { name, age, gender, height, weight },
          { new: true, upsert: true } 
        );
  
        if (updatedUserPro) {
          res.status(200).json(updatedUserPro);
        } else {
          res.status(400).json({ error: "Error updating profile" });
        }
        
      } catch (error) {
        res.status(500).json({ error: "An error occurred while creating the profile" });
      }
    } else {
      res.status(400).json({ error: "Request body is missing" });
    }
  };

  const GetData = async(req , res) => {
    const refId = req.userID;
    const existingUserPro = await UserPro.findOne({ refId })
    res.json(existingUserPro)
  }

module.exports = { verifyLogin, googleRoute, registerRoute , loginRoute , EditProfile , GetData };