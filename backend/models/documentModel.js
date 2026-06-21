import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    originalName: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["HR", "Finance", "Engineering", "Legal", "Other"],
    },
    filePath: { type: String, required: true },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      default: null,
      index: true,
    },
  },
  { timestamps: true },
);

export const Document = mongoose.model("Document", documentSchema);
