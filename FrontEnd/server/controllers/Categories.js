const Category = require('../models/Category');
const Product = require('../models/Product')

// Create a new category
exports.createCategory = async (req,res) =>{
    try {
        const {name, description} =  req.body;

        if(!name || !description){
            return res.status(401).json({
                success:false,
                message:"Category name or description not available"
            })
        }

        const newCategory = await Category.create({
            name,
            description
        })

        if (!newCategory) {
            return res.status(401).json({
                success:false,
                message:"Error in pushing new Category to db"
            })
        }

        return res.status(200).json({
            success:true,
            message:"Category created successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

// Get all categories
exports.showAllCategories = async (req,res) => {

    try {
        const allCategories =  await Category.find({},{name:true,
                                        description:true});

            return res.status(200).json({
                success:true,
                message:"All Categories received",
                data:allCategories
            })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}


// All Products of particular id
exports.getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.body;
    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required."
      });
    }

    // Find all products for the given category ID.
    const products = await Product.find({ category: categoryId })
      .populate("seller", "firstName lastName email")
      .populate("tags", "name")
      .populate("category", "name description");

    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found for this category."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Products retrieved successfully.",
      data: products
    });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message
    });
  }
};
