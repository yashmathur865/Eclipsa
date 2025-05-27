const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");

// Create or get wishlist
exports.createOrGetWishlist = async (req, res) => {
    try {
        const { userId } = req.body;

        let wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            wishlist = await Wishlist.create({ user: userId, products: [] });
        }

        return res.status(200).json({ success: true, wishlist });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// Add to wishlist
exports.addToWishlist = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        const productExists = await Product.findById(productId);
        if (!productExists) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        let wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            wishlist = await Wishlist.create({ user: userId, products: [productId] });
        } else {
            if (!wishlist.products.includes(productId)) {
                wishlist.products.push(productId);
                await wishlist.save();
            }
        }

        return res.status(200).json({ success: true, wishlist });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// Remove from wishlist
exports.removeFromWishlist = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        const wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            return res.status(404).json({ success: false, message: "Wishlist not found" });
        }

        wishlist.products = wishlist.products.filter(
            (pid) => pid.toString() !== productId
        );

        await wishlist.save();

        return res.status(200).json({ success: true, wishlist });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// Get wishlist
exports.getWishlist = async (req, res) => {
    try {
        const { userId } = req.body;

        const wishlist = await Wishlist.findOne({ user: userId }).populate("products");

        if (!wishlist) {
            return res.status(404).json({ success: false, message: "Wishlist not found" });
        }

        return res.status(200).json({ success: true, wishlist });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// Clear wishlist
exports.clearWishlist = async (req, res) => {
    try {
        const { userId } = req.body;

        const wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            return res.status(404).json({ success: false, message: "Wishlist not found" });
        }

        wishlist.products = [];
        await wishlist.save();

        return res.status(200).json({ success: true, wishlist });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
