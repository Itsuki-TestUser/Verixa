import express from "express";
import {
  getConversations,
  getConversationById,
  saveConversation,
  deleteConversation,
} from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";
import { resolveWorkspace } from "../middleware/workspaceMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(protect, resolveWorkspace, getConversations)
  .post(protect, resolveWorkspace, saveConversation);

router
  .route("/:id")
  .get(protect, getConversationById)
  .delete(protect, deleteConversation);

export default router;
