import { Course } from "../models/course.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

//Course Upload Controller
export const uploadCourse = async (req, res) => {
  try {
    const { courseName, courseDescription, verifyCredentialLink, keySkills } =
      req.body;

    if (!courseName || !courseDescription || !keySkills) {
      return res
        .status(400)
        .json({ success: false, message: "Required fields are missing!" });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Certificate image is required!" });
    }

    let parsedKeySkills = [];
    if (typeof keySkills === "string") {
      parsedKeySkills = keySkills.split(",").map((skill) => skill.trim());
    } else if (Array.isArray(keySkills)) {
      parsedKeySkills = keySkills;
    }

    const cloudinaryResponse = await uploadOnCloudinary(
      req.file.path,
      "portfolio_courses",
    );

    if (!cloudinaryResponse) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload image to Cloudinary",
      });
    }

    const newCourse = await Course.create({
      courseName,
      courseDescription,
      verifyCredentialLink,
      keySkills: parsedKeySkills,
      certificateImage: cloudinaryResponse.secure_url,
    });

    return res.status(201).json({
      success: true,
      message: "Course uploaded successfully!",
      data: newCourse,
    });
  } catch (error) {
    console.error("Error in uploadCourse:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//Get Course Controller
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: courses.length,
      message: "Courses fetched successfully!",
      data: courses,
    });
  } catch (error) {
    console.error("Error in getCourses:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
