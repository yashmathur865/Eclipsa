// Import required modules
const express = require("express");
const router = express.Router();

// Import controller functions
const {
  createProduct,
  getAllProducts,
  getProductDetails,
} = require("../controllers/Product");

// Import middleware
const { auth } = require("../middlewares/auth");

// Routes

// @route   POST /api/v1/product/create
// @desc    Create a new product (seller only)
// @access  Private
router.post("/create", auth, createProduct);

// @route   GET /api/v1/product/all
// @desc    Get all products (basic listing)
// @access  Public
router.get("/all", getAllProducts);

// @route   GET /api/v1/product/:productId
// @desc    Get single product details by ID
// @access  Public
router.get("/:productId", getProductDetails);

// Export the router
module.exports = router;
