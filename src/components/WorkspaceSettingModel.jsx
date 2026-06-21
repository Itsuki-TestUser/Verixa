import React, { useState, useEffect } from "react";
import {
  X,
  UserPlus,
  Trash2,
  Shield,
  ShieldOff,
  AlertTriangle,
  Users,
  Settings,
  Crown,
  Mail,
  ChevronDown,
} from "lucide-react";

const WorkspaceSettingsModal = ({ workspaceId, myRole, onClose }) => {
  const [workspace, setWorkspace] = useState(null);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState("members");

  const API_URL =
    import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8080/api";
  const getToken = () => localStorage.getItem("token");

  const isAdmin = myRole === "admin";
  const isOwner =
    workspace?.owner?._id === JSON.parse(atob(getToken().split(".")[1]))?.id;

  useEffect(() => {
    loadWorkspace();
  }, [workspaceId]);

  const loadWorkspace = async () => {
    try {
      const res = await fetch(`${API_URL}/workspaces/${workspaceId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      setWorkspace(data);
    } catch (err) {
      console.error("Failed to load workspace:", err);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/workspaces/${workspaceId}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ email, role }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to add member");
      }

      await loadWorkspace();
      setEmail("");
      setRole("member");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      await fetch(`${API_URL}/workspaces/${workspaceId}/members/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      await loadWorkspace();
    } catch (err) {
      console.error("Failed to remove member:", err);
    }
  };

  const handleToggleRole = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "member" : "admin";
    try {
      await fetch(
        `${API_URL}/workspaces/${workspaceId}/members/${userId}/role`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({ role: newRole }),
        },
      );
      await loadWorkspace();
    } catch (err) {
      console.error("Failed to update role:", err);
    }
  };

  const handleDeleteWorkspace = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`${API_URL}/workspaces/${workspaceId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete");
      }

      window.dispatchEvent(new CustomEvent("workspaceChanged"));
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (!workspace) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">
                  {workspace.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                  {workspace.name}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {workspace.members?.length || 0} member
                  {(workspace.members?.length || 0) !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pb-2 border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab("members")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === "members"
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/20"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <Users className="w-4 h-4" />
            Members
          </button>
          {isAdmin && (
            <button
              onClick={() => setActiveTab("settings")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === "settings"
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/20"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {activeTab === "members" && (
            <>
              {/* Members List */}
              <div className="space-y-1">
                {workspace.members?.map((member) => {
                  const memberId = member.user?._id || member.user;
                  const isOwnerMember =
                    workspace.owner === memberId ||
                    workspace.owner?._id === memberId;

                  return (
                    <div
                      key={member._id}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                            {member.user?.name?.charAt(0) ||
                              member.user?.email?.charAt(0) ||
                              "U"}
                          </div>
                          {isOwnerMember && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-amber-400 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
                              <Crown className="w-2.5 h-2.5 text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                            {member.user?.name ||
                              member.user?.email ||
                              "Unknown"}
                            {isOwnerMember && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-medium">
                                Owner
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-slate-400">
                            {member.user?.email || ""}
                          </p>
                        </div>
                      </div>

                      {isAdmin && !isOwnerMember && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() =>
                              handleToggleRole(memberId, member.role)
                            }
                            className={`p-1.5 rounded-lg transition-colors ${
                              member.role === "admin"
                                ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 hover:bg-amber-200"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200"
                            }`}
                            title={
                              member.role === "admin"
                                ? "Demote to Member"
                                : "Promote to Admin"
                            }
                          >
                            {member.role === "admin" ? (
                              <ShieldOff className="w-3.5 h-3.5" />
                            ) : (
                              <Shield className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleRemoveMember(memberId)}
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Add Member */}
              {isAdmin ? (
                <form
                  onSubmit={handleAddMember}
                  className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                >
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-blue-500" />
                    Invite Member
                  </h4>
                  <div className="flex flex-col gap-3">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="colleague@company.com"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <select
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          className="w-full appearance-none pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                        >
                          <option value="member">Member</option>
                          <option value="admin">Admin</option>
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                      <button
                        type="submit"
                        disabled={loading || !email.trim()}
                        className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium transition-colors shadow-sm"
                      >
                        {loading ? "Inviting..." : "Add Member"}
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-center">
                  <Users className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Only workspace admins can manage members.
                  </p>
                </div>
              )}
            </>
          )}

          {activeTab === "settings" && isAdmin && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-700 dark:text-red-400">
                      Danger Zone
                    </h4>
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                      Permanently delete this workspace and all its data. This
                      action cannot be undone.
                    </p>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="mt-3 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 text-sm font-medium transition-colors"
                    >
                      Delete Workspace
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Delete Confirmation Footer */}
        {showDeleteConfirm && (
          <div className="p-4 border-t border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30">
            <p className="text-sm font-medium text-red-700 dark:text-red-400 mb-3">
              Are you sure? This will delete "{workspace.name}" forever.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleDeleteWorkspace}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm font-medium transition-colors"
              >
                {deleting ? "Deleting..." : "Yes, Delete Forever"}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkspaceSettingsModal;
