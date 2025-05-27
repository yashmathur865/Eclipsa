const { instance } = require('../config/razorpay');
const Product = require("../models/Product");
const Order = require('../models/Order');
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail");
const crypto = require("crypto");

// Capture Payment and initiate Razorpay order
exports.capturePayment = async (req, res) => {
    const { products } = req.body; // products = [{ productId, quantity }]
    const userId = req.user?.id;

    if (!products || products.length === 0) {
        return res.status(400).json({
            success: false,
            message: "No products provided in the request.",
        });
    }

    try {
        let totalAmount = 0;

        for (const item of products) {
            const { productId, quantity } = item;

            if (!productId || !quantity || quantity < 1) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid productId or quantity.",
                });
            }

            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product not found: ${productId}`,
                });
            }

            totalAmount += product.price * quantity;
        }

        const options = {
            amount: totalAmount * 100, // amount in paise
            currency: "INR",
            receipt: Math.random(Date.now()).toString()
        };

        const paymentResponse = await instance.orders.create(options);

        return res.status(200).json({
            success: true,
            message: "Order created successfully",
            order: paymentResponse
        });

    } catch (error) {
        console.error("Error in capturePayment:", error);
        return res.status(500).json({
            success: false,
            message: "Could not initiate order",
            error: error.message
        });
    }
};

// Verify Razorpay payment and create order in DB
exports.verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            products
        } = req.body;

        const userId = req.user?.id;

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature ||
            !Array.isArray(products) ||
            products.length === 0 ||
            !userId
        ) {
            return res.status(400).json({
                success: false,
                message: "Missing or invalid payment data"
            });
        }

        const body = `${razorpay_order_id}|${razorpay_payment_id}`;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment signature"
            });
        }

        const order = await exports.createOrder(products, userId, "Default Shipping", null, razorpay_order_id, razorpay_payment_id);

        //Sending email for Product Purched
        // Sending Order Received Email
        const user = await User.findById(userId);

        await mailSender(
        user.email,
        "Payment Received",
        paymentSuccessEmail(user.firstName || user.name || "Customer", order.totalAmount, razorpay_payment_id, order._id)
);



        return res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            orderId: order._id
        });

    } catch (error) {
        console.error("Error in verifyPayment:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error during payment verification"
        });
    }
};

// Create Order in DB, with Razorpay IDs stored
exports.createOrder = async (
    products,
    userId,
    shippingAddress = "Default Shipping",
    trackingNumber = null,
    razorpayOrderId = null,
    paymentId = null
) => {
    try {
        let totalAmount = 0;
        const orderItems = [];

        for (const item of products) {
            const product = await Product.findById(item.productId || item.product);
            if (!product) {
                throw new Error(`Product not found: ${item.productId || item.product}`);
            }

            const quantity = item.quantity || 1;
            const price = product.price * quantity;
            totalAmount += price;

            orderItems.push({
                product: product._id,
                quantity,
                price,
            });
        }

        const newOrder = await Order.create({
            user: userId,
            products: orderItems,
            totalAmount,
            shippingAddress,
            paymentStatus: 'paid',
            trackingNumber: trackingNumber || undefined,
            razorpayOrderId,
            paymentId
        });

        return newOrder;

    } catch (error) {
        console.error("Error in createOrder:", error);
        throw new Error(error.message);
    }
};

// Send Payment Success Email (left separate as requested)
exports.sendPaymentSuccessEmail = async (req, res) => {
    const { orderId, paymentId, amount } = req.body;
    const userId = req.user.id;

    if (!orderId || !paymentId || !amount || !userId) {
        return res.status(400).json({ success: false, message: "Please provide all the fields" });
    }

    try {
        const user = await User.findById(userId);
        await mailSender(
            user.email,
            `Payment Received`,
            paymentSuccessEmail(`${user.firstName}`, amount / 100, orderId, paymentId)
        );
        return res.status(200).json({ success: true, message: "Payment success email sent" });
    } catch (error) {
        console.log("Error in sending mail:", error);
        return res.status(500).json({ success: false, message: "Could not send email" });
    }
};





















// exports.capturePayment =  async (req,res) => {
    
//         const courseId = req.body;
//         const userId = req.user.id;

//         if(!course_id) {
//             return res.json({
//                 success:false,
//                 message:'Please provide valid course ID',
//             })
//         };
//     let courseDetails;
//     try {

//         //If you pass a string that represents a valid MongoDB ObjectId, Mongoose will automatically convert it to a proper ObjectId type internally. 
//         //So, whether you pass a string or a MongoDB ObjectId as the first argument, Mongoose will handle it correctly, 
//         //and the findById() method will work as expected.
//          courseDetails = await Course.findById(courseId);

//         if(!courseDetails){
//             return res.json({
//                 success:false,
//                 message:'Could not find the course',
//             });
//         }
        
//         //The reason why it appears as a string in the payload object and not as an 
//         //ObjectId is that the JWT library serializes the payload data into a JSON format before signing it. 
//         //During this serialization process, 
//         //special types like ObjectId are converted to plain JSON data, and the original ObjectId type information is lost.
//         //Since the payload data was originally serialized to JSON and then deserialized during verification,
//         //the id property will be a string at this point.
//         const uid = new mongoose.Types.ObjectId(userId);

//         //includes() to check if a value exists in the array, it performs a strict equality comparison (===) for each element in the array. 
//         if(courseDetails.studentsEnrolled.includes(uid)){
//             return res.status(200).json({
//                 success:false,
//                 message:'Student is already enrolled',
//             });
//         }
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             success:false,
//             message:error.message,
//         });
//     }

//     try {
//         const paymentResponse = await instance.orders.create({
//             amount: courseDetails.price *100,
//             currency:'INR',
//             receipt: Math.random(Date.now()).toString(),
//             notes:{
//                 userId,
//                 courseId
//             }
//         })

//         return res.status(200).json({
//             success:true,
//             courseName:courseDetails.courseName,
//             courseDescription:courseDetails.courseDescription,
//             thumbnail: courseDetails.thumbnail,
//             orderId: paymentResponse.id,
//             currency:paymentResponse.currency,
//             amount:paymentResponse.amount,
//         });
//     } catch (error) {
//         console.log(error);
//         res.json({
//             success:false,
//             message:"Could not initiate order",
//         });
//     }
// }

// exports.verifySignature = async (req,res) => {
//     const webhookSecret = "123456789"

//     //Getting the signature stored at razorpay server 
//     const signature = req.headers["x-razorpay-signature"];

//     //Following are the steps to hash the secret key present at backend so that it can be compared with the one received from server
//     const shasum = crypto.createHmac("sha256", webhookSecret); //sha256 is the hashing algo 
//     shasum.update(JSON.stringify(req.body))
//     const digest = shasum.digest("hex");

//     //action item, the secret keys match, what next to be done
//     if(signature===digest){
//         console.log("Payment is Authorised");
//         const {userId, courseId} = req.body.payload.payment.entity.notes;

//         try {
//             const updatedCourse = await Course.findByIdAndUpdate(courseId, 
//                                                             {
//                                                                 $push:{
//                                                                     studentsEnrolled:userId
//                                                                 }
//                                                             }, 
//                                                             {new:true});

//             if(!enrolledCourse) {
//                 return res.status(500).json({
//                     success:false,
//                     message:'Course not Found',
//                 });
//             }

//             const updatedStudent = await User.findByIdAndUpdate(userId, 
//                 {
//                     $push:{
//                         courses:courseId
//                     }
//                 },
//                 {new:true})

//             const emailResponse = await mailSender(
//                                                     updatedStudent.email,
//                                                     "Thankyou for buying - StudyNotion",
//                                                     "You have successfully bought Study Notion Course"
//             )

//             console.log(emailResponse);
//                 return res.status(200).json({
//                     success:true,
//                     message:"Signature Verified and COurse Added",
//                 });
//         } catch (error) {
//             console.log(error);
//             return res.status(500).json({
//                 success:false,
//                 message:error.message,
//             });
//         }
//     }
//     else{
//         return res.status(400).json({
//             success:false,
//             message:'Invalid request',
//         });
//     }
// }