import app from "./app.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import process from "process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

mongoose
  .connect(
    process.env.MONGO_URI.replace(
      "<db_password>",
      process.env.MONGODB_PASSWORD || "",
    ),
  )
  .then(() => {
    console.log("MongoDB connected successfully! ✅");
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
