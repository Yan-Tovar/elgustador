import api from "./api";

// Registro
export const registerUser = async (data) => {
  return api.post("auth/register/", data);
};

// Inicio de sesión
export const loginUser = async (data) => {
  return api.post("auth/login/", data);
};

// Listar departamentos (ahora SIEMPRE envía token)
export const getDepartamentos = async () => {
  return api.get("departamentos/");
};

// Listar municipios (también envía token automaticamente)
export const getMunicipios = async () => {
  return api.get("municipios/");
};
