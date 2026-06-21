import mongoose from "mongoose";

const usageSchema = new mongoose.Schema(
  {
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      enum: [
        "query",
        "upload",
        "document_delete",
        "member_added",
        "member_removed",
        "workspace_created",
      ],
      required: true,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    tokensUsed: {
      type: Number,
      default: 0,
    },
    documentSize: {
      type: Number,
      default: 0, // in bytes
    },
  },
  { timestamps: true },
);

usageSchema.index({ workspace: 1, createdAt: -1 });
usageSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("Usage", usageSchema);
