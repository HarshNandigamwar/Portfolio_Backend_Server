import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    certificateName: {
      type: String,
      required: true,
      trim: true,
    },
    certificateCategory: {
      type: String,
      required: true,
      trim: true,
    },
    organizationName: {
      type: String,
      required: true,
      trim: true,
    },
    completionYear: {
      type: Number,
      required: true,
    },
    certificateDescription: {
      type: String,
      trim: true,
    },
    liveLink: {
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

export const Certificate = mongoose.model("Certificate", certificateSchema);
