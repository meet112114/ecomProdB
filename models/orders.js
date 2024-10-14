const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    productId: { type: String, required: true }, 
    color: { type: String, required: true }, 
    size: { type: String, required: true },                      
});

const OrderSchema = new mongoose.Schema({
    customerEmail: { type: String, required: true },
    status:{type:String , default:"Ordered"},       
    amountTotal: { type: String, required: true },
    currency: {type: String , required :true},
    paymentStatus: { type: String, required: true },
    paymentIntent: { type: String, required: true },      
    userId: { type: String, required: true }, 
    items: [CartSchema]                      
});

const Orders = mongoose.model("Orders" , OrderSchema)

module.exports = Orders