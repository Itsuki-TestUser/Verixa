import { findOne, create } from "../models/Workspace";

const resolveWorkspace = async (req, res, next) => {
  try {
    // Check multiple sources for workspaceId
    const workspaceId =
      req.headers["x-workspace-id"] ||
      req.query.workspaceId ||
      req.body.workspaceId;

    if (workspaceId) {
      req.workspaceId = workspaceId;
      return next();
    }

    // Fallback: find user's default workspace
    if (req.user?._id) {
      const workspace = await findOne({
        owner: req.user._id,
        isDefault: true,
      });

      if (workspace) {
        req.workspaceId = workspace._id;
        return next();
      }

      // Last resort: create a default workspace
      const newWorkspace = await create({
        name: "Default Workspace",
        owner: req.user._id,
        isDefault: true,
        members: [{ user: req.user._id, role: "admin" }],
      });

      req.workspaceId = newWorkspace._id;
      return next();
    }

    // No user context — allow through with null (public routes)
    req.workspaceId = null;
    next();
  } catch (error) {
    next(error);
  }
};

export default resolveWorkspace;
