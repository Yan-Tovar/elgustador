// src/utils/auth.js
import axios from "axios";

// Función para borrar tokens en frontend y redirigir al login
export function logout() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("user");
  window.location.href = "/login"; // redirige al login
}

// Función para llamar al backend y cerrar sesión invalidando refresh token
export async function logoutBackend() {
  const refresh = localStorage.getItem("refresh");
  const token = localStorage.getItem("access");

  try {
    await axios.post(
      "http://127.0.0.1:8000/api/users/logout/",
      { refresh },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (err) {
    console.log("Error al cerrar sesión en backend:", err);
  }

  logout();
}
