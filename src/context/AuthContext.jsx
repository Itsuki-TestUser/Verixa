import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null,
  );

  const login = (userData, token) => {
    localStorage.removeItem("myWorkspaceRole");
    localStorage.removeItem("isWorkspaceOwner");
    localStorage.removeItem("activeWorkspaceId");
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("myWorkspaceRole");
    localStorage.removeItem("isWorkspaceOwner");
    localStorage.removeItem("activeWorkspaceId");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
