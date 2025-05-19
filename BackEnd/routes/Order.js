const express = require("express");
const router = express.Router();

const {
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders
} = require("../controllers/Order");

const { auth, isCustomer, isAdmin } = require("../middlewares/auth");

// Get all orders for the logged-in user
router.post("/user-orders", auth, isCustomer, getUserOrders);

// Get details of a specific order by ID
router.post("/get-order", auth, getOrderById);

// Admin: Update the status of an order
router.post("/update-status", auth, isAdmin, updateOrderStatus);

// Admin: Get all orders
router.post("/all-orders", auth, isAdmin, getAllOrders);

module.exports = router;
