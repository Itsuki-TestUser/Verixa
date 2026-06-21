import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();
export const protect = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    try {
      token = authHeader.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "supersecret123",
      );
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        return res
          .status(401)
          .json({ message: "Not authorized, user not found" });
      }
      return next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

export const admin = async (req, res, next) => {
  // First check global role
  if (req.user && req.user.role === "admin") {
    return next();
  }

  // If workspaceId exists, check workspace-level role
  if (req.workspaceId && req.user) {
    const Workspace = (await import("../models/workspaceModel.js")).default;
    const workspace = await Workspace.findById(req.workspaceId);

    if (workspace) {
      console.log("  Owner:", String(workspace.owner));
      console.log(
        "  Members:",
        workspace.members.map((m) => ({
          user: String(m.user),
          role: m.role,
        })),
      );

      const member = workspace.members.find(
        (m) => String(m.user) === String(req.user._id),
      );

      console.log(
        "  Found member:",
        member ? `Yes - role: ${member.role}` : "NO",
      );

      if (member && member.role === "admin") {
        console.log("  ✅ ADMIN AUTHORIZED");
        return next();
      }
    }
  }

  console.log("  ❌ ACCESS DENIED");
  res.status(403).json({ message: "Not authorized as admin" });
};
