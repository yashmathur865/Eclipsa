const User = require('../models/User');
const Profile = require("../models/Profile");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// Create / Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const { dateOfBirth = "", gender, about = "", contactNumber } = req.body;
    const userId = req.user.id;

    if (!gender || !contactNumber) {
      return res.status(400).json({
        success: false,
        message: 'Gender and contact number are required',
      });
    }

    const userDetails = await User.findById(userId);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const profileId = userDetails.additionalDetails;

    const updatedProfile = await Profile.findByIdAndUpdate(
      profileId,
      { dateOfBirth, gender, about, contactNumber },
      { new: true }
    );

    const updatedUserDetails = await User.findById(userId)
      .populate("additionalDetails")
      .exec();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      updatedUserDetails,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message,
    });
  }
};

// Delete Account
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    const userDetails = await User.findById(userId);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    await Profile.findByIdAndDelete(userDetails.additionalDetails);
    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message,
    });
  }
};

// Get Profile
exports.getAllUserDetails = async (req, res) => {
  try {
    const id = req.user.id;
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User data fetched successfully',
      userDetails,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Profile Picture
exports.updateDisplayPicture = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.files || !req.files.displayPicture) {
      return res.status(400).json({
        success: false,
        message: 'No display picture provided',
      });
    }

    const displayPicture = req.files.displayPicture;

    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME_2,
      1000,
      1000
    );

    const updatedProfile = await User.findByIdAndUpdate(
      userId,
      { image: image.secure_url },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Image updated successfully',
      data: updatedProfile,
    });
  } catch (error) {
    console.error("Error updating display picture:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
