import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  isAi: { type: Boolean, required: true },
  text: { type: String, required: true },
  citations: { type: Array, default: [] },
});

const conversationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      default: null,
      index: true,
    },
    messages: [messageSchema],
  },
  {
    timestamps: true,
  },
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
