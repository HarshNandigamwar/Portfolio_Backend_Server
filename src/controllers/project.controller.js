import { Project } from "../models/project.model.js";
import { uploadOnCloudinary, cloudinary } from "../utils/cloudinary.js";

// Upload Project Controller
export const uploadProject = async (req, res) => {
  // Track uploaded Cloudinary response so we can roll it back if DB save fails
  let cloudinaryResponse = null;

  try {
    const {
      projectName,
      projectDescription,
      githubFrontendLink,
      githubBackendLink,
      livePreviewLink,
      techStack,
    } = req.body;

    if (
      !projectName ||
      !projectDescription ||
      !githubFrontendLink ||
      !livePreviewLink ||
      !techStack
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Required fields are missing!" });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Project image is required!" });
    }

    let parsedTechStack = [];
    if (typeof techStack === "string") {
      parsedTechStack = techStack.split(",").map((tech) => tech.trim());
    } else if (Array.isArray(techStack)) {
      parsedTechStack = techStack;
    }

    // Upload the project image to Cloudinary
    cloudinaryResponse = await uploadOnCloudinary(
      req.file.path,
      "portfolio_projectImage",
    );

    if (!cloudinaryResponse) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload image to Cloudinary",
      });
    }

    const newProject = await Project.create({
      projectName,
      projectDescription,
      githubFrontendLink,
      githubBackendLink,
      livePreviewLink,
      techStack: parsedTechStack,
      projectImage: cloudinaryResponse.secure_url,
      projectImagePublicId: cloudinaryResponse.public_id,
    });

    return res.status(201).json({
      success: true,
      message: "Project uploaded successfully!",
      data: newProject,
    });
  } catch (error) {
    console.error("Error in uploadProject:", error);

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

// Get All Projects Controller
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Projects fetched successfully!",
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    console.error("Error in getProjects:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Update Project Controller
export const updateProject = async (req, res) => {
  // Track newly uploaded Cloudinary response so we can roll it back if DB save fails
  let newCloudinaryResponse = null;

  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found!" });
    }

    const {
      projectName,
      projectDescription,
      githubFrontendLink,
      githubBackendLink,
      livePreviewLink,
      techStack,
    } = req.body;

    // Parse techStack only if it was actually sent
    let parsedTechStack;
    if (typeof techStack === "string") {
      parsedTechStack = techStack.split(",").map((tech) => tech.trim());
    } else if (Array.isArray(techStack)) {
      parsedTechStack = techStack;
    }

    const oldPublicId = project.projectImagePublicId;

    // If a new image is provided, upload it first (don't delete old one yet)
    if (req.file) {
      newCloudinaryResponse = await uploadOnCloudinary(
        req.file.path,
        "portfolio_projectImage",
      );

      if (!newCloudinaryResponse) {
        return res.status(500).json({
          success: false,
          message: "Failed to upload image to Cloudinary",
        });
      }

      project.projectImage = newCloudinaryResponse.secure_url;
      project.projectImagePublicId = newCloudinaryResponse.public_id;
    }

    if (projectName) project.projectName = projectName;
    if (projectDescription) project.projectDescription = projectDescription;
    if (githubFrontendLink) project.githubFrontendLink = githubFrontendLink;
    if (githubBackendLink) project.githubBackendLink = githubBackendLink;
    if (livePreviewLink) project.livePreviewLink = livePreviewLink;
    if (parsedTechStack) project.techStack = parsedTechStack;

    const updatedProject = await project.save();

    // DB save succeeded — now safe to delete the old image (if a new one replaced it)
    if (req.file && oldPublicId) {
      await cloudinary.uploader.destroy(oldPublicId).catch((err) => {
        console.error("Failed to delete old Cloudinary image:", err.message);
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project updated successfully!",
      data: updatedProject,
    });
  } catch (error) {
    console.error("Error in updateProject:", error);

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

// Delete Project Controller
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the project first so we have the Cloudinary public_id before deleting
    const project = await Project.findById(id);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found!" });
    }

    // Delete the project document from MongoDB
    await Project.findByIdAndDelete(id);

    // Delete the associated image from Cloudinary (if it exists)
    if (project.projectImagePublicId) {
      await cloudinary.uploader
        .destroy(project.projectImagePublicId)
        .catch((err) => {
          // Log but don't fail the request — DB record is already deleted
          console.error("Failed to delete Cloudinary image:", err.message);
        });
    }

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully!",
      data: project,
    });
  } catch (error) {
    console.error("Error in deleteProject:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};