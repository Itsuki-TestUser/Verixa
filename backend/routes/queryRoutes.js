import express from "express";
import { askQuestion } from "../controllers/queryCtrl.js";
import { protect } from "../middleware/authMiddleware.js";
import { resolveWorkspace } from "../middleware/workspaceMiddleware.js";
import { queryLimiter } from "../middleware/rateLimiter.js";
const router = express.Router();

// Changed from / to /ask to explicitly define endpoint
router.post("/ask", protect, resolveWorkspace, queryLimiter, askQuestion);

export default router;
