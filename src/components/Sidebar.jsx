import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  MessageSquare,
  Folder,
  Settings,
  User,
  Plus,
  Trash2,
  X,
  LayoutDashboard,
  Shield,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ role, onClose }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);

  const API_URL =
    import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8080/api";

  const getToken = () => localStorage.getItem("token");
  const getActiveWorkspaceId = () =>
    localStorage.getItem("activeWorkspaceId") || "";

  // Workspace role from localStorage (updated by WorkspaceSelector)
  const workspaceRole = localStorage.getItem("myWorkspaceRole") || "member";
  const isOwner = localStorage.getItem("isWorkspaceOwner") === "true";
  const isAdmin = role === "admin" || workspaceRole === "admin";

  const loadConversations = async () => {
    setLoadingChats(true);
    try {
      const res = await fetch(`${API_URL}/chat`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "x-workspace-id": getActiveWorkspaceId(),
        },
      });
      const data = await res.json();
      setConversations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load conversations:", err);
    } finally {
      setLoadingChats(false);
    }
  };

  useEffect(() => {
    loadConversations();
    window.addEventListener("workspaceChanged", loadConversations);
    window.addEventListener("conversationUpdated", loadConversations);
    return () => {
      window.removeEventListener("workspaceChanged", loadConversations);
      window.removeEventListener("conversationUpdated", loadConversations);
    };
  }, []);

  const handleLoadConversation = (conv) => {
    window.dispatchEvent(
      new CustomEvent("loadConversation", {
        detail: {
          messages: conv.messages,
          conversationId: conv._id,
        },
      }),
    );
    onClose?.();
  };

  const handleNewChat = () => {
    window.dispatchEvent(new CustomEvent("newChat"));
    onClose?.();
  };

  const handleDeleteConversation = async (e, id) => {
    e.stopPropagation();
    try {
      await fetch(`${API_URL}/chat/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      loadConversations();
      window.dispatchEvent(new CustomEvent("newChat"));
    } catch (err) {
      console.error("Failed to delete conversation:", err);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg">
            <img className="h-8 w-auto" src="/favicon-2.png" alt="Verixa AI" />
          </div>
          <h1 className="text-lg font-bold text-slate-800 dark:text-white">
            Verixa AI
          </h1>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden transition-colors"
        >
          <X className="w-5 h-5 text-slate-500" />
        </button>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-3">
        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 mb-2">
          Chat History
        </p>
        <div className="flex flex-col gap-0.5">
          {loadingChats ? (
            <div className="space-y-1 px-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3 py-2 animate-pulse"
                >
                  <div className="w-4 h-4 rounded bg-slate-200 dark:bg-slate-700 shrink-0" />
                  <div
                    className="flex-1 h-3 rounded bg-slate-200 dark:bg-slate-700"
                    style={{ width: `${60 + Math.random() * 30}%` }}
                  />
                </div>
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex flex-col items-center py-8 px-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                <MessageSquare className="w-6 h-6 text-slate-400 dark:text-slate-500" />
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                No conversations yet
              </p>
              <p className="text-xs text-slate-400 mb-4">
                Start chatting with your documents
              </p>
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv._id}
                onClick={() => handleLoadConversation(conv)}
                className="group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <MessageSquare className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-sm text-slate-600 dark:text-slate-300 truncate">
                    {conv.title || "Untitled"}
                  </span>
                </div>
                <button
                  onClick={(e) => handleDeleteConversation(e, conv._id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-400 transition-all shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Dashboard */}
      <NavLink
        to="/dashboard"
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-2.5 rounded-lg mb-1 transition-all ${
            isActive
              ? "bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-blue-500 font-semibold"
              : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          }`
        }
      >
        <LayoutDashboard className="w-5 h-5" />
        Dashboard
      </NavLink>

      {/* Navigation */}
      <nav className="px-3 py-2 border-t border-slate-200 dark:border-slate-800">
        <NavLink
          to="/chat"
          onClick={onClose}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2.5 rounded-lg mb-1 transition-all ${
              isActive
                ? "bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-blue-500 font-semibold"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            }`
          }
        >
          <MessageSquare className="w-5 h-5" />
          Chat
        </NavLink>

        {isAdmin && (
          <NavLink
            to="/documents"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg mb-1 transition-all ${
                isActive
                  ? "bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-blue-500 font-semibold"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              }`
            }
          >
            <Folder className="w-5 h-5" />
            Documents
          </NavLink>
        )}

        {isAdmin && (
          <NavLink
            to="/admin"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
                isActive
                  ? "bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-blue-500 font-semibold"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              }`
            }
          >
            <Settings className="w-5 h-5" />
            Admin Panel
          </NavLink>
        )}
      </nav>

      {/* User Profile */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
            {user?.name?.charAt(0) || <User className="w-4 h-4" />}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-slate-400 capitalize flex items-center gap-1">
              {isOwner ? <>Owner</> : isAdmin ? <>Admin</> : <>Member</>}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
