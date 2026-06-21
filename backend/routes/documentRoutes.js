import express from "express";
import {
  uploadDocument,
  getDocuments,
  deleteDocument,
} from "../controllers/documentCtrl.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import { resolveWorkspace } from "../middleware/workspaceMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, resolveWorkspace, admin, upload.single("file"), uploadDocument)
  .get(protect, resolveWorkspace, getDocuments);

router.route("/:id").delete(protect, resolveWorkspace, admin, deleteDocument);

export default router;
