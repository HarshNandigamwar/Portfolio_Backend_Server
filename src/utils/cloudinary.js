import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const startSpinner = (text) => {
  const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  let i = 0;
  return setInterval(() => {
    process.stdout.write(`\r${frames[(i = ++i % frames.length)]} ${text}`);
  }, 80);
};

let Cloudinary_Folder;
if (process.env.NODE_ENV == "development") {
  Cloudinary_Folder = "portfolio_server_development";
} else {
  Cloudinary_Folder = "portfolio_server";
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath, folderName = "general") => {
  try {
    if (!localFilePath) return null;

    console.log(
      `Image Upload Start in folder: ${Cloudinary_Folder}/${folderName}`,
    );

    // Start spinner right before the actual upload begins
    const spinner = startSpinner("Uploading...");

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: `${Cloudinary_Folder}/${folderName}`,
      timeout: 60000,
    });

    // Stop spinner only after upload finishes
    clearInterval(spinner);
    process.stdout.write("\r"); // clear the spinner line
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

// Export cloudinary instance too — needed for cloudinary.uploader.destroy() in controllers
export { uploadOnCloudinary, cloudinary };
