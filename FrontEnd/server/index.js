// initialize express app
const express = require("express");
const app = express();

//routes
const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const productRoutes = require("./routes/Product");
const cartRoutes = require("./routes/Cart");
const categoriesRoutes = require("./routes/Categories");
const orderRoutes = require("./routes/Order");
const tagsRoutes = require("./routes/Tags");
const wishlistRoutes = require("./routes/Wishlist");
const ratingAndReviewRoutes = require("./routes/RatingAndReview");


//database
const database = require("./config/database");
const {cloudinaryConnect} = require("./config/cloudinary");
//Importing the required packages
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");


const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 4000;

//database connect
database.connect();
//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: "*",
		credentials: true,
	})
)
// app.use((req, res, next) => {
// 	res.header('Access-Control-Allow-Origin', '*');
// 	next();
//   });
//file upload
app.use(
	fileUpload({
		useTempFiles:true,
		tempFileDir:"/tmp",
	})
)
//cloudinary connection
cloudinaryConnect();

//routes mounting
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/categories", categoriesRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/tags", tagsRoutes);
app.use("/api/v1/wishlist", wishlistRoutes);
app.use("/api/v1/ratingAndReview", ratingAndReviewRoutes);


//def route

app.get("/", (req, res) => {
	return res.json({
		success:true,
		message:'Your server is up and running....'
	});
});

app.listen(PORT, () => {
	console.log(`App is running at ${PORT}`)
})

