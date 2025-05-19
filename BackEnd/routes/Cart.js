const express = require("express");
const router = express.Router();

const {
  createOrGetCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  getCart,
  clearCart
} = require("../controllers/Cart");

const { auth, isCustomer } = require("../middlewares/auth");

// Create a new cart or get existing cart for user
router.post("/create-or-get", auth, isCustomer, createOrGetCart);

// Get cart (optional redundancy, useful if you need a dedicated fetch)
router.post("/get", auth, isCustomer, getCart);

// Add a product to the cart
router.post("/add", auth, isCustomer, addToCart);

// Remove a product from the cart
router.post("/remove", auth, isCustomer, removeFromCart);

// Update quantity of a product in the cart
router.post("/update-quantity", auth, isCustomer, updateQuantity);

// Clear the cart
router.post("/clear", auth, isCustomer, clearCart);

module.exports = router;
