import { Certificate } from "../models/certificate.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";

// Certificate Upload Controller
export const uploadCertificate = async (req, res) => {
  // Track uploaded Cloudinary response so we can roll it back if DB save fails
  let cloudinaryResponse = null;

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

    // Upload the certificate image to Cloudinary
    cloudinaryResponse = await uploadOnCloudinary(
      req.file.path,
      "portfolio_certificates",
    );

    if (!cloudinaryResponse) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload image to Cloudinary",
      });
    }

    // Save certificate details in the database
    const newCertificate = await Certificate.create({
      certificateName,
      certificateCategory,
      organizationName,
      completionYear,
      certificateDescription,
      liveLink: cloudinaryResponse.secure_url,
      certificateImage: cloudinaryResponse.secure_url,
      certificateImagePublicId: cloudinaryResponse.public_id,
    });

    return res.status(201).json({
      success: true,
      message: "Certificate uploaded successfully!",
      data: newCertificate,
    });
  } catch (error) {
    console.error("Error in uploadCertificate:", error);

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

// Edit Certificate Controller
export const updateCertificate = async (req, res) => {
  let newCloudinaryResponse = null;

  try {
    const { id } = req.params;

    const certificate = await Certificate.findById(id);

    if (!certificate) {
      return res
        .status(404)
        .json({ success: false, message: "Certificate not found!" });
    }

    const {
      certificateName,
      certificateCategory,
      organizationName,
      completionYear,
      certificateDescription,
    } = req.body;

    const oldPublicId = certificate.certificateImagePublicId;

    // If a new image is provided, upload it first (don't delete old one yet)
    if (req.file) {
      newCloudinaryResponse = await uploadOnCloudinary(
        req.file.path,
        "portfolio_certificates",
      );

      if (!newCloudinaryResponse) {
        return res.status(500).json({
          success: false,
          message: "Failed to upload image to Cloudinary",
        });
      }

      certificate.liveLink = newCloudinaryResponse.secure_url;
      certificate.certificateImage = newCloudinaryResponse.secure_url;
      certificate.certificateImagePublicId = newCloudinaryResponse.public_id;
    }

    if (certificateName) certificate.certificateName = certificateName;
    if (certificateCategory)
      certificate.certificateCategory = certificateCategory;
    if (organizationName) certificate.organizationName = organizationName;
    if (completionYear) certificate.completionYear = completionYear;
    if (certificateDescription)
      certificate.certificateDescription = certificateDescription;

    const updatedCertificate = await certificate.save();

    // DB save succeeded — now safe to delete the old image (if a new one replaced it)
    if (req.file && oldPublicId) {
      await cloudinary.uploader.destroy(oldPublicId).catch((err) => {
        console.error("Failed to delete old Cloudinary image:", err.message);
      });
    }

    return res.status(200).json({
      success: true,
      message: "Certificate updated successfully!",
      data: updatedCertificate,
    });
  } catch (error) {
    console.error("Error in updateCertificate:", error);

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
