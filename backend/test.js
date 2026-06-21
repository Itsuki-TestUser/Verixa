import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const uri = process.env.MONGO_URI.replace(
  "<db_password>",
  process.env.MONGODB_PASSWORD || "",
);
await mongoose.connect(uri);
const db = mongoose.connection.db;

try {
  await db.collection("workspaces").dropIndex("slug_1");
  console.log("✅ Dropped unique slug index");
} catch (e) {
  console.log("Index already removed or not found");
}

process.exit();
