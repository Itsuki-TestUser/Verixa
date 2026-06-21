import React, { useState } from "react";
import { Search, Filter, Shield, LogOut, Menu } from "lucide-react";
import { useAppStore } from "../hooks/useAppStore";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import WorkspaceSelector from "../components/WorkspaceSelector";
import { setWorkspaceId } from "../hooks/useChatStream";

const Topbar = ({ onMenuClick }) => {
  const { filter, setFilter, setGlobalSearchQuery } = useAppStore();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setGlobalSearchQuery(searchInput.trim());
      setSearchInput("");
      navigate("/chat");
    }
  };

  const handleWorkspaceChange = (id) => {
    setWorkspaceId(id);
    localStorage.setItem("activeWorkspaceId", id);
    window.dispatchEvent(new CustomEvent("workspaceChanged"));
  };

  const categories = ["All", "HR", "Finance", "Engineering"];

  return (
    <div className="h-14 md:h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 px-3 md:px-6 shadow-sm sticky top-0 z-30">
      {/* Hamburger */}
      <button
        onClick={onMenuClick}
        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden transition-colors shrink-0"
      >
        <Menu className="w-5 h-5 text-slate-600 dark:text-slate-300" />
      </button>

      {/* Search - hidden on mobile */}
      <form
        onSubmit={handleSearchSubmit}
        className="hidden sm:flex bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2 items-center w-64 md:w-80 shrink-0"
      >
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search..."
          className="bg-transparent border-none outline-none text-sm text-slate-700 dark:text-slate-200 ml-2 w-full placeholder-slate-400"
        />
      </form>

      <div className="flex-1" />

      <div className="flex items-center gap-1.5 md:gap-3">
        {/* Workspace Selector */}
        <div className="min-w-0 flex-1 md:flex-none">
          <WorkspaceSelector onSelect={handleWorkspaceChange} />
        </div>

        {/* Filter - hidden on mobile */}
        <div className="hidden md:flex items-center gap-1.5 shrink-0">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            className="text-sm bg-transparent border-none text-slate-600 dark:text-slate-300 outline-none font-medium cursor-pointer"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Role Badge - hidden on mobile */}
        <div
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border shrink-0 ${
            user?.role === "admin"
              ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800"
              : "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
          }`}
        >
          <Shield className="w-3 h-3" />
          <span className="hidden md:inline">{user?.role || "User"}</span>
        </div>

        {/* Logout */}
        {user && (
          <button
            onClick={logout}
            className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 transition-colors shrink-0"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Topbar;
