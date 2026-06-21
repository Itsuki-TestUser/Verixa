import { useState, useEffect } from "react";
import { getWorkspaces, createWorkspace } from "../services/workspaceService";
import WorkspaceSettingsModal from "./WorkspaceSettingModel";
import { Check, Plus, X, Building2, Settings } from "lucide-react";
import { toast } from "./Toast";
const WorkspaceSelector = ({ onSelect }) => {
  const [workspaces, setWorkspaces] = useState([]);
  const [selected, setSelected] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [settingsWorkspaceId, setSettingsWorkspaceId] = useState(null);
  const [myRole, setMyRole] = useState("member");

  useEffect(() => {
    loadWorkspaces();
  }, []);

  const loadWorkspaces = async () => {
    try {
      const data = await getWorkspaces();
      const list = Array.isArray(data) ? data : [];
      setWorkspaces(list);
      const savedId = localStorage.getItem("activeWorkspaceId");
      const ws = savedId ? list.find((w) => w._id === savedId) : null;
      const defaultWs = list.find((w) => w.isDefault);
      const activeWs = ws || defaultWs;
      if (activeWs) {
        setSelected(activeWs._id);
        const role = activeWs.myRole || "member";
        setMyRole(role);
        localStorage.setItem("myWorkspaceRole", role);
        localStorage.setItem(
          "isWorkspaceOwner",
          activeWs.isOwner ? "true" : "false",
        );
        onSelect?.(activeWs._id);
      }
    } catch (err) {
      console.error("Failed to load workspaces:", err);
    }
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    try {
      const ws = await createWorkspace(newName);
      setWorkspaces([...workspaces, ws]);
      setSelected(ws._id);
      setMyRole("admin");
      localStorage.setItem("myWorkspaceRole", "admin");
      localStorage.setItem("isWorkspaceOwner", "true");
      onSelect?.(ws._id);
      setNewName("");
      setShowCreate(false);
      toast.success("Workspace created!");
    } catch (err) {
      toast.error(err.message || "Failed to create workspace");
    }
  };

  const handleChange = (e) => {
    const id = e.target.value;
    setSelected(id);
    const ws = workspaces.find((w) => w._id === id);
    const role = ws?.myRole || "member";
    setMyRole(role);
    localStorage.setItem("myWorkspaceRole", role);
    localStorage.setItem("isWorkspaceOwner", ws?.isOwner ? "true" : "false");
    localStorage.setItem("activeWorkspaceId", id);
    onSelect?.(id);
  };

  const activeWorkspace = workspaces.find((w) => w._id === selected);

  return (
    <div className="flex items-center gap-1.5">
      {!showCreate ? (
        <>
          <div className="relative flex-1 min-w-0">
            <select
              value={selected}
              onChange={handleChange}
              className="w-full appearance-none pl-7 pr-6 py-1.5 md:py-2 rounded-lg md:rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs md:text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer hover:border-blue-300 dark:hover:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all truncate"
            >
              {workspaces.map((ws) => (
                <option key={ws._id} value={ws._id}>
                  {ws.name} {ws.isDefault ? "· Default" : ""}
                </option>
              ))}
            </select>
            <Building2 className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 text-slate-400 pointer-events-none" />
          </div>

          {activeWorkspace &&
            !activeWorkspace.isDefault &&
            myRole === "admin" && (
              <button
                onClick={() => {
                  setSettingsWorkspaceId(activeWorkspace._id);
                  setShowSettings(true);
                }}
                className="p-1.5 md:p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0"
                title="Workspace Settings"
              >
                <Settings className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-500" />
              </button>
            )}

          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1 px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm font-medium bg-blue-600 text-white rounded-lg md:rounded-xl hover:bg-blue-700 shadow-sm transition-all shrink-0"
          >
            <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span className="hidden sm:inline">New</span>
          </button>
        </>
      ) : (
        <div className="flex items-center gap-1.5">
          <div className="relative">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              placeholder="Name..."
              autoFocus
              className="pl-7 pr-2 py-1.5 md:py-2 rounded-lg md:rounded-xl border-2 border-blue-300 dark:border-blue-600 bg-white dark:bg-slate-800 text-xs md:text-sm text-slate-700 dark:text-slate-200 outline-none w-28 md:w-40"
            />
            <Building2 className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-blue-400" />
          </div>
          <button
            onClick={handleCreate}
            disabled={!newName.trim()}
            className="p-1.5 md:p-2 rounded-lg bg-green-500 text-white hover:bg-green-600 disabled:opacity-40 transition-all"
          >
            <Check className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </button>
          <button
            onClick={() => {
              setShowCreate(false);
              setNewName("");
            }}
            className="p-1.5 md:p-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
          >
            <X className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </button>
        </div>
      )}

      {showSettings && (
        <WorkspaceSettingsModal
          workspaceId={settingsWorkspaceId}
          myRole={myRole}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
};

export default WorkspaceSelector;
