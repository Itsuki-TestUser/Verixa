import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") }); // ← fixed path

async function migrate() {
  const uri = process.env.MONGO_URI.replace(
    "<db_password>",
    process.env.MONGODB_PASSWORD || "",
  );

  if (!uri) {
    console.error("❌ MONGO_URI is missing");
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db();
    const usersCol = db.collection("users");
    const workspacesCol = db.collection("workspaces");
    const documentsCol = db.collection("documents");
    const chunksCol = db.collection("chunks");
    const conversationsCol = db.collection("conversations");

    const users = await usersCol.find({}).toArray();
    console.log(`📊 Found ${users.length} users\n`);

    for (const user of users) {
      const defaultSlug = `default-${user._id}`.toLowerCase();
      const userId = user._id.toString();

      // 1. Find or create default workspace
      let workspace = await workspacesCol.findOne({
        owner: user._id.toString(),
        isDefault: true,
      });

      if (!workspace) {
        const result = await workspacesCol.insertOne({
          name: "Default Workspace",
          slug: defaultSlug,
          owner: user._id.toString(),
          isDefault: true,
          members: [{ user: user._id.toString(), role: "admin" }],
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        workspace = await workspacesCol.findOne({ _id: result.insertedId });
        console.log(`✨ Created default workspace for ${user.email || userId}`);
      } else {
        console.log(`⏭️  Workspace exists for ${user.email || userId}`);
      }

      const workspaceId = workspace._id.toString();

      // 2. Update documents
      const docResult = await documentsCol.updateMany(
        { uploadedBy: user._id.toString(), workspaceId: null },
        { $set: { workspaceId: workspaceId } },
      );
      console.log(`   📄 ${docResult.modifiedCount} documents updated`);

      // 3. Update conversations
      const chatResult = await conversationsCol.updateMany(
        { user: user._id.toString(), workspaceId: null },
        { $set: { workspaceId: workspaceId } },
      );
      console.log(`   💬 ${chatResult.modifiedCount} conversations updated`);

      // 4. Update chunks
      const chunkResult = await chunksCol.updateMany(
        { workspaceId: null },
        { $set: { workspaceId: workspaceId } },
      );
      console.log(`   🧩 ${chunkResult.modifiedCount} chunks updated\n`);
    }

    console.log("✅ Migration complete!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    await client.close();
  }
}

migrate();
