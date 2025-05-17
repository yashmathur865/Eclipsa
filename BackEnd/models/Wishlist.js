const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true // 1 wishlist per user
    },
    products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
}]
}, { timestamps: true });

module.exports = mongoose.model("Wishlist", wishlistSchema);
