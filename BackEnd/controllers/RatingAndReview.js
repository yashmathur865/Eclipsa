const RatingAndReview = require("../models/RatingAndReview");
const Product = require("../models/Product");
const mongoose = require("mongoose")

exports.createRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const { rating, review, productId } = req.body;

    // Validate input
    if (!rating || !review || !productId) {
      return res.status(400).json({
        success: false,
        message: "Rating, review, and productId are required",
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if user already reviewed this product
    const existingReview = await RatingAndReview.findOne({
      user: userId,
      product: productId,
    });

    if (existingReview) {
      return res.status(409).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    // Create new review
    const newReview = await RatingAndReview.create({
      user: userId,
      product: productId,
      rating,
      review,
    });

    // Add review to product
    await Product.findByIdAndUpdate(productId, {
      $push: { ratingAndReviews: newReview._id },
    });

    return res.status(201).json({
      success: true,
      message: "Rating and review created successfully",
      data: newReview,
    });
  } catch (error) {
    console.error("Error in createRating:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


exports.getAverageRating = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // Aggregate average rating
    const result = await RatingAndReview.aggregate([
      { $match: { product: new mongoose.Types.ObjectId(productId) } },
      {
        $group: {
          _id: "$product",
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    const averageRating = result.length > 0 ? result[0].averageRating : 0;

    return res.status(200).json({
      success: true,
      productId,
      averageRating: averageRating.toFixed(2),
    });
  } catch (error) {
    console.error("Error in getAverageRating:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to calculate average rating",
      error: error.message,
    });
  }
};

exports.getAllRating = async (req, res) => {
  try {
    const allRatings = await RatingAndReview.find({})
      .sort({ rating: -1 }) // Highest rated first
      .populate({
        path: "user",
        select: "firstName lastName email image", // Adjust fields as per your User model
      })
      .populate({
        path: "product",
        select: "title price images", // Adjust fields as needed
      });

    return res.status(200).json({
      success: true,
      message: "All product reviews fetched successfully",
      data: allRatings,
    });
  } catch (error) {
    console.error("Error in getAllRating:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch ratings",
      error: error.message,
    });
  }
};
