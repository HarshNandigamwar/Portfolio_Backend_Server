import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    dateRange: {
      type: String,
      required: true,
      trim: true,
    },
    post: {
      type: String,
      required: true,
      trim: true,
    },
    organization: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    roles: {
      type: [String],
      required: true,
    },
    techStack: {
      type: [String],
      required: true,
    },
    certificateId: {
      type: String,
      trim: true,
    },
    downloadLink: {
      type: String,
      trim: true,
    },
    certificateImage: {
      type: String,
      required: true,
    },
    certificateImagePublicId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const Experience = mongoose.model("Experience", experienceSchema);
