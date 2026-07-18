import express from "express";
import cors from "cors";
import certificateRouter from "./routes/certificate.routes.js";

const app = express();

// Middlewares
app.use(
  cors({
    origin: "*", // Frontend URL
    credentials: true,
  }),
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Health Check Route
app.get("/awake", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is up and running smoothly!",
  });
});

// Upload Certificate
app.use("/api/v1/certificates", certificateRouter);

export default app;
