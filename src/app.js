import express from "express";
import cors from "cors";
import certificateRouter from "./routes/certificate.routes.js";
import projectRouter from "./routes/project.routes.js";
import courseRouter from "./routes/course.routes.js";
import experienceRouter from "./routes/experience.routes.js";

const app = express();

// Middlewares
// app.use(
//   cors({
//     origin: process.env.CORS_ORIGIN1 || process.env.CORS_ORIGIN2,
//     credentials: true,
//   }),
// );
const allowedOrigins = [
  process.env.CORS_ORIGIN1,
  process.env.CORS_ORIGIN2,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Default / Welcome Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Shriharsh's Portfolio Backend Server API!",
    version: "1.0.0",
    status: "Active & Healthy",

    developer: {
      name: "Shriharsh Nandigamwar",
      role: "Fullstack Web Developer",
      specialization: "MERN Stack / Next.js / TypeScript",
      github: "https://github.com/HarshNandigamwar",
      linkedin: "https://www.linkedin.com/in/shriharsh-nandigamwar-b106702b1",
      portfolio: "https://shriharshnandigamwar.vercel.app",
    },

    apiEndpoints: {
      healthCheck: {
        method: "GET",
        path: "/awake",
        description: "Check if server is live",
      },
      certificates: {
        getAll: {
          method: "GET",
          path: `/api/${process.env.API_VERSION || "v1"}/certificates/get_certificate`,
          description: "Fetch all uploaded certificates",
        },
      },
      projects: {
        getAll: {
          method: "GET",
          path: `/api/${process.env.API_VERSION || "v1"}/projects/get_project`,
          description: "Fetch all uploaded projects",
        },
      },
      courses: {
        getAll: {
          method: "GET",
          path: `/api/${process.env.API_VERSION || "v1"}/courses/get_course`,
          description: "Fetch all uploaded courses",
        },
      },
      experiences: {
        getAll: {
          method: "GET",
          path: `/api/${process.env.API_VERSION || "v1"}/experiences/get_experience`,
          description: "Fetch all uploaded experiences",
        },
      },
    },
  });
});

// Health Check Route
app.get("/awake", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is up and running smoothly!",
  });
});

// Certificate Route
app.use(
  `/api/${process.env.API_VERSION || "v1"}/certificates`,
  certificateRouter,
);

// Project Route
app.use(`/api/${process.env.API_VERSION || "v1"}/projects`, projectRouter);

// Course Route
app.use(`/api/${process.env.API_VERSION || "v1"}/courses`, courseRouter);

//Experience Route
app.use(
  `/api/${process.env.API_VERSION || "v1"}/experiences`,
  experienceRouter,
);

export default app;
