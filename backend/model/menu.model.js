const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        category: {
            type: String,
            enum: ["Starter", "Main Course", "Dessert", "Beverage"],
            required: true
        },

        price: {
            type: Number,
            required: true
        },

       availability: {
    type: String,
    enum: ["In Stock", "Out of Stock"],
    default: "In Stock"
},

        image: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const MenuItem = mongoose.model("MenuItem", menuSchema);

module.exports = MenuItem;