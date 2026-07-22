import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Product } from "./models/Product.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SEED_JSON_PATH = path.join(__dirname, "db.json");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/adrsmart";

export const connectMongoDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`🍃 Connected to MongoDB Database: ${MONGODB_URI}`);

    // Auto-sync products from db.json into MongoDB
    if (fs.existsSync(SEED_JSON_PATH)) {
      const rawData = fs.readFileSync(SEED_JSON_PATH, "utf-8");
      const parsed = JSON.parse(rawData);
      if (parsed.products && parsed.products.length > 0) {
        for (const p of parsed.products) {
          await Product.updateOne({ id: p.id }, { $set: p }, { upsert: true });
        }
        console.log(`✅ Synced ${parsed.products.length} products into MongoDB!`);
      }
    }
    return true;
  } catch (error) {
    console.warn("⚠️ MongoDB connection warning:", error.message);
    console.warn("👉 Make sure local MongoDB server is running on mongodb://127.0.0.1:27017 or set MONGODB_URI env variable.");
    return false;
  }
};
