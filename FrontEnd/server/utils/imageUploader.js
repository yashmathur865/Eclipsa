const cloudinary = require('cloudinary').v2;

exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
    try {
        const options = { folder };

        if (height) {
            options.height = height;
        }

        if (quality) {
            options.quality = quality;
        }

        options.resource_type = "auto"; // Handle all file types (image, video, etc.)

        // Upload the file
        const response = await cloudinary.uploader.upload(file.tempFilePath, options);

        return response; // Return the full cloudinary response
    }
    catch (error) {
        console.error("Error uploading file to Cloudinary:", error);
        throw error; // Re-throw so controller can handle it
    }
};
