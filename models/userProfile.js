const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const UserProfile = new mongoose.Schema({
    refId : {
        type: String,
        required: true,
        unique: true
    },
    name : {
        type : String,
        required : true
    },
    address : {
        type : String 
    },
    phone : {
        type : Number
    },
    cartID : {
        type : String
    }
    
});


const UserPro = mongoose.model('UserPro', UserProfile);

module.exports = UserPro;