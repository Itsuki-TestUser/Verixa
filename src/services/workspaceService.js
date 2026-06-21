const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8080/api";

const getToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token");

export const getWorkspaces = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/workspaces`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch workspaces");
  return data;
};

export const createWorkspace = async (name) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/workspaces`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create workspace");
  return data;
};

export const deleteWorkspace = async (id) => {
  const res = await fetch(`${API_URL}/workspaces/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
};
