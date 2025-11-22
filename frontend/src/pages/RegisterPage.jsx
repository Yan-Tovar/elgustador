import { useState, useEffect, useContext } from "react";
import { Container, Button, MenuItem, Typography, TextField } from "@mui/material";
import { registerUser, getDepartamentos, getMunicipios } from "../api/auth";
import { AuthContext } from "../context/AuthContext";
import FormInput from "../components/auth/FormInput";

export default function RegisterPage() {
  const { login } = useContext(AuthContext);

  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [form, setForm] = useState({
    identificacion: "",
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    telefono: "",
    departamento: "",
    municipio: "",
    direccion_detallada: "",
  });

  useEffect(() => {
    async function fetchData() {
      const depRes = await getDepartamentos();
      setDepartamentos(depRes.data);
      const munRes = await getMunicipios();
      setMunicipios(munRes.data);
    }
    fetchData();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.identificacion || !form.nombre || !form.apellido || !form.email || !form.password || !form.departamento || !form.municipio) {
      alert("Todos los campos requeridos deben ser llenados");
      return;
    }

    try {
      const payload = { ...form };
      payload.departamento = parseInt(payload.departamento);
      payload.municipio = parseInt(payload.municipio);
      const res = await registerUser(payload);
      alert("Registro exitoso");
      // Opcional: hacer login automático si tu backend devuelve tokens
      if(res.data.access && res.data.refresh){
        login(res.data.user, { access: res.data.access, refresh: res.data.refresh });
      }
    } catch (err) {
      console.error(err);
      alert("Error en el registro");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>Registro de Usuario</Typography>
      <form onSubmit={handleSubmit}>
        <FormInput label="Identificación" name="identificacion" value={form.identificacion} onChange={handleChange} required />
        <FormInput label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} required />
        <FormInput label="Apellido" name="apellido" value={form.apellido} onChange={handleChange} required />
        <FormInput label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
        <FormInput label="Contraseña" name="password" type="password" value={form.password} onChange={handleChange} required />
        <FormInput label="Teléfono" name="telefono" value={form.telefono} onChange={handleChange} />
        <FormInput label="Dirección" name="direccion_detallada" value={form.direccion_detallada} onChange={handleChange} />
        
        <TextField
          select
          fullWidth
          label="Departamento"
          name="departamento"
          value={form.departamento}
          onChange={handleChange}
          required
          margin="normal"
        >
          {departamentos.map(dep => <MenuItem key={dep.id} value={dep.id}>{dep.nombre}</MenuItem>)}
        </TextField>

        <TextField
          select
          fullWidth
          label="Municipio"
          name="municipio"
          value={form.municipio}
          onChange={handleChange}
          required
          margin="normal"
        >
          {municipios.filter(m => m.departamento.id === parseInt(form.departamento)).map(mun => (
            <MenuItem key={mun.id} value={mun.id}>{mun.nombre}</MenuItem>
          ))}
        </TextField>

        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Registrarse</Button>
      </form>
    </Container>
  );
}
