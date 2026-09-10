const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // ======================================================
    // USER WHO PLACED THE ORDER
    // ======================================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ======================================================
    // ORDERED MENU ITEMS
    // ======================================================

    items: [
      {
        // Original MenuItem reference
        menuItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MenuItem",
          required: true,
        },

        // Food name saved at the time of ordering
        name: {
          type: String,
          required: true,
          trim: true,
        },

        // Food image saved at the time of ordering
        image: {
          type: String,
          default: "",
          trim: true,
        },

        // Food category
        category: {
          type: String,
          default: "",
          trim: true,
        },

        // Quantity ordered
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },

        // Price at the time of placing the order
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],

    // ======================================================
    // CUSTOMER DELIVERY INFORMATION
    // ======================================================

    customer: {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
      },

      address: {
        type: String,
        required: true,
        trim: true,
      },

      city: {
        type: String,
        required: true,
        trim: true,
      },

      pincode: {
        type: String,
        required: true,
        trim: true,
      },
    },

    // ======================================================
    // PAYMENT METHOD
    // ======================================================

    paymentMethod: {
      type: String,
      enum: [
        "Cash on Delivery",
        "Online Payment",
      ],
      required: true,
    },

    // ======================================================
    // TOTAL ORDER AMOUNT
    // ======================================================

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // ======================================================
    // ORDER STATUS
    // ======================================================

    status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Preparing",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model(
  "Order",
  orderSchema
);

module.exports = Order;