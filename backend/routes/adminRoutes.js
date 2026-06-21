import express from "express";
import { uploadDocument } from "../controllers/documentCtrl.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import { resolveWorkspace } from "../middleware/workspaceMiddleware.js";
import { uploadLimiter } from "../middleware/rateLimiter.js";
const router = express.Router();

router.post(
  "/upload",
  protect,
  admin,
  uploadLimiter,
  resolveWorkspace,
  upload.single("file"),
  uploadDocument,
);

export default router;
