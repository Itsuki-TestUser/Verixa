import mongoose from "mongoose";

const chunkSchema = new mongoose.Schema({
  text: { type: String, required: true },
  embedding: { type: [Number], required: true },
  category: { type: String, default: "general" },
  documentName: { type: String, required: true },
  chunkIndex: { type: Number, required: true },
  pageNumber: { type: Number, default: 1 }, // Added pageNumber field for citations
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace",
    default: null,
    index: true,
  },
});

chunkSchema.index({ category: 1 });

export default mongoose.model("Chunk", chunkSchema);
