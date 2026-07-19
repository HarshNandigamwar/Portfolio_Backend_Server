import { Experience } from "../models/experience.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const uploadExperience = async (req, res) => {
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

    const cloudinaryResponse = await uploadOnCloudinary(
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
    });

    return res.status(201).json({
      success: true,
      message: "Experience uploaded successfully!",
      data: newExperience,
    });
  } catch (error) {
    console.error("Error in uploadExperience:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
