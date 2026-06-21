import express from "express";
import {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  addMember,
  removeMember,
  updateMemberRole,
} from "../controllers/workspaceController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import { workspaceLimiter } from "../middleware/rateLimiter.js";
import { getWorkspaceUsage } from "../controllers/workspaceController.js";
import { getWorkspaceActivity } from "../controllers/workspaceController.js";
const router = express.Router();

router
  .route("/")
  .post(protect, workspaceLimiter, createWorkspace)
  .get(protect, getWorkspaces);

router.route("/:id/usage").get(protect, getWorkspaceUsage);
router.get("/:id/activity", protect, getWorkspaceActivity);
router
  .route("/:id")
  .get(protect, getWorkspaceById)
  .put(protect, updateWorkspace)
  .delete(protect, deleteWorkspace);
// Add these inside your existing router
router.post("/:id/members", protect, admin, addMember);
router.delete("/:id/members/:userId", protect, admin, removeMember);
router.put("/:id/members/:userId/role", protect, admin, updateMemberRole);

export default router;
