// src/utils/fetchWrapper.js
import { logoutBackend, clearAuthStorage } from "./Auth";

export async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem("access");

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  try {
    const res = await fetch(url, { ...options, headers });
    if (res.status === 401) {
      // Token inválido o expirado
      clearAuthStorage();
      window.location.href = "/login";
      return;
    }
    return res.json();
  } catch (err) {
    console.error("Error en fetchWithAuth:", err);
    throw err;
  }
}
