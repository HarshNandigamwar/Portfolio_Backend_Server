import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath, folderName = "general") => {
  try {
    if (!localFilePath) return null;
    console.log(`Image Upload Start in folder: portfolio_server/${folderName}`);

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: `portfolio_server/${folderName}`,
      timeout: 60000,
    });

    console.log("Image uploaded successfully to Cloudinary");
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    console.error("Cloudinary upload failed:", error);
    return null;
  }
};

export { uploadOnCloudinary };
