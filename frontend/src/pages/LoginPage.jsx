import { useState, useContext } from "react";
import { Alert, Button, Box, Typography, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth";
import { AuthContext } from "../context/AuthContext";
import AuthLayout from "../components/layout/AuthLayout";

// Componentes comunes
import TitleMain from "../components/common/TitleMain";
import InputField from "../components/common/InputField";
import PrimaryButton from "../components/common/PrimaryButton";
import RegisterButton from "../components/common/RegisterButton"
import IdentificacionInput from "../components/common/IdentificacionInput";

import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({ identificacion: "", password: "" });
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.identificacion || !form.password) {
      setError("Todos los campos requeridos deben ser llenados");
      return;
    }

    try {
      const res = await loginUser(form);
      login(res.data.user, { access: res.data.access, refresh: res.data.refresh });
      setSnackbar({ open: true, message: "Login exitoso", severity: "success" });
    } catch (err) {
      console.error(err);
      setError("Credenciales incorrectas");
    }
  };

  /** Contenido del bloque izquierdo: el formulario */
  const left = (
    <>
      <TitleMain>Iniciar Sesión</TitleMain>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <form onSubmit={handleSubmit}>

        <IdentificacionInput value={form.identificacion} onChange={handleChange} />

        <InputField
          label="Contraseña"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <PrimaryButton type="submit">Continuar</PrimaryButton>
      </form>

      <Box sx={{ display: "flex", flexDirection: "column", mt: 1 }}>
        <Button
          variant="text"
          onClick={() => navigate("/passwordreset")} 
          sx={{ color: "#0e37eeff", fontWeight: 500 }}
        >
          ¿Olvidaste la contraseña?
        </Button>
      </Box>
    </>
  );

  /** Contenido del bloque derecho: información */
  const right = (
    <>
      <Typography
        variant="body2"
        textAlign="center"
        sx={{ color: "gray", mb: 2 }}
      >
        ¿ Aún no te has registrdo ?
      </Typography>
      <RegisterButton/>
      <Typography
        variant="body2"
        textAlign="center"
        sx={{ color: "gray", mb: 2 }}
      >
        Conocenos en nuestras redes sociales
      </Typography>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          mt: 2,
          justifyContent: { xs: "center", sm: "flex-start" },
        }}
      >
        <FacebookIcon sx={{ cursor: "pointer" }} />
        <InstagramIcon sx={{ cursor: "pointer" }} />
        <TwitterIcon sx={{ cursor: "pointer" }} />
      </Stack>
    </>
  );

  return (
    <AuthLayout
      showContent={true}
      snackbar={snackbar}
      setSnackbar={setSnackbar}
      left={left}
      right={right}
    />
  );
}