import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api";

export const registerUser = async (data) => {
  return axios.post(`${API_BASE}/auth/register/`, data);
};

export const loginUser = async (data) => {
  return axios.post(`${API_BASE}/auth/login/`, data);
};

export const getDepartamentos = async () => {
  return await axios.get(`${API_BASE}/departamentos/`);
};

export const getMunicipios = async () => {
  return await axios.get(`${API_BASE}/municipios/`);
};
