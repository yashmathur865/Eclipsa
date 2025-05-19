const express = require("express");
const router = express.Router();

const {
  createRating,
  getAverageRating,
  getAllRating
} = require("../controllers/RatingAndReview");

const { auth, isCustomer } = require("../middlewares/auth");

// Create a new rating and review (only customers allowed)
router.post("/create", auth, isCustomer, createRating);

// Get average rating for a product — productId passed in req.body instead of params
router.post("/average-rating", getAverageRating);

// Get all ratings and reviews (public route)
router.get("/all", getAllRating);

module.exports = router;
