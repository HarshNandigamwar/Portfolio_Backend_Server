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

// Update Experience Controller
export const updateExperience = async (req, res) => {
  // Track newly uploaded Cloudinary response so we can roll it back if DB save fails
  let newCloudinaryResponse = null;

  try {
    const { id } = req.params;

    const experience = await Experience.findById(id);

    if (!experience) {
      return res
        .status(404)
        .json({ success: false, message: "Experience not found!" });
    }

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

    // Parse techStack only if it was actually sent
    let parsedTechStack;
    if (typeof techStack === "string") {
      parsedTechStack = techStack.split(",").map((tech) => tech.trim());
    } else if (Array.isArray(techStack)) {
      parsedTechStack = techStack;
    }

    // Parse roles only if it was actually sent
    let parsedRoles;
    if (typeof roles === "string") {
      parsedRoles = roles.split(",").map((role) => role.trim());
    } else if (Array.isArray(roles)) {
      parsedRoles = roles;
    }

    const oldPublicId = experience.certificateImagePublicId;

    // If a new image is provided, upload it first (don't delete old one yet)
    if (req.file) {
      newCloudinaryResponse = await uploadOnCloudinary(
        req.file.path,
        "portfolio_experience",
      );

      if (!newCloudinaryResponse) {
        return res.status(500).json({
          success: false,
          message: "Failed to upload image to Cloudinary",
        });
      }

      experience.certificateImage = newCloudinaryResponse.secure_url;
      experience.certificateImagePublicId = newCloudinaryResponse.public_id;
    }

    if (dateRange) experience.dateRange = dateRange;
    if (post) experience.post = post;
    if (organization) experience.organization = organization;
    if (description) experience.description = description;
    if (parsedRoles) experience.roles = parsedRoles;
    if (parsedTechStack) experience.techStack = parsedTechStack;
    if (certificateId) experience.certificateId = certificateId;
    if (downloadLink) experience.downloadLink = downloadLink;

    const updatedExperience = await experience.save();

    // DB save succeeded — now safe to delete the old image (if a new one replaced it)
    if (req.file && oldPublicId) {
      await cloudinary.uploader.destroy(oldPublicId).catch((err) => {
        console.error("Failed to delete old Cloudinary image:", err.message);
      });
    }

    return res.status(200).json({
      success: true,
      message: "Experience updated successfully!",
      data: updatedExperience,
    });
  } catch (error) {
    console.error("Error in updateExperience:", error);

    // DB save failed but new image was uploaded — clean up the orphaned upload
    if (newCloudinaryResponse?.public_id) {
      await cloudinary.uploader
        .destroy(newCloudinaryResponse.public_id)
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

// Delete Experience Controller
export const deleteExperience = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the experience first so we have the Cloudinary public_id before deleting
    const experience = await Experience.findById(id);

    if (!experience) {
      return res
        .status(404)
        .json({ success: false, message: "Experience not found!" });
    }

    // Delete the experience document from MongoDB
    await Experience.findByIdAndDelete(id);

    // Delete the associated image from Cloudinary (if it exists)
    if (experience.certificateImagePublicId) {
      await cloudinary.uploader
        .destroy(experience.certificateImagePublicId)
        .catch((err) => {
          // Log but don't fail the request — DB record is already deleted
          console.error("Failed to delete Cloudinary image:", err.message);
        });
    }

    return res.status(200).json({
      success: true,
      message: "Experience deleted successfully!",
      data: experience,
    });
  } catch (error) {
    console.error("Error in deleteExperience:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};