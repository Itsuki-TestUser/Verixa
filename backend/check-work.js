import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGO_URI.replace(
  "<db_password>",
  process.env.MONGODB_PASSWORD || "",
);
await mongoose.connect(uri);
console.log("✅ Connected\n");

const db = mongoose.connection.db;
const workspace = await db
  .collection("workspaces")
  .findOne({ name: "Nexus-dev" });

console.log("Workspace:", workspace.name);
console.log("Owner type:", typeof workspace.owner, "- Value:", workspace.owner);
console.log("\nMembers:");
workspace.members.forEach((m, i) => {
  console.log(
    `  ${i + 1}. user type: ${typeof m.user}, role: ${m.role}, value: ${m.user}`,
  );
});

await mongoose.disconnect();
process.exit();
