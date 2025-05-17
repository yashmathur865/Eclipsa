const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true
    },
    lastName:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    image:{
        type:String,
        required:true
    },
    accountType:{
        type:String,
        enum:["Admin","Customer","Seller"],
        required:true,
    },
    additionalDetails:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Profile",
        required:true,
    },
    // isVerified:{
    //     type:Boolean,
    //     default:false
    // },
    status:{
        type:String,
        enum:['active','inactive','banned'],
        default:'active'
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    },
    addresses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",// Reference to the Address model
    }],
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart",
    },
    wishlist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Wishlist",
    },
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
    }],
    productsListed: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: function() {
            return this.accountType === 'Seller'; // Only include for Sellers
        },
    }],
    token:{
        type: String
    },
    resetPasswordExpires:{
        type: Date
    },
})

mongoose.exports = mongoose.model("User",userSchema);