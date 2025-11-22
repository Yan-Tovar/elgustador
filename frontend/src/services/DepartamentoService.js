// services/DepartamentoService.js
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/departamentos/";

const token = localStorage.getItem("access");

const config = {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
};

export const getDepartamentos = () => axios.get(API_URL, config);

export const createDepartamento = (data) => axios.post(API_URL, data, config);

export const updateDepartamento = (id, data) =>
  axios.put(`${API_URL}${id}/`, data, config);

export const deleteDepartamento = (id) =>
  axios.delete(`${API_URL}${id}/`, config);
