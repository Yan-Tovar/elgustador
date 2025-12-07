// src/utils/Auth.js
import axios from "axios";

// Borra tokens y redirige al login
export function clearAuthStorage() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("user");
}

// Cierra sesión en el backend invalidando refresh token
export async function logoutBackend() {
  const refresh = localStorage.getItem("refresh");
  const token = localStorage.getItem("access");

  try {
    await axios.post(
      "http://127.0.0.1:8000/api/usuarios/usuarios/logout/",
      { refresh },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (err) {
    console.error("Error al cerrar sesión en backend:", err);
  } finally {
    clearAuthStorage();
    window.location.href = "/login";
  }
}
