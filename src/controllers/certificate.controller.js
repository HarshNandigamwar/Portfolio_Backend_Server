import { Certificate } from "../models/certificate.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Certificate Upload Controller
export const uploadCertificate = async (req, res) => {
  try {
    const {
      certificateName,
      certificateCategory,
      organizationName,
      completionYear,
      certificateDescription,
    } = req.body;

    if (
      !certificateName ||
      !certificateCategory ||
      !organizationName ||
      !completionYear ||
      !certificateDescription
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

    const cloudinaryResponse = await uploadOnCloudinary(
      req.file.path,
      "portfolio_certificates",
    );

    if (!cloudinaryResponse) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload image to Cloudinary",
      });
    }

    const newCertificate = await Certificate.create({
      certificateName,
      certificateCategory,
      organizationName,
      completionYear,
      certificateDescription,
      liveLink: cloudinaryResponse.secure_url,
      certificateImage: cloudinaryResponse.secure_url,
    });

    return res.status(201).json({
      success: true,
      message: "Certificate uploaded successfully!",
      data: newCertificate,
    });
  } catch (error) {
    console.error("Error in uploadCertificate:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Get All Certificates Controller
export const getCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: certificates.length,
      message: "Certificates fetched successfully!",
      data: certificates,
    });
  } catch (error) {
    console.error("Error in getCertificates:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
