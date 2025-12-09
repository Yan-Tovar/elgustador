// src/utils/api.js
import axios from "axios";
import { clearAuthStorage } from "../utils/Auth";
// import API_BASE_URL from "./API_BASE_URL";

// URL base desde .env
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar token en cada request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar 401 automáticamente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      clearAuthStorage(); // limpia user, access, refresh, expires

      // Evitar ciclo infinito: solo redirige si no estamos ya en login
      if (window.location.pathname !== "/catalogo") {
        window.location.href = "/catalogo";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
