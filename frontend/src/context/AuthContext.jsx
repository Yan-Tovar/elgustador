import { createContext, useState, useEffect } from "react";
import { clearAuthStorage, logoutBackend } from "../utils/Auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem("access"));

  const login = (userData, tokens) => {
    setUser(userData);
    setAccessToken(tokens.access);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("access", tokens.access);
    localStorage.setItem("refresh", tokens.refresh);
  };

  const logout = async () => {
    await logoutBackend();

    clearAuthStorage(); 
    setUser(null);     
    setAccessToken(null);

    window.location.href = "/login"; 
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
