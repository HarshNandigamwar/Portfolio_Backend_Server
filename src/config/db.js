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

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    clearInterval(spinner);
    process.stdout.write(`\r📡 MongoDB Connected: ${conn.connection.host}\n`);
  } catch (error) {
    clearInterval(spinner);
    process.stdout.write(`\r❌ Database Connection Error: ${error.message}\n`);
    process.exit(1);
  }
};

export default connectDB;
