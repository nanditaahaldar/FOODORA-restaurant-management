const MenuItem = require("../model/menu.model");
const User = require("../model/user.model");
const Order = require("../model/order.model");

const getDashboard = async (req, res) => {
  try {
    // Total menu items
    const totalMenuItems = await MenuItem.countDocuments();

    // Total normal users
    const totalUsers = await User.countDocuments({
      role: "user",
    });

    // Total orders
    const totalOrders = await Order.countDocuments();

    // Total revenue
    // Only Delivered orders are counted
    const revenueResult = await Order.aggregate([
      {
        $match: {
          status: "Delivered",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    const totalRevenue =
      revenueResult.length > 0
        ? revenueResult[0].totalRevenue
        : 0;

    // Send dashboard data
    res.status(200).json({
      message: "Dashboard data retrieved successfully",

      dashboard: {
        totalMenuItems,
        totalUsers,
        totalOrders,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    res.status(500).json({
      message: "Failed to retrieve dashboard data",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboard,
};