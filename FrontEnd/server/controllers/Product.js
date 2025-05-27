const Product = require("../models/Product");
const Category = require("../models/Category");
const Tag = require("../models/Tag");
const User = require('../models/User');
const { uploadImageToCloudinary } = require('../utils/imageUploader');
require("dotenv").config();


//Function to create Product
exports.createProduct = async (req, res) => {
    try {
        // Extract and parse data from request body
        const {
            title,
            description,
            price,
            discount,
            sizes,
            colors,
            stock,
            category,
            tags
        } = req.body;

        // Parse sizes, colors, and tags from JSON strings (if provided)
        const parsedSizes = sizes ? JSON.parse(sizes) : [];
        const parsedColors = colors ? JSON.parse(colors) : [];
        const parsedTags = tags ? JSON.parse(tags) : [];

        // Validate required fields
        if (!title || !description || !price || !category || parsedTags.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields",
            });
        }

        // Validate category existence
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(400).json({
                success: false,
                message: "Invalid category",
            });
        }

        // Validate tags existence
        const validTags = await Tag.find({ '_id': { $in: parsedTags } });
        if (validTags.length !== parsedTags.length) {
            return res.status(400).json({
                success: false,
                message: "Some of the tags are invalid",
            });
        }

        // Handle image uploads
        let imageUrls = [];
        if (req.files && req.files.images) {
            const imagesArray = Array.isArray(req.files.images)
                ? req.files.images
                : [req.files.images]; // Wrap single image in array

            for (let image of imagesArray) {
                const result = await uploadImageToCloudinary(
                    image,
                    process.env.FOLDER_NAME_1,
                    500,
                    'auto'
                );
                imageUrls.push(result.secure_url);
            }
        }

        // Get seller ID from authenticated user
        const sellerId = req.user.id;

        // Create new product
        const newProduct = await Product.create({
            title,
            description,
            price,
            discount: discount || 0,
            sizes: parsedSizes,
            colors: parsedColors,
            stock,
            images: imageUrls,
            seller: sellerId,
            category: category,
            tags: parsedTags
        });

        // Update seller's product list
        await User.findByIdAndUpdate(sellerId, {
            $push: { productsListed: newProduct._id }
        });

        // Add product to each tag's list
        for (let tagId of parsedTags) {
            await Tag.findByIdAndUpdate(tagId, {
                $push: { products: newProduct._id }
            });
        }

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            product: newProduct
        });

    } catch (error) {
        console.error("Error creating product:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while creating product"
        });
    }
};

//Function to get all products
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
            allProducts
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
    const { productId } = req.body;

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