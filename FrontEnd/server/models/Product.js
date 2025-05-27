const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number, // percentage discount like 10 means 10%
        default: 0
    },
    sizes: {
        type: [String],  // Example: ['S', 'M', 'L', 'XL']
        default: []
    },
    colors: {
        type: [String],  // Example: ['white', 'blue', 'black']
        default: []
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    images: {
        type: [String],  // URLs of product images
        default: []
    },
    ratingAndReviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"RatingAndReview",
    }],
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    category: {   // One category per product
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    tags: [{      // Multiple tags
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag"
    }],
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
