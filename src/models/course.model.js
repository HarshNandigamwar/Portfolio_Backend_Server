import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: true,
      trim: true,
    },
    courseDescription: {
      type: String,
      required: true,
      trim: true,
    },
    verifyCredentialLink: {
      type: String,
      trim: true,
    },
    keySkills: {
      type: [String],
      required: true,
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

export const Course = mongoose.model("Course", courseSchema);
