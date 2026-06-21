import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FileText,
  MessageSquare,
  Users,
  TrendingUp,
  Upload,
  Plus,
  ArrowRight,
  Clock,
  Sparkles,
  Zap,
  Activity,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Analytics from "./Analytics.jsx";
import ActivityLog from "./ActivityLog.jsx";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    documents: 0,
    chats: 0,
    members: 0,
    queriesToday: 0,
  });
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [recentChats, setRecentChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const workspaceRole = localStorage.getItem("myWorkspaceRole") || "member";
  const isAdmin = user?.role === "admin" || workspaceRole === "admin";

  const API_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
  const getToken = () => localStorage.getItem("token");
  const getWorkspaceId = () => localStorage.getItem("activeWorkspaceId");

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const workspaceId = getWorkspaceId();
      const token = getToken();

      if (!token) return;

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(workspaceId && { "x-workspace-id": workspaceId }),
      };

      // Fetch documents
      try {
        const docsRes = await fetch(`${API_URL}/documents`, { headers });
        if (docsRes.ok) {
          const docs = await docsRes.json();
          const docsArray = Array.isArray(docs) ? docs : [];
          setRecentDocuments(docsArray.slice(0, 5));
          setStats((prev) => ({ ...prev, documents: docsArray.length }));
        } else if (docsRes.status === 403) {
          // Non-admin users can't access documents - that's ok
          setStats((prev) => ({ ...prev, documents: 0 }));
          setRecentDocuments([]);
        }
      } catch (e) {
        console.error("Docs fetch failed:", e);
      }

      // Fetch chats
      try {
        const chatsRes = await fetch(`${API_URL}/chat`, { headers });
        if (chatsRes.ok) {
          const chats = await chatsRes.json();
          const chatsArray = Array.isArray(chats) ? chats : [];
          setRecentChats(chatsArray.slice(0, 5));
          setStats((prev) => ({
            ...prev,
            chats: chatsArray.length,
            queriesToday: chatsArray.reduce(
              (acc, c) => acc + (c.messages?.length || 0),
              0,
            ),
          }));
        }
      } catch (e) {
        console.error("Chats fetch failed:", e);
      }

      // Fetch workspace members
      if (workspaceId) {
        try {
          const wsRes = await fetch(`${API_URL}/workspaces/${workspaceId}`, {
            headers,
          });
          if (wsRes.ok) {
            const ws = await wsRes.json();
            setStats((prev) => ({ ...prev, members: ws.members?.length || 0 }));
          }
        } catch (e) {
          console.error("Workspace fetch failed:", e);
        }
      }
    } catch (err) {
      console.error("Failed to load dashboard:", err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
    window.addEventListener("workspaceChanged", loadDashboardData);
    window.addEventListener("conversationUpdated", loadDashboardData);
    return () => {
      window.removeEventListener("workspaceChanged", loadDashboardData);
      window.removeEventListener("conversationUpdated", loadDashboardData);
    };
  }, [loadDashboardData]);

  const firstName = user?.name?.split(" ")[0] || "User";

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
            Something went wrong
          </h2>
          <p className="text-sm text-slate-500 mb-4">{error}</p>
          <button
            onClick={loadDashboardData}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto w-full h-full bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-6xl mx-auto p-6 md:p-10">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-violet-600 flex items-center justify-center text-white text-xl font-bold shadow-xl shadow-blue-500/20">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
                <Zap className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">
                Welcome back, {firstName}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                Your workspace is active and running
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/chat")}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-medium text-sm hover:opacity-90 transition-all shadow-lg shadow-slate-900/10"
          >
            <Sparkles className="w-4 h-4" />
            Ask AI
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 animate-pulse"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 mb-3" />
                <div className="h-7 w-12 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
                <div className="h-4 w-20 bg-slate-100 dark:bg-slate-700 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                {
                  icon: FileText,
                  label: "Documents",
                  value: stats.documents,
                  color: "from-blue-500 to-cyan-500",
                },
                {
                  icon: MessageSquare,
                  label: "Chats",
                  value: stats.chats,
                  color: "from-purple-500 to-pink-500",
                },
                {
                  icon: TrendingUp,
                  label: "Queries",
                  value: stats.queriesToday,
                  color: "from-green-500 to-emerald-500",
                },
                {
                  icon: Users,
                  label: "Members",
                  value: stats.members,
                  color: "from-amber-500 to-orange-500",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="group bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-slate-800 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="group bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-700 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                    <Upload className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-slate-800 dark:text-white mb-1">
                    Upload Documents
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Add knowledge to your workspace
                  </p>
                </Link>
              )}

              <button
                onClick={() => {
                  navigate("/chat");
                  setTimeout(
                    () => window.dispatchEvent(new CustomEvent("newChat")),
                    100,
                  );
                }}
                className="group bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-purple-300 dark:hover:border-purple-700 transition-all text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center mb-3 group-hover:bg-purple-100 transition-colors">
                  <Plus className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-white mb-1">
                  New Chat
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Start a conversation with AI
                </p>
              </button>

              <div className="group bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-amber-300 dark:hover:border-amber-700 transition-all text-left cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mb-3 group-hover:bg-amber-100 transition-colors">
                  <Users className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-white mb-1">
                  {stats.members} Members
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Collaborating in this workspace
                </p>
              </div>
            </div>
            {/* Recent Activity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-w-0">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm min-w-0 overflow-hidden">
                <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700">
                  <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-500" /> Recent
                    Documents
                  </h3>
                  <Link
                    to="/documents"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    View all <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="p-3 max-h-64 overflow-y-auto">
                  {recentDocuments.length === 0 ? (
                    <div className="text-center py-10">
                      <FileText className="w-7 h-7 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm font-medium text-slate-500">
                        No documents yet
                      </p>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="text-sm text-blue-600 hover:underline mt-1 inline-block"
                        >
                          Upload your first document
                        </Link>
                      )}
                    </div>
                  ) : (
                    recentDocuments.map((doc) => (
                      <div
                        key={doc._id}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                      >
                        <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4 text-blue-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                            {doc.title || doc.originalName}
                          </p>
                          <p className="text-xs text-slate-400">
                            {doc.category} ·{" "}
                            {doc.createdAt
                              ? new Date(doc.createdAt).toLocaleDateString()
                              : ""}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm min-w-0 overflow-hidden">
                <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700">
                  <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-purple-500" /> Recent
                    Chats
                  </h3>
                </div>
                <div className="p-3 max-h-64 overflow-y-auto">
                  {recentChats.length === 0 ? (
                    <div className="text-center py-10">
                      <MessageSquare className="w-7 h-7 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm font-medium text-slate-500">
                        No conversations yet
                      </p>
                      <button
                        onClick={() => {
                          navigate("/chat");
                          setTimeout(
                            () =>
                              window.dispatchEvent(new CustomEvent("newChat")),
                            100,
                          );
                        }}
                        className="text-sm text-blue-600 hover:underline mt-1"
                      >
                        Start your first chat
                      </button>
                    </div>
                  ) : (
                    recentChats.map((chat) => (
                      <div
                        key={chat._id}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                        onClick={() => {
                          navigate("/chat");
                          setTimeout(
                            () =>
                              window.dispatchEvent(
                                new CustomEvent("loadConversation", {
                                  detail: {
                                    messages: chat.messages,
                                    conversationId: chat._id,
                                  },
                                }),
                              ),
                            100,
                          );
                        }}
                      >
                        <div className="w-9 h-9 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center shrink-0">
                          <MessageSquare className="w-4 h-4 text-purple-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                            {chat.title || "Untitled"}
                          </p>
                          <p className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />{" "}
                            {chat.updatedAt
                              ? new Date(chat.updatedAt).toLocaleDateString()
                              : ""}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            {isAdmin && (
              <div className="mt-8">
                <Analytics workspaceId={getWorkspaceId()} />
              </div>
            )}
            {isAdmin && (
              <div className="mt-8">
                <ActivityLog workspaceId={getWorkspaceId()} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
