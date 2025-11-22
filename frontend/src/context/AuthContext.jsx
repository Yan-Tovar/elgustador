import { createContext, useState, useEffect } from "react";

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

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
