import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  MessageSquare,
  Upload,
  Activity,
  Zap,
} from "lucide-react";

const Analytics = ({ workspaceId }) => {
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  const API_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    if (workspaceId) loadUsage();
  }, [workspaceId, days]);

  const loadUsage = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/workspaces/${workspaceId}/usage?days=${days}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        },
      );
      if (res.ok) {
        const data = await res.json();
        setUsage(data);
      }
    } catch (err) {
      console.error("Failed to load usage:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!workspaceId) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-500" />
          Workspace Analytics
        </h3>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 outline-none cursor-pointer"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
      ) : usage ? (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                icon: MessageSquare,
                label: "Total Queries",
                value: usage.totalQueries,
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: Upload,
                label: "Total Uploads",
                value: usage.totalUploads,
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: Zap,
                label: "Tokens Used",
                value: usage.totalTokens.toLocaleString(),
                color: "from-amber-500 to-orange-500",
              },
              {
                icon: Activity,
                label: "Storage",
                value: usage.totalStorage,
                color: "from-green-500 to-emerald-500",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm"
              >
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}
                >
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Progress Bars */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <h4 className="font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              Usage Breakdown
            </h4>
            <div className="space-y-4">
              {usage.breakdown.map((item) => {
                const maxQueries = Math.max(
                  ...usage.breakdown.map((b) => b.count),
                  1,
                );
                const percentage = (item.count / maxQueries) * 100;
                return (
                  <div key={item._id}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-300 capitalize flex items-center gap-2">
                        {item._id === "query" && (
                          <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                        )}
                        {item._id === "upload" && (
                          <Upload className="w-3.5 h-3.5 text-purple-500" />
                        )}
                        {item._id.replace(/_/g, " ")}
                      </span>
                      <span className="text-sm text-slate-500">
                        {item.count}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          item._id === "query" ? "bg-blue-500" : "bg-purple-500"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <BarChart3 className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-500">
            No analytics data available yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default Analytics;
