import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    dateRange: {
      type: String, // ex: "Feb 2025 – Mar 2025"
      required: true,
      trim: true,
    },
    post: {
      type: String, // ex: "Web Development Intern"
      required: true,
      trim: true,
    },
    organization: {
      type: String, // ex: "SkillCraft Technology"
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    roles: {
      type: [String], // Array of roles/responsibilities
      required: true,
    },
    techStack: {
      type: [String], // Array of tech used
      required: true,
    },
    certificateId: {
      type: String, // ex: "SCT/FEB25/5707"
      trim: true,
    },
    downloadLink: {
      type: String, // Credential download link if any
      trim: true,
    },
    certificateImage: {
      type: String, // Cloudinary URL
      required: true,
    },
  },
  { timestamps: true },
);

export const Experience = mongoose.model("Experience", experienceSchema);
