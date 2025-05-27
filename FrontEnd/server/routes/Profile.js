const express = require("express");
const router = express.Router();

// Controllers
const {
  updateProfile,
  deleteAccount,
  getAllUserDetails,
  updateDisplayPicture,
} = require("../controllers/Profile");

// Auth middleware
const { auth } = require("../middlewares/auth");

// Routes

// Get user profile
router.get("/getUserDetails", auth, getAllUserDetails);

// Update profile
router.put("/updateProfile", auth, updateProfile);

// Delete account
router.delete("/deleteAccount", auth, deleteAccount);

// Update profile picture
router.put("/updateDisplayPicture", auth, updateDisplayPicture);

module.exports = router;
