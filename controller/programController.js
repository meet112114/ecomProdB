const Product = require("../models/product");

// const insertProduct = async (req, res) => {
//     try {
//         const productObj = req.body;
//         const newProduct = new Product(productObj);
//         await newProduct.save();

//         res.status(201).json({
//             message: 'Product created successfully',
//             product: newProduct,
//         });
//     } catch (error) {
//         console.error('Error inserting product:', error);

//         res.status(400).json({
//             message: 'Error creating product',
//             error: error.message,
//         });
//     }
// };

const createProductWithImages = async (req, res) => {
    try {
        // Debugging to check what files are being received
        console.log('Files:', req.files);

        const { name, model, category, description, price } = req.body;
        const variants = req.body.variants ? JSON.parse(req.body.variants) : [];

        // Handle the single image file
        const imageUrl = req.files['imageUrl'] ? `/assets/images/${req.files['imageUrl'][0].filename}` : '';

        // Handle the multiple image files
        const imagesUrl = req.files['imagesUrl'] ? req.files['imagesUrl'].map(file => `/assets/images/${file.filename}`) : [];

        const newProduct = new Product({
            name,
            model,
            category,
            description,
            price,
            image_url: imageUrl,
            imagesUrl: imagesUrl,
            variants: variants
        });

        await newProduct.save();

        res.status(201).json({
            message: 'Product created successfully',
            product: newProduct
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({
            message: 'Error creating product',
            error: error.message
        });
    }
};


const updateStock = async(req,res) => {

    const { productId , color  ,size , updatedStock } = req.body ;
    try{

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const variant = product.variants.find(v => v.color === color);
        if (!variant) {
            return res.status(404).json({ message: 'Color variant not found' });
        }

        const sizeObj = variant.sizes.find(s => s.size === size);
        if (!sizeObj) {
            return res.status(404).json({ message: 'Size not found for the specified color' });
        }

        sizeObj.stock = updatedStock;
        await product.save();

        res.status(200).json({
            message: 'Stock updated successfully',
            product
        });

    }catch(err){
        res.send(err)
        console.log(err)
    }
 } 

const GetProducts = async(req,res) => {

    try{
        const ProductsData =await Product.find();
        res.status(200).json(ProductsData)
    }catch(e){
        res.status(400).send(e)
    }
} 

const getProductById = async (req,res) => {
    const id = req.params.id;
    if(!id){
        res.status(404).json("no product id found")
    }else{
        try{

            const product = await Product.findById(id)
            console.log(product);
            res.send(product)

        }catch(err){
            res.status(400).json("internal server error " , err)
        }

    }

}

module.exports = {
    createProductWithImages, updateStock ,GetProducts , getProductById
};