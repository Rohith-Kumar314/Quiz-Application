// models/db.js
import mongoose from 'mongoose';

export const connectDB = async () => {
  const dburl = process.env.MONGO_URL; // read env inside function
  if (!dburl) {
    console.error("MONGO_URL is not defined in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(dburl); // no deprecated options
    console.log("✅ DB is Connected");
  } catch (err) {
    console.error("❌ DB connection failed:", err);
    process.exit(1); // stop server if DB connection fails
  }
};
