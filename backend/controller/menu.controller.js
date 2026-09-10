const MenuItem = require("../model/menu.model");

const addMenuItem = async(req,res) => {
    try {
       const {
        name,
        description,
        category,
        price,
        availability,
        image
       } = req.body;

       const menuItem = await MenuItem.create({
        name,
        description,
        category,
        price,
        availability,
        image
       });

       res.status(201).json({ message: "Menu item created successfully", menuItem});
    } catch (error) {
        res.status(500).json({ message: "Internal server error" , error: error.message });
    }
};

const getMenuItems = async(req,res) => {
    try {
        const menuItems = await MenuItem.find();
        res.status(200).json({ message: "Menu items retrieved successfully", menuItems });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const getMenuItemById = async(req,res) => { try {
        const menuItem = await MenuItem.findById(req.params.id);

        if (!menuItem) {
            return res.status(404).json({
                message: "Menu item not found"
            });
        }

        res.status(200).json({
            message: "Menu item retrieved successfully",
            menuItem
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve menu item",
            error: error.message
        });
    }
};

// Update Menu Item
const updateMenuItem = async (req, res) => {
    try {
        const menuItem = await MenuItem.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!menuItem) {
            return res.status(404).json({
                message: "Menu item not found"
            });
        }

        res.status(200).json({
            message: "Menu item updated successfully",
            menuItem
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update menu item",
            error: error.message
        });
    }
};

// Delete Menu Item
const deleteMenuItem = async (req, res) => {
    try {
        const menuItem = await MenuItem.findByIdAndDelete(req.params.id);

        if (!menuItem) {
            return res.status(404).json({
                message: "Menu item not found"
            });
        }

        res.status(200).json({
            message: "Menu item deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete menu item",
            error: error.message
        });
    }
};

// Search Menu Item
const searchMenuItem = async (req, res) => {
    try {
        const { name } = req.query;

        const menuItems = await MenuItem.find({
            name: { $regex: name, $options: "i" }
        });

        res.status(200).json({
            message: "Menu items search successfully",
            menuItems
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to search menu items",
            error: error.message
        });
    }
};

module.exports = {
    addMenuItem,
    getMenuItems,
    getMenuItemById,
    updateMenuItem,
    deleteMenuItem,
    searchMenuItem
};



