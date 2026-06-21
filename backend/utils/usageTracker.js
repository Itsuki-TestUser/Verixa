import Usage from "../models/usageModel.js";

export const trackUsage = (data) => {
  // Fire and forget — don't block the request
  Usage.create({
    workspace: data.workspaceId,
    user: data.userId,
    action: data.action,
    details: data.details || {},
    tokensUsed: data.tokensUsed || 0,
    documentSize: data.documentSize || 0,
  }).catch((err) => console.error("Usage tracking error:", err.message));
};
