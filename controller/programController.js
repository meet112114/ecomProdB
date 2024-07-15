const Program = require('../models/program')
const User = require('../models/user');
const UserPro = require('../models/userProfile')

const addProgram = async (req, res) => {
    const { programName } = req.body;

  
    if (!programName) {
      return res.status(400).send('Program name is required');
    }
  
    try {
      const newProgram = new Program({
        programName
      });
  
      await newProgram.save();
      res.status(201).send(newProgram);
    } catch (error) {
      res.status(500).send('Server error');
    }
  };

  

  module.exports = {addProgram}