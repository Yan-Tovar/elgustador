import { useState, useContext } from "react";
import { Container, Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth";
import { AuthContext } from "../context/AuthContext";
import FormInput from "../components/auth/FormInput";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({
    identificacion: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.identificacion || !form.password) {
      alert("Todos los campos requeridos deben ser llenados");
      return;
    }

    try {
      const res = await loginUser(form);
      login(res.data.user, { access: res.data.access, refresh: res.data.refresh });
      alert("Login exitoso");
    } catch (err) {
      console.error(err);
      alert("Credenciales incorrectas");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>
        Iniciar Sesión
      </Typography>

      <form onSubmit={handleSubmit}>
        <FormInput
          label="Identificación"
          name="identificacion"
          value={form.identificacion}
          onChange={handleChange}
          required
        />

        <FormInput
          label="Contraseña"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Ingresar
        </Button>
      </form>

      {/* BOTÓN DE RESTABLECER CONTRASEÑA */}
      <Box textAlign="center" sx={{ mt: 3 }}>
        <Button
          variant="text"
          color="secondary"
          onClick={() => navigate("/passwordreset")}
        >
          Cambiar contraseña
        </Button>
      </Box>
    </Container>
  );
}
