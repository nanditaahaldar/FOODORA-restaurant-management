const User = require("../model/user.model");
const Menu = require("../model/menu.model");
// ==========================================
// GET ALL USERS - ADMIN ONLY
// ==========================================

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      message: "Users retrieved successfully",
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve users",
      error: error.message,
    });
  }
};

// ==========================================
// DELETE USER - ADMIN ONLY
// ==========================================

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete user",
      error: error.message,
    });
  }
};

// ==========================================
// GET CURRENT USER PROFILE
// ==========================================

const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Profile retrieved successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve profile",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE CURRENT USER PROFILE
// ==========================================

const updateMyProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      address,
      city,
      pincode,
      profileImage,
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (name !== undefined) {
      user.name = name;
    }

    if (phone !== undefined) {
      user.phone = phone;
    }

    if (address !== undefined) {
      user.address = address;
    }

    if (city !== undefined) {
      user.city = city;
    }

    if (pincode !== undefined) {
      user.pincode = pincode;
    }

    if (profileImage !== undefined) {
      user.profileImage = profileImage;
    }

    await user.save();

    const updatedUser = await User.findById(
      req.user.id
    ).select("-password");

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

// ==========================================
// ADD / REMOVE FAVORITE FOOD
// ==========================================

const toggleFavorite = async (req, res) => {
  try {
    const { menuItemId } = req.params;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check if the food is already in favorites
    const alreadyFavorite = user.favoriteFoods.some(
      (id) => id.toString() === menuItemId
    );

    // ========================================
    // REMOVE FROM FAVORITES
    // ========================================

    if (alreadyFavorite) {
      user.favoriteFoods = user.favoriteFoods.filter(
        (id) => id.toString() !== menuItemId
      );

      await user.save();

      return res.status(200).json({
        message: "Removed from favorites",
        isFavorite: false,
      });
    }

    // ========================================
    // ADD TO FAVORITES
    // ========================================

    user.favoriteFoods.push(menuItemId);

    await user.save();

    res.status(200).json({
      message: "Added to favorites",
      isFavorite: true,
    });
  } catch (error) {
    console.error("Favorite error:", error);

    res.status(500).json({
      message: "Failed to update favorite",
      error: error.message,
    });
  }
};

// ==========================================
// GET MY FAVORITE FOODS
// ==========================================

// ==========================================
// GET MY FAVORITE FOODS
// ==========================================

const getMyFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("favoriteFoods")
      .populate("favoriteFoods");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      favorites: user.favoriteFoods || [],
    });
  } catch (error) {
    console.error("Get favorites error:", error);

    res.status(500).json({
      message: "Failed to get favorites",
      error: error.message,
    });
  }
};

// ==========================================
// EXPORT CONTROLLERS
// ==========================================

module.exports = {
  getAllUsers,
  deleteUser,
  getMyProfile,
  updateMyProfile,
  toggleFavorite,
  getMyFavorites,
};