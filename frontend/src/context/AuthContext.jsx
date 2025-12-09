import { createContext, useState, useEffect } from "react";
import { clearAuthStorage, logoutBackend } from "../utils/Auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem("access"));

  useEffect(() => {
    const interval = setInterval(() => {
      const expiresAt = localStorage.getItem("access_expires");
      if (expiresAt && Date.now() > parseInt(expiresAt)) {
        logout();
      }
    }, 1000 * 60);

    return () => clearInterval(interval);
  }, []);

  const login = (userData, tokens) => {
    const now = Date.now();
    const expiresAt = now + 7 * 24 * 60 * 60 * 1000; // 7 días en ms

    setUser(userData);
    setAccessToken(tokens.access);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("access", tokens.access);
    localStorage.setItem("refresh", tokens.refresh);
    localStorage.setItem("access_expires", expiresAt); // <-- timestamp expiración
  };

  const logout = async () => {
    try {
      await logoutBackend(); 
    } finally {
      clearAuthStorage();
      setUser(null);
      setAccessToken(null);
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
