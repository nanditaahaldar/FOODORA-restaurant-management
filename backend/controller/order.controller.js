const Order = require("../model/order.model");
const MenuItem = require("../model/menu.model");

// ======================================================
// PLACE NEW ORDER
// POST /api/orders
// ======================================================

const createOrder = async (req, res) => {
  try {
    const {
      items,
      customer,
      paymentMethod,
    } = req.body;

    // --------------------------------------------------
    // Check items
    // --------------------------------------------------

    if (
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        message: "Order must contain at least one item",
      });
    }

    // --------------------------------------------------
    // Check customer information
    // --------------------------------------------------

    if (
      !customer ||
      !customer.name ||
      !customer.phone ||
      !customer.address ||
      !customer.city ||
      !customer.pincode
    ) {
      return res.status(400).json({
        message: "Complete customer information is required",
      });
    }

    // --------------------------------------------------
    // Check payment method
    // --------------------------------------------------

    const allowedPaymentMethods = [
      "Cash on Delivery",
      "Online Payment",
    ];

    if (!allowedPaymentMethods.includes(paymentMethod)) {
      return res.status(400).json({
        message: "Invalid payment method",
        allowedPaymentMethods,
      });
    }

    // --------------------------------------------------
    // Get logged-in user ID from JWT
    // --------------------------------------------------

    const userId =
      req.user.id ||
      req.user.userId ||
      req.user._id;

    if (!userId) {
      return res.status(401).json({
        message: "User information not found in token",
      });
    }

    // --------------------------------------------------
    // Prepare order items
    // --------------------------------------------------

    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      // ------------------------------------------------
      // Check menu item ID
      // ------------------------------------------------

      if (!item.menuItem) {
        return res.status(400).json({
          message: "Menu item ID is required",
        });
      }

      // ------------------------------------------------
      // Check quantity
      // ------------------------------------------------

      const quantity = Number(item.quantity);

      if (
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        return res.status(400).json({
          message: "Quantity must be at least 1",
        });
      }

      // ------------------------------------------------
      // Find menu item in MongoDB
      // ------------------------------------------------

      const menuItem = await MenuItem.findById(
        item.menuItem
      );

      if (!menuItem) {
        return res.status(404).json({
          message: `Menu item not found: ${item.menuItem}`,
        });
      }

      // ------------------------------------------------
      // Check availability
      // ------------------------------------------------

      if (menuItem.availability !== "In Stock") {
        return res.status(400).json({
          message: `${menuItem.name} is currently unavailable`,
        });
      }

      // ------------------------------------------------
      // Use actual price from MongoDB
      // ------------------------------------------------

      const itemPrice = Number(menuItem.price);

      const itemTotal = itemPrice * quantity;

      totalAmount += itemTotal;

      // ------------------------------------------------
      // Save complete food information
      // ------------------------------------------------

      orderItems.push({
        menuItem: menuItem._id,

        name: menuItem.name,

        image: menuItem.image || "",

        category: menuItem.category || "",

        quantity: quantity,

        price: itemPrice,
      });
    }

    // --------------------------------------------------
    // Create order
    // --------------------------------------------------

    const order = await Order.create({
      user: userId,

      items: orderItems,

      customer: {
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        address: customer.address.trim(),
        city: customer.city.trim(),
        pincode: customer.pincode.trim(),
      },

      paymentMethod,

      totalAmount,

      status: "Pending",
    });

    // --------------------------------------------------
    // Get complete order information
    // --------------------------------------------------

    const populatedOrder = await Order.findById(order._id)
      .populate("user", "name email")
      .populate(
        "items.menuItem",
        "name description category price image availability"
      );

    res.status(201).json({
      message: "Order placed successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("Create order error:", error);

    res.status(500).json({
      message: "Failed to place order",
      error: error.message,
    });
  }
};

// ======================================================
// GET MY ORDERS
// GET /api/orders/my-orders
// ======================================================

const getMyOrders = async (req, res) => {
  try {
    // --------------------------------------------------
    // Get logged-in user ID
    // --------------------------------------------------

    const userId =
      req.user.id ||
      req.user.userId ||
      req.user._id;

    if (!userId) {
      return res.status(401).json({
        message: "User information not found in token",
      });
    }

    // --------------------------------------------------
    // Find user's orders
    // --------------------------------------------------

    const orders = await Order.find({
      user: userId,
    })
      .populate("user", "name email")
      .populate(
        "items.menuItem",
        "name description category price image availability"
      )
      .sort({
        createdAt: -1,
      });

    // --------------------------------------------------
    // Add food information to every order item
    // --------------------------------------------------

    for (const order of orders) {
      for (const item of order.items) {
        // ----------------------------------------------
        // If MenuItem was successfully populated
        // ----------------------------------------------

        if (
          item.menuItem &&
          typeof item.menuItem === "object"
        ) {
          item.name =
            item.name ||
            item.menuItem.name ||
            "";

          item.image =
            item.image ||
            item.menuItem.image ||
            "";

          item.category =
            item.category ||
            item.menuItem.category ||
            "";
        }

        // ----------------------------------------------
        // If population did not work
        // ----------------------------------------------

        else if (item.menuItem) {
          try {
            const menuItem = await MenuItem.findById(
              item.menuItem
            ).select(
              "name description category price image availability"
            );

            if (menuItem) {
              item.name =
                item.name ||
                menuItem.name ||
                "";

              item.image =
                item.image ||
                menuItem.image ||
                "";

              item.category =
                item.category ||
                menuItem.category ||
                "";
            }
          } catch (error) {
            console.error(
              "Error finding menu item:",
              error.message
            );
          }
        }
      }
    }

    // --------------------------------------------------
    // Debug information
    // --------------------------------------------------

    console.log(
      "========== MY ORDERS WITH FOOD DATA =========="
    );

    console.log(
      JSON.stringify(
        orders,
        null,
        2
      )
    );

    console.log(
      "=============================================="
    );

    // --------------------------------------------------
    // Send response
    // --------------------------------------------------

    res.status(200).json({
      message: "Orders retrieved successfully",
      orders,
    });
  } catch (error) {
    console.error(
      "Get my orders error:",
      error
    );

    res.status(500).json({
      message: "Failed to retrieve orders",
      error: error.message,
    });
  }
};

// ======================================================
// GET ALL ORDERS
// ADMIN ONLY
// GET /api/orders
// ======================================================

const getAllOrders = async (req, res) => {
  try {
    // --------------------------------------------------
    // Get all orders
    // --------------------------------------------------

    const orders = await Order.find()
      .populate("user", "name email")
      .populate(
        "items.menuItem",
        "name description category price image availability"
      )
      .sort({
        createdAt: -1,
      });

    // --------------------------------------------------
    // Add food information to every order item
    // --------------------------------------------------

    for (const order of orders) {
      for (const item of order.items) {
        // ----------------------------------------------
        // If MenuItem was populated
        // ----------------------------------------------

        if (
          item.menuItem &&
          typeof item.menuItem === "object"
        ) {
          item.name =
            item.name ||
            item.menuItem.name ||
            "";

          item.image =
            item.image ||
            item.menuItem.image ||
            "";

          item.category =
            item.category ||
            item.menuItem.category ||
            "";
        }

        // ----------------------------------------------
        // If population did not work
        // ----------------------------------------------

        else if (item.menuItem) {
          try {
            const menuItem = await MenuItem.findById(
              item.menuItem
            ).select(
              "name description category price image availability"
            );

            if (menuItem) {
              item.name =
                item.name ||
                menuItem.name ||
                "";

              item.image =
                item.image ||
                menuItem.image ||
                "";

              item.category =
                item.category ||
                menuItem.category ||
                "";
            }
          } catch (error) {
            console.error(
              "Error finding menu item:",
              error.message
            );
          }
        }
      }
    }

    // --------------------------------------------------
    // Send response
    // --------------------------------------------------

    res.status(200).json({
      message: "All orders retrieved successfully",
      orders,
    });
  } catch (error) {
    console.error(
      "Get all orders error:",
      error
    );

    res.status(500).json({
      message: "Failed to retrieve orders",
      error: error.message,
    });
  }
};

// ======================================================
// UPDATE ORDER STATUS
// ADMIN ONLY
// PUT /api/orders/:id/status
// ======================================================

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // --------------------------------------------------
    // Allowed order statuses
    // --------------------------------------------------

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Preparing",
      "Delivered",
      "Cancelled",
    ];

    // --------------------------------------------------
    // Validate status
    // --------------------------------------------------

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
        allowedStatuses,
      });
    }

    // --------------------------------------------------
    // Find order
    // --------------------------------------------------

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // --------------------------------------------------
    // Update status
    // --------------------------------------------------

    order.status = status;

    await order.save();

    // --------------------------------------------------
    // Get updated order
    // --------------------------------------------------

    const updatedOrder = await Order.findById(
      order._id
    )
      .populate("user", "name email")
      .populate(
        "items.menuItem",
        "name description category price image availability"
      );

    // --------------------------------------------------
    // Make sure food information exists
    // --------------------------------------------------

    for (const item of updatedOrder.items) {
      // ----------------------------------------------
      // If MenuItem was populated
      // ----------------------------------------------

      if (
        item.menuItem &&
        typeof item.menuItem === "object"
      ) {
        item.name =
          item.name ||
          item.menuItem.name ||
          "";

        item.image =
          item.image ||
          item.menuItem.image ||
          "";

        item.category =
          item.category ||
          item.menuItem.category ||
          "";
      }

      // ----------------------------------------------
      // If population did not work
      // ----------------------------------------------

      else if (item.menuItem) {
        try {
          const menuItem = await MenuItem.findById(
            item.menuItem
          ).select(
            "name description category price image availability"
          );

          if (menuItem) {
            item.name =
              item.name ||
              menuItem.name ||
              "";

            item.image =
              item.image ||
              menuItem.image ||
              "";

            item.category =
              item.category ||
              menuItem.category ||
              "";
          }
        } catch (error) {
          console.error(
            "Error finding menu item:",
            error.message
          );
        }
      }
    }

    // --------------------------------------------------
    // Send response
    // --------------------------------------------------

    res.status(200).json({
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error(
      "Update order status error:",
      error
    );

    res.status(500).json({
      message: "Failed to update order status",
      error: error.message,
    });
  }
};

// ======================================================
// EXPORT FUNCTIONS
// ======================================================

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
};