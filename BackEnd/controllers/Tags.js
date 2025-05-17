const Tag = require("../models/Tag")

//Function to create Tag
exports.createTag = async (req,res)=>{
    try{
        //Fetch name and description from req.body
        const {name,description} = req.body;
        //Validate
        if(!name||!description){
            return res.status(400).json({
                success:false,
                message:"All Fields Are Required"
            })
        }

        //Create Entry in DB
        const tagDetails = await Tag.create({
            name:name,
            description:description
        })

        return res.status(200).json({
            success:true,
            message:"Tag Created Successfully",
            tag: tagDetails
        })
    }
    catch(error){
        if (error.code === 11000) { // MongoDB duplicate key error
            return res.status(400).json({
                success: false,
                message: "Tag with this name already exists",
            });
        }
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

// Function to get all tags
exports.getAllTags = async (req,res)=>{
    try{
        const allTags = await Tag.find({},{name:true,description:true})
        res.status(200).json({
            success:true,
            message:"All tags returned successfully",
            allTags
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

