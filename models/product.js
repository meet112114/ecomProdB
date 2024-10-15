const mongoose = require('mongoose');


const sizeSchema = new mongoose.Schema({
    size: { type: String, required: true },
    stock: { type: Number, required: true }  
});

const variantSchema = new mongoose.Schema({
    color: { type: String, required: true },  
    sizes: [sizeSchema]                        
});

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },       
    model: { type: String, required: true },
    category: {type: String , required :true},
    fabric:{type : String},
    design:{type: String },
    description: { type: String, required: true },
    price: { type: Number, required: true },      
    image_url: { type: String, required: true }, 
    imagesUrl : [{type:String }],
    variants: [variantSchema]                      
});


const Product = mongoose.model('Product', productSchema);

module.exports = Product;

