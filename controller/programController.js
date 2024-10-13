const Product = require("../models/product");
const UserPro = require("../models/userProfile");


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
            
            res.send(product)

        }catch(err){
            res.status(400).json("internal server error " , err)
        }

    }

}

const addToCart = async (req, res) => {
    const user = req.userProfile; // Get user profile from request
    const { productId, color, size } = req.body; // Destructure body for product details

    if (!productId || !color || !size) {
        return res.status(400).json({ error: 'Product ID, color, and size are required.' });
    }

    try {
        const userId = user._id; 
        const userProfile = await UserPro.findById(userId); 

        if (!userProfile) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const cartItem = {
            productId,
            color,
            size
        };

        // Check if item already exists in the cart
        const existingCartItemIndex = userProfile.cart.findIndex(item => 
            item.productId.toString() === productId && item.color === color && item.size === size
        );

        if (existingCartItemIndex > -1) {
            return res.status(409).json({ message: 'Item already exists in the cart.' });
        }

        userProfile.cart.push(cartItem);
        await userProfile.save(); 

        res.status(200).json({ message: 'Item added to cart successfully!', cart: userProfile.cart });

    } catch (error) {
        console.error('Error adding item to cart:', error); 
        res.status(500).json({ error: 'Failed to add item to cart. Please try again later.' });
    }
};

const getCart = async(req,res) => {
    const user = req.userProfile; 
    const userProfile = await UserPro.findById(user._id);
    try{
        if(userProfile){
            res.status(200).send(userProfile.cart)
        }else{
            res.status(400).json("Not Found")
        }
    }catch(error){
        console.error('Error getting cart:', error); 
        res.status(500).json({ error: ' Please try again later.' });
    }
}

const deleteCartItem =  async (req, res) => {
    const userId = req.userProfile._id; 
    const itemId = req.params.itemId;

    try {
        // Find the user by their ID
        const user = await UserPro.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find the cart item by ID and remove it
        const updatedCart = user.cart.filter(item => item._id.toString() !== itemId);

        if (updatedCart.length === user.cart.length) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        user.cart = updatedCart;
        await user.save();

        return res.status(200).json({ message: 'Cart item deleted successfully', cart: user.cart });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = {
    createProductWithImages, updateStock ,GetProducts , getProductById ,addToCart , getCart ,deleteCartItem
};