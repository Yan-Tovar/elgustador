import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Alert, Stack } from "@mui/material";

import AuthLayout from "../components/layout/AuthLayout";
import TitleMain from "../components/common/TitleMain";
import PrimaryButton from "../components/common/PrimaryButton";
import LoginButton from "../components/common/LoginButton";
import RegisterButton from "../components/common/RegisterButton";

import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";

import { confirmPasswordReset } from "../services/auth";

export default function PasswordResetConfirm() {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [passwords, setPasswords] = useState({
    password: "",
    password2: "",
  });
  const [errors, setErrors] = useState([]);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [loading, setLoading] = useState(false);

  const validatePassword = (pwd, confirmPwd) => {
    const newErrors = [];

    if (pwd.length < 8) newErrors.push("La contraseña debe tener al menos 8 caracteres.");
    if (!/[A-Z]/.test(pwd)) newErrors.push("Debe contener al menos una letra mayúscula.");
    if (!/[a-z]/.test(pwd)) newErrors.push("Debe contener al menos una letra minúscula.");
    if (!/[0-9]/.test(pwd)) newErrors.push("Debe contener al menos un número.");
    if (!/[!@#$%^&*(),.?":{}|<>_\-]/.test(pwd))
      newErrors.push("Debe contener al menos un carácter especial.");
    if (confirmPwd && pwd !== confirmPwd) newErrors.push("Las contraseñas no coinciden.");

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ show: false, message: "", type: "" });

    // Validar contraseñas antes de enviar
    const isValid = validatePassword(passwords.password, passwords.password2);
    if (!isValid) return;

    setLoading(true);

    try {
      await confirmPasswordReset({
        uid,
        token,
        password: passwords.password,
        password2: passwords.password2,
      });

      setAlert({
        show: true,
        message: "Contraseña actualizada correctamente",
        type: "success",
      });

      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setAlert({
        show: true,
        message:
          error.response?.data?.detail || "Error actualizando la contraseña.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const leftContent = (
    <Box>
      <TitleMain>Cambiar contraseña</TitleMain>

      {errors.length > 0 && (
        <Box sx={{ mb: 2 }}>
          {errors.map((err, idx) => (
            <Alert key={idx} severity="error" sx={{ mb: 1 }}>
              {err}
            </Alert>
          ))}
        </Box>
      )}

      {alert.show && (
        <Alert severity={alert.type} sx={{ mb: 2 }}>
          {alert.message}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Nueva contraseña"
          fullWidth
          type="password"
          required
          value={passwords.password}
          onChange={(e) =>
            setPasswords((prev) => ({ ...prev, password: e.target.value }))
          }
          sx={{ mb: 3 }}
        />

        <TextField
          label="Confirmar contraseña"
          fullWidth
          type="password"
          required
          value={passwords.password2}
          onChange={(e) =>
            setPasswords((prev) => ({ ...prev, password2: e.target.value }))
          }
          sx={{ mb: 3 }}
        />

        <PrimaryButton
          type="submit"
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? "Actualizando..." : "Guardar nueva contraseña"}
        </PrimaryButton>
      </form>
    </Box>
  );

  const rightContent = (
    <>
      <Typography
        variant="body2"
        textAlign="center"
        sx={{ color: "gray", mb: 2 }}
      >
        1. No compartas tu contraseña con nadie<br />
        2. Recuerda siempre tu nueva contraseña<br />
        3. Inicia sesión con tu nueva contraseña<br />
        Muchos éxitos!
      </Typography>

      <Typography
        variant="body2"
        textAlign="center"
        sx={{ color: "gray", mb: 2 }}
      >
        ¿Quieres iniciar sesión?
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
      snackbar={{ open: false, message: "", severity: "" }}
      setSnackbar={() => {}}
      left={leftContent}
      right={rightContent}
    />
  );
}
