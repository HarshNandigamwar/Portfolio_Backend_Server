import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const startSpinner = (text) => {
  const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  let i = 0;
  return setInterval(() => {
    process.stdout.write(`\r${frames[(i = ++i % frames.length)]} ${text}`);
  }, 80);
};
 
const connectDB = async () => {
  const spinner = startSpinner("Connecting to MongoDB...");
  let MONGODB_URL;
  if (process.env.NODE_ENV == "development") {
    MONGODB_URL = process.env.MONGODB_URI_DEVELOPMENT;
  } else {
    MONGODB_URL = process.env.MONGODB_URI;
  }
  try {
    const conn = await mongoose.connect(MONGODB_URL);
    clearInterval(spinner);
    process.stdout.write(`\r📡 MongoDB Connected: ${conn.connection.host}\n`);
  } catch (error) {
    clearInterval(spinner);
    process.stdout.write(`\r❌ Database Connection Error: ${error.message}\n`);
    process.exit(1);
  }
};

export default connectDB;
