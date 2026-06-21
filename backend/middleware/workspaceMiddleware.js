import Workspace from "../models/workspaceModel.js";

export const resolveWorkspace = async (req, res, next) => {
  try {
    let workspaceId =
      req.headers?.["x-workspace-id"] ||
      req.query?.workspaceId ||
      req.body?.workspaceId;

    if (workspaceId && workspaceId !== "undefined" && workspaceId !== "null") {
      req.workspaceId = workspaceId;
      return next();
    }

    if (!req.user) {
      return next();
    }

    // Try to find user's default workspace
    let workspace = await Workspace.findOne({
      owner: req.user._id,
      isDefault: true,
    });

    // If no default, try any workspace owned by this user
    if (!workspace) {
      workspace = await Workspace.findOne({ owner: req.user._id });
    }

    // If still none, create one
    if (!workspace) {
      try {
        workspace = await Workspace.create({
          name: "Default Workspace",
          slug: `default-${req.user._id}`,
          owner: req.user._id,
          isDefault: true,
          members: [{ user: req.user._id, role: "admin" }],
        });
      } catch (err) {
        // Final fallback
        workspace = await Workspace.findOne({ owner: req.user._id });
      }
    }

    req.workspaceId = workspace?._id || null;
    next();
  } catch (error) {
    console.error("Workspace resolution error:", error.message);
    req.workspaceId = null;
    next();
  }
};
