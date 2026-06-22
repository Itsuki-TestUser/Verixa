import Workspace from "../models/workspaceModel.js";
import { Document } from "../models/documentModel.js";
import { trackUsage } from "../utils/usageTracker.js";
import Usage from "../models/usageModel.js";
import mongoose from "mongoose";
import Conversation from "../models/conversationModel.js";
import { Chunk } from "../models/chunkModel.js";
// Add member to workspace
export const addMember = async (req, res) => {
  try {
    const { email, role } = req.body;
    const User = (await import("../models/userModel.js")).User;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const workspace = await Workspace.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!workspace) {
      return res
        .status(404)
        .json({ message: "Workspace not found or unauthorized" });
    }

    const existing = workspace.members.find(
      (m) => m.user.toString() === user._id.toString(),
    );
    if (existing) {
      return res.status(400).json({ message: "User is already a member" });
    }

    workspace.members.push({ user: user._id, role: role || "member" });
    await workspace.save();

    await trackUsage({
      workspaceId: req.params.id,
      userId: req.user._id,
      action: "member_added",
      details: { memberEmail: email },
    });

    res.json(workspace);
  } catch (error) {
    res.status(500).json({ message: "Failed to add member" });
  }
};

// Remove member from workspace
export const removeMember = async (req, res) => {
  try {
    const workspace = await Workspace.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!workspace) {
      return res
        .status(404)
        .json({ message: "Workspace not found or unauthorized" });
    }

    if (workspace.owner.toString() === req.params.userId) {
      return res.status(400).json({ message: "Cannot remove workspace owner" });
    }

    workspace.members = workspace.members.filter(
      (m) => m.user.toString() !== req.params.userId,
    );
    await workspace.save();

    await trackUsage({
      workspaceId: req.params.id,
      userId: req.user._id,
      action: "member_removed",
      details: { memberId: req.params.userId },
    });

    res.json(workspace);
  } catch (error) {
    res.status(500).json({ message: "Failed to remove member" });
  }
};

// Update member role
export const updateMemberRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!["admin", "member"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const workspace = await Workspace.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!workspace) {
      return res
        .status(404)
        .json({ message: "Workspace not found or unauthorized" });
    }

    const member = workspace.members.find(
      (m) => m.user.toString() === req.params.userId,
    );
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    member.role = role;
    await workspace.save();

    res.json(workspace);
  } catch (error) {
    res.status(500).json({ message: "Failed to update member role" });
  }
};

// Create a new workspace
export const createWorkspace = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Workspace name is required" });
    }

    const slug = `${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;

    const workspace = await Workspace.create({
      name,
      slug,
      owner: req.user._id,
      members: [{ user: req.user._id, role: "admin" }],
    });

    await trackUsage({
      workspaceId: workspace._id,
      userId: req.user._id,
      action: "workspace_created",
      details: { workspaceName: name },
    });

    res.status(201).json(workspace);
  } catch (error) {
    console.error("Create workspace error:", error);
    res.status(500).json({ message: "Failed to create workspace" });
  }
};

// Get all workspaces for logged-in user
export const getWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({
      $or: [{ owner: req.user._id }, { "members.user": req.user._id }],
    })
      .populate("members.user", "name email")
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    const workspacesWithRole = workspaces.map((ws) => {
      const isOwner = ws.owner._id.toString() === req.user._id.toString();
      const member = ws.members.find(
        (m) => m.user._id.toString() === req.user._id.toString(),
      );
      return {
        ...ws.toObject(),
        myRole: isOwner ? "admin" : member?.role || "member",
        isOwner,
      };
    });

    res.json(workspacesWithRole);
  } catch (error) {
    res.status(500).json({ message: "Failed to get workspaces" });
  }
};

// Get single workspace
export const getWorkspaceById = async (req, res) => {
  try {
    const workspace = await Workspace.findOne({
      _id: req.params.id,
      $or: [{ owner: req.user._id }, { "members.user": req.user._id }],
    })
      .populate("members.user", "name email")
      .populate("owner", "name email");

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    res.json(workspace);
  } catch (error) {
    res.status(500).json({ message: "Failed to get workspace" });
  }
};

// Update workspace
export const updateWorkspace = async (req, res) => {
  try {
    const { name } = req.body;

    const workspace = await Workspace.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!workspace) {
      return res
        .status(404)
        .json({ message: "Workspace not found or unauthorized" });
    }

    if (name) {
      workspace.name = name;
      workspace.slug = `${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
    }

    await workspace.save();
    res.json(workspace);
  } catch (error) {
    console.error("Update workspace error:", error);
    res.status(500).json({ message: "Failed to update workspace" });
  }
};

// Delete workspace
export const deleteWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!workspace) {
      return res
        .status(404)
        .json({ message: "Workspace not found or unauthorized" });
    }

    if (workspace.isDefault) {
      return res
        .status(400)
        .json({ message: "Cannot delete default workspace" });
    }

    const workspaceId = workspace._id;

    // Delete all conversations in this workspace
    await Conversation.deleteMany({ workspaceId: workspaceId });
    console.log("✅ Deleted conversations for workspace:", workspaceId);

    // Delete all chunks in this workspace
    await Chunk.deleteMany({ workspaceId: workspaceId });
    console.log("✅ Deleted chunks for workspace:", workspaceId);

    // Delete all documents in this workspace
    await Document.deleteMany({ workspaceId: workspaceId });
    console.log("✅ Deleted documents for workspace:", workspaceId);

    // Delete the workspace itself
    await Workspace.findByIdAndDelete(workspaceId);
    console.log("✅ Deleted workspace:", workspaceId);

    res.json({ message: "Workspace and all associated data deleted" });
  } catch (error) {
    console.error("Delete workspace error:", error);
    res.status(500).json({ message: "Failed to delete workspace" });
  }
};

// Get workspace usage stats
export const getWorkspaceUsage = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const since = new Date();
    since.setDate(since.getDate() - parseInt(days));

    const stats = await Usage.aggregate([
      {
        $match: {
          workspace: new mongoose.Types.ObjectId(req.params.id),
          createdAt: { $gte: since },
        },
      },
      {
        $group: {
          _id: "$action",
          count: { $sum: 1 },
          totalTokens: { $sum: "$tokensUsed" },
          totalStorage: { $sum: "$documentSize" },
        },
      },
    ]);

    const totalQueries = stats.find((s) => s._id === "query")?.count || 0;
    const totalUploads = stats.find((s) => s._id === "upload")?.count || 0;
    const totalTokens = stats.reduce((acc, s) => acc + s.totalTokens, 0);
    const totalStorage = stats.reduce((acc, s) => acc + s.totalStorage, 0);

    res.json({
      totalQueries,
      totalUploads,
      totalTokens,
      totalStorage: `${(totalStorage / (1024 * 1024)).toFixed(2)} MB`,
      breakdown: stats,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch usage" });
  }
};
export const getWorkspaceActivity = async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const activities = await Usage.find({
      workspace: req.params.id,
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate("user", "name email");

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch activity" });
  }
};
