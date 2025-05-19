const Product = require("../models/Product")
const Category = require("../models/Category");
const Tag = require("../models/Tag")
const User = require('../models/User');
const {uploadImageToCloudinary} = require('../utils/imageUploader')
require("dotenv").config();

//Function to create Product
exports.createProduct = async (req,res) => {
    try{
        //fetch data
        const { title, description, price, discount, sizes, colors, stock, images, category, tags } = req.body;

        // Validate inputs
        if (!title || !description || !price || !category || !tags || tags.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });
        }

        // Check if category exists
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(400).json({
                success: false,
                message: "Invalid category"
            });
        }

        const validTags = await Tag.find({ '_id': { $in: tags } });
        if (validTags.length !== tags.length) {
            return res.status(400).json({
                success: false,
                message: "Some of the tags are invalid"
            });
        }

        // Handle images
        let imageUrls = [];
        if (req.files && req.files.length > 0) {
            for (let i = 0; i < req.files.length; i++) {
                const result = await uploadImageToCloudinary(req.files[i],process.env.FOLDER_NAME, 500, 'auto');  // Upload to Cloudinary
                imageUrls.push(result.secure_url);  // Add image URL to the array
            }
        }

        //Check For Seller
        const sellerId = req.user.id;

        // Create Product
        const newProduct = await Product.create({
            title,
            description,
            price,
            discount: discount || 0,
            sizes: sizes ? JSON.parse(sizes) : [],  // In case sizes comes as JSON string
            colors: colors ? JSON.parse(colors) : [],
            stock,
            images: imageUrls,
            seller: sellerId,
            categories: category
        });

        // Update the seller's product list
        await User.findByIdAndUpdate(sellerId, {
            $push: { productsListed: newProduct._id }
        });

        // For each tag, add the product to its products array
        for (let tagId of tags) {
            await Tag.findByIdAndUpdate(tagId, {
                $push: { products: newProduct._id }
            });
        }

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            product: newProduct
        });

    }
    catch(error){
        console.error("Error creating product:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while creating product"
        });
    }
}

//fuction to get all products
exports.getAllProducts = async (req, res) => {
    try {
        const allProducts = await Product.find({},{
            title:true,
            description:true,
            seller:true
        })
        .populate("seller")
        .exec();

        // If no products found
        if (allProducts.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No products found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'All products fetched successfully',
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching products',
            error: error.message
        });
    }
};

//Funtion to get Product Detail
exports.getProductDetails = async (req, res) => {
    const { productId } = req.params;

    if (!productId) {
        return res.status(400).json({
            success: false,
            message: "Product ID is required",
        });
    }

    try {
        const product = await Product.findById(productId)
            .populate("seller", "name email") // Only populate selected fields
            .populate("category", "name")     // assuming your category model has a name
            .populate("tags", "name")         // assuming your tag model has a name
            .populate({
                path: "ratingAndReviews",
                populate: {
                    path: "user"
                }
            });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            product,
        });

    } catch (error) {
        console.error("Error fetching product details:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};