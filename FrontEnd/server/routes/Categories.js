const express = require('express');
const router = express.Router();

const { auth } = require('../middlewares/auth');
const {
  createCategory,
  showAllCategories,
  getProductsByCategory
} = require('../controllers/Categories');

// Create a new category (protected route)
router.post('/create', auth, createCategory);

// Get all categories (public)
router.get('/all', showAllCategories);

// Get products by category (public or protected, your choice)
router.post('/products', getProductsByCategory);

module.exports = router;
