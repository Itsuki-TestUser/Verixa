import { create } from "zustand";

export const useAppStore = create((set) => ({
  role: "user", // "admin" or "user"
  theme: "dark",
  filter: "All",
  documents: [],
  conversations: [],
  currentConversationId: null,
  globalSearchQuery: null,
  setFilter: (val) => set({ filter: val }),
  setGlobalSearchQuery: (query) => set({ globalSearchQuery: query }),
  setDocuments: (docs) => set({ documents: docs }),
  setConversations: (convos) => set({ conversations: convos }),
  setCurrentConversationId: (id) => set({ currentConversationId: id }),
  switchRole: () =>
    set((state) => ({ role: state.role === "admin" ? "user" : "admin" })),
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === "dark" ? "light" : "dark";
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return { theme: newTheme };
    }),
}));
