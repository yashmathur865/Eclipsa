// controllers/cartController.js
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Utility: Recalculate totals
const recalculateTotals = (cart) => {
    let totalItems = 0;
    let totalPrice = 0;
    cart.products.forEach(item => {
        totalItems += item.quantity;
        totalPrice += item.quantity * item.product.price;
    });
    cart.totalItems = totalItems;
    cart.totalPrice = totalPrice;
};

// 1. Create or get cart
exports.createOrGetCart = async (req, res) => {
    try {
        const { userId } = req.body;
        let cart = await Cart.findOne({ user: userId }).populate("products.product");
        if (!cart) {
            cart = await Cart.create({ user: userId, products: [] });
        }
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 2. Add product to cart
exports.addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ error: "Product not found" });

        let cart = await Cart.findOne({ user: userId });
        if (!cart) cart = await Cart.create({ user: userId, products: [] });

        const existingItem = cart.products.find(item => item.product.toString() === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        await cart.populate("products.product");
        recalculateTotals(cart);
        await cart.save();

        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3. Remove product from cart
exports.removeFromCart = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ error: "Cart not found" });

        cart.products = cart.products.filter(item => item.product.toString() !== productId);
        await cart.populate("products.product");
        recalculateTotals(cart);
        await cart.save();

        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 4. Update product quantity
exports.updateQuantity = async (req, res) => {
    try {
        const { userId, productId, newQuantity } = req.body;
        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ error: "Cart not found" });

        const item = cart.products.find(p => p.product.toString() === productId);
        if (!item) return res.status(404).json({ error: "Product not in cart" });

        item.quantity = newQuantity;
        await cart.populate("products.product");
        recalculateTotals(cart);
        await cart.save();

        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 5. Get cart
exports.getCart = async (req, res) => {
    try {
        const { userId } = req.body;
        const cart = await Cart.findOne({ user: userId }).populate("products.product");
        if (!cart) return res.status(404).json({ error: "Cart not found" });
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 6. Clear cart
exports.clearCart = async (req, res) => {
    try {
        const { userId } = req.body;
        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ error: "Cart not found" });

        cart.products = [];
        cart.totalItems = 0;
        cart.totalPrice = 0;
        await cart.save();

        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
