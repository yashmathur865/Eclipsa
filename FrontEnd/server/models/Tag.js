const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: false,
        trim: true,
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product", // reference to Product model
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("Tag", tagSchema);
