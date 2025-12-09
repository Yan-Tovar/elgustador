// src/utils/Auth.js
import axios from "axios";

// Borra tokens y redirige al login
export function clearAuthStorage() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("user");
}

// URL base desde .env
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL ;

// Cierra sesión en el backend invalidando refresh token
export async function logoutBackend() {
  const refresh = localStorage.getItem("refresh");
  const token = localStorage.getItem("access");

  if (!refresh || !token) return;

  try {
    await axios.post(
      `${API_BASE_URL}/api/usuarios/usuarios/logout/`,
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
