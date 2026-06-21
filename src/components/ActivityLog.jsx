import React, { useState, useEffect } from "react";
import {
  Clock,
  MessageSquare,
  Upload,
  UserPlus,
  UserMinus,
  Trash2,
  Building2,
  FileText,
} from "lucide-react";

const ActivityLog = ({ workspaceId }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    if (workspaceId) loadActivities();
  }, [workspaceId]);

  const loadActivities = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/workspaces/${workspaceId}/activity?limit=20`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        },
      );
      if (res.ok) {
        const data = await res.json();
        setActivities(data);
      }
    } catch (err) {
      console.error("Failed to load activities:", err);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (action) => {
    switch (action) {
      case "query":
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case "upload":
        return <Upload className="w-4 h-4 text-purple-500" />;
      case "document_delete":
        return <Trash2 className="w-4 h-4 text-red-500" />;
      case "member_added":
        return <UserPlus className="w-4 h-4 text-green-500" />;
      case "member_removed":
        return <UserMinus className="w-4 h-4 text-orange-500" />;
      case "workspace_created":
        return <Building2 className="w-4 h-4 text-amber-500" />;
      default:
        return <FileText className="w-4 h-4 text-slate-500" />;
    }
  };

  const getLabel = (item) => {
    switch (item.action) {
      case "query":
        return `Asked: "${item.details?.question || "a question"}"`;
      case "upload":
        return `Uploaded "${item.details?.documentName || "a document"}"`;
      case "document_delete":
        return `Deleted "${item.details?.documentName || "a document"}"`;
      case "member_added":
        return `Added ${item.details?.memberEmail || "a member"} to workspace`;
      case "member_removed":
        return "Removed a member from workspace";
      case "workspace_created":
        return `Created workspace "${item.details?.workspaceName || ""}"`;
      default:
        return "Performed an action";
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(date).toLocaleDateString();
  };

  if (!workspaceId) return null;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700">
        <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-500" />
          Activity Log
        </h3>
      </div>

      <div className="p-4 max-h-80 overflow-y-auto">
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                  <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-500">
              No activity yet
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Actions will appear here once the workspace is in use.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {activities.map((item, i) => (
              <div
                key={item._id || i}
                className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                  {getIcon(item.action)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 dark:text-slate-200">
                    {item.user?.name || "Someone"} {getLabel(item)}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {getTimeAgo(item.createdAt)}
                    {item.tokensUsed > 0 && ` · ${item.tokensUsed} tokens`}
                    {item.documentSize > 0 &&
                      ` · ${(item.documentSize / 1024).toFixed(1)} KB`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLog;
