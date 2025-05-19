const express = require("express");
const router = express.Router();

const { createTag, getAllTags } = require("../controllers/Tags");
const { auth, isAdmin } = require("../middlewares/auth");

// Create a new tag (admin only)
router.post("/create", auth, isAdmin, createTag);

// Get all tags (public access)
router.post("/all", getAllTags);

module.exports = router;
