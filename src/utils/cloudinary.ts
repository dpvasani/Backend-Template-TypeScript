import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config(); // Ensure .env file is loaded

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
});

// Function to upload file to Cloudinary
const uploadOnCloudinary = async (localFilePath: string): Promise<any> => {
  try {
    if (!localFilePath || !fs.existsSync(localFilePath)) {
      console.error("File path is invalid or file does not exist");
      return null;
    }

    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // Successfully uploaded, remove the file
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    try {
      // Ensure file deletion even if upload fails
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
    } catch (unlinkError) {
      console.error("Error removing temporary file:", unlinkError);
    }

    return null;
  }
};

const deleteOnCloudinary = async (
  public_id: string,
  resource_type: string = "image"
): Promise<any> => {
  try {
    if (!public_id) return null;

    // Delete file from Cloudinary
    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type: resource_type,
    });

    return result;
  } catch (error) {
    console.error("Delete on Cloudinary failed:", error);
    return error;
  }
};

export { uploadOnCloudinary, deleteOnCloudinary };
