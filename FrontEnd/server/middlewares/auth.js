const jwt = require("jsonwebtoken")
require("dotenv").config()
const User = require("../models/User")


exports.auth = async (req,res, next) => {

    try {
        // console.log("Body token:", req.body.token);
        // console.log("Cookie token:", req.cookies.token);
        // console.log("Header token:", req.get("Authorization"));
        // Get token from req.body, req.cookies or req.get("Authorization")
        const token = req.get("Authorization")?.replace("Bearer ", "") || req.body?.token || req.cookies.token;

        // If token is missing, return a 401 (Unauthorized) error
        if(!token) {
            return res.status(401).json({
                success:false,
                message:'Token is missing',
            });
        }
        // Verify token
        try {
            const payload = jwt.verify(token,process.env.JWT_SECRET);
            req.user = payload;
        } catch (error) {
            return res.status(401).json({
                success:false,
                message:"Invalid token."
            })
        }
        next();
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            success:false,
            message:"Error in validating token"
        })
    }
}

exports.isCustomer = async(req,res,next) => {
    try{
        if(req.user.accountType !== "Customer") {
            return res.status(401).json({
                success:false,
                message:'This is a protected route for Customers only',
            });
        }
        next();
    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:'User role cannot be verified, please try again'
        })
    }
}
exports.isSeller = async(req,res,next) => {
    try{
        if(req.user.accountType !== "Seller") {
            return res.status(401).json({
                success:false,
                message:'This is a protected route for Seller only',
            });
        }
        next();
    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:'User role cannot be verified, please try again'
        })
    }
}

exports.isAdmin = async (req, res, next) => {
    try{
           if(req.user.accountType !== "Admin") {
               return res.status(401).json({
                   success:false,
                   message:'This is a protected route for Admin only',
               });
           }
           next();
    }
    catch(error) {
       return res.status(500).json({
           success:false,
           message:'User role cannot be verified, please try again'
       })
    }
}


exports.authorizeRoles  = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.accountType)) {
      return res.status(403).json({
        success: false,
        message: "Access denied: insufficient permissions",
      });
    }
    next();
  };
};

