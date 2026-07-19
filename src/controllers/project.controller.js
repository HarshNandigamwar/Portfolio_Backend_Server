import { Project } from "../models/project.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Upload Project Controller
export const uploadProject = async (req, res) => {
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

    const cloudinaryResponse = await uploadOnCloudinary(
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
    });

    return res.status(201).json({
      success: true,
      message: "Project uploaded successfully!",
      data: newProject,
    });
  } catch (error) {
    console.error("Error in uploadProject:", error);
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
