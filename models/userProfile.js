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
    cart: [
        {   
            productId : {
                type: String,
                required :true
            },
            color : {
                type: String,
                required :true
            },
            size : {
                type: String,
                required :true
            }

        }
    ],
    orders: [
        {   
            orderId: {
                type : String
            }
        }
    ]
    
});


const UserPro = mongoose.model('UserPro', UserProfile);

module.exports = UserPro;