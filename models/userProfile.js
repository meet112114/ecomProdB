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
    age : {
        type: Number,
        required : true,
    },
    gender : {
        type: String,
        required : true,
    },
    height : {
        type: Number,
    },
    weight : {
        type: Number,
    },
    program : [
        {
            ProgramId : {
                type : String,
            }
           
        }
    ]

});


const UserPro = mongoose.model('UserPro', UserProfile);

module.exports = UserPro;