import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: true,
      trim: true,
    },
    projectDescription: {
      type: String,
      required: true,
      trim: true,
    },
    projectImage: {
      type: String,
      required: true,
    },
    projectImagePublicId: {
      type: String,
      required: true,
    },
    githubFrontendLink: {
      type: String,
      trim: true,
    },
    githubBackendLink: {
      type: String,
      trim: true,
    },
    livePreviewLink: {
      type: String,
      trim: true,
    },
    techStack: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true },
);

export const Project = mongoose.model("Project", projectSchema);
