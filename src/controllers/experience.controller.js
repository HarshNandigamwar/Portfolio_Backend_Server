import { Experience } from "../models/experience.model.js";
import { uploadOnCloudinary, cloudinary } from "../utils/cloudinary.js";

//Upload Experience Controller
export const uploadExperience = async (req, res) => {
  // Track uploaded Cloudinary response so we can roll it back if DB save fails
  let cloudinaryResponse = null;

  try {
    const {
      dateRange,
      post,
      organization,
      description,
      roles,
      techStack,
      certificateId,
      downloadLink,
    } = req.body;

    if (
      !dateRange ||
      !post ||
      !organization ||
      !description ||
      !roles ||
      !techStack
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Required fields are missing!" });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Certificate image is required!" });
    }

    let parsedTechStack = [];
    if (typeof techStack === "string") {
      parsedTechStack = techStack.split(",").map((tech) => tech.trim());
    } else if (Array.isArray(techStack)) {
      parsedTechStack = techStack;
    }

    let parsedRoles = [];
    if (typeof roles === "string") {
      parsedRoles = roles.split(",").map((role) => role.trim());
    } else if (Array.isArray(roles)) {
      parsedRoles = roles;
    }

    // Upload the experience certificate image to Cloudinary
    cloudinaryResponse = await uploadOnCloudinary(
      req.file.path,
      "portfolio_experience",
    );

    if (!cloudinaryResponse) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload image to Cloudinary",
      });
    }

    const newExperience = await Experience.create({
      dateRange,
      post,
      organization,
      description,
      roles: parsedRoles,
      techStack: parsedTechStack,
      certificateId,
      downloadLink,
      certificateImage: cloudinaryResponse.secure_url,
      certificateImagePublicId: cloudinaryResponse.public_id,
    });

    return res.status(201).json({
      success: true,
      message: "Experience uploaded successfully!",
      data: newExperience,
    });
  } catch (error) {
    console.error("Error in uploadExperience:", error);

    // If the image was uploaded to Cloudinary but the DB save failed,
    // delete the orphaned image so it doesn't stay unused on Cloudinary
    if (cloudinaryResponse?.public_id) {
      await cloudinary.uploader
        .destroy(cloudinaryResponse.public_id)
        .catch((err) => {
          console.error("Failed to rollback Cloudinary upload:", err.message);
        });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//Get Experience Controller
export const getExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: experiences.length,
      message: "Experiences fetched successfully!",
      data: experiences,
    });
  } catch (error) {
    console.error("Error in getExperiences:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
