import { useState } from "react";
import { Box, Typography, Alert, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../components/layout/AuthLayout";
import TitleMain from "../components/common/TitleMain";
import PrimaryButton from "../components/common/PrimaryButton";
import LoginButton from "../components/common/LoginButton";
import RegisterButton from "../components/common/RegisterButton";
import EmailInput from "../components/common/EmailInput";

import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";

import { requestPasswordReset } from "../services/auth";

export default function PasswordResetRequest() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ show: false, message: "", type: "" });

    try {
      await requestPasswordReset(email);

      setAlert({
        show: true,
        message: "se envió un enlace de recuperación.",
        type: "success",
      });
    } catch (error) {
      setAlert({
        show: true,
        message: "Ocurrió un error enviando el enlace.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  /** Contenido del bloque izquierdo: formulario de recuperación */
  const left = (
    <>
      <TitleMain>Recuperar contraseña</TitleMain>

      {alert.show && (
        <Alert severity={alert.type} sx={{ mb: 2 }}>
          {alert.message}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <EmailInput
          label="Correo electrónico"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          sx={{ mb: 3 }}
        />

        {loading ? (
          <Typography color="text.secondary" textAlign="center" sx={{ mt: 2, fontWeight: "bold" }}>
            Enviando...
          </Typography>
        ) : (
          <PrimaryButton variant="contained" color="primary" type="submit" fullWidth>
            Enviar enlace
          </PrimaryButton>
        )}
      </form>
    </>
  );

  /** Contenido del bloque derecho: información adicional */
  const right = (
    <>
      <Typography
        variant="body2"
        textAlign="center"
        sx={{ color: "gray", mb: 2 }}
      >
        ¿Quieres Iniciar Sesión?
      </Typography>
      <LoginButton />
      <Typography
        variant="body2"
        textAlign="center"
        sx={{ color: "gray", mb: 2 }}
      >
        ¿Aún no te has registrado?
      </Typography>
      <RegisterButton />
      <Typography
        variant="body2"
        textAlign="center"
        sx={{ color: "gray", mb: 2 }}
      >
        Conócenos en nuestras redes sociales
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
      snackbar={{ open: false, message: "", severity: "info" }}
      setSnackbar={() => {}}
      left={left}
      right={right}
    />
  );
}
