const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8080/api";
// Helper function to get headers with auth token if available
const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const apiService = {
  login: async (credentials) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    if (!res.ok) throw new Error("Login failed");
    return res.json();
  },

  signup: async (userData) => {
    const res = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!res.ok) throw new Error("Signup failed");
    return res.json();
  },

  forgotPassword: async (email) => {
    const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Something went wrong");
    return data;
  },

  resetPassword: async (token, newPassword) => {
    const res = await fetch(`${BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Invalid or expired token");
    return data;
  },

  uploadDocument: async (formData) => {
    const token = localStorage.getItem("token");
    const workspaceId = localStorage.getItem("activeWorkspaceId");
    const res = await fetch(`${BASE_URL}/documents`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(workspaceId && { "x-workspace-id": workspaceId }),
      },
      body: formData,
    });
    if (!res.ok) throw new Error("Upload failed");
    return res.json();
  },

  getDocuments: async () => {
    const workspaceId = localStorage.getItem("activeWorkspaceId");
    const res = await fetch(`${BASE_URL}/documents`, {
      headers: {
        ...getHeaders(),
        ...(workspaceId && { "x-workspace-id": workspaceId }),
      },
    });
    if (!res.ok) throw new Error("Failed to fetch documents");
    return res.json();
  },

  deleteDocument: async (id) => {
    const workspaceId = localStorage.getItem("activeWorkspaceId");
    const res = await fetch(`${BASE_URL}/documents/${id}`, {
      method: "DELETE",
      headers: {
        ...getHeaders(),
        ...(workspaceId && { "x-workspace-id": workspaceId }),
      },
    });
    if (!res.ok) throw new Error("Failed to delete document");
    return res.json();
  },

  sendFeedback: async (messageId, rating) => {
    const res = await fetch(`${BASE_URL}/query/feedback`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ messageId, rating }),
    });
    if (!res.ok) throw new Error("Feedback failed");
    return res.json();
  },

  getConversations: async () => {
    const res = await fetch(`${BASE_URL}/chat`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch conversations");
    return res.json();
  },

  getConversationById: async (id) => {
    const res = await fetch(`${BASE_URL}/chat/${id}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch conversation");
    return res.json();
  },

  saveConversation: async (data) => {
    const res = await fetch(`${BASE_URL}/chat`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to save conversation");
    return res.json();
  },

  deleteConversation: async (id) => {
    const res = await fetch(`${BASE_URL}/chat/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete conversation");
    return res.json();
  },
};
