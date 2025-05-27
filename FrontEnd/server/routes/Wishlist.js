const express = require("express");
const router = express.Router();

const {
  createOrGetWishlist,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  clearWishlist
} = require("../controllers/Wishlist");

const { auth } = require("../middlewares/auth");

// Get or create wishlist for user
router.post("/get-or-create", auth, createOrGetWishlist);

// Add a product to wishlist
router.post("/add", auth, addToWishlist);

// Remove a product from wishlist
router.post("/remove", auth, removeFromWishlist);

// Get wishlist with populated products
router.post("/get", auth, getWishlist);

// Clear the wishlist
router.post("/clear", auth, clearWishlist);

module.exports = router;
