import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import { confirmPasswordReset } from "../services/auth";

export default function PasswordResetConfirm() {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [passwords, setPasswords] = useState({
    password: "",
    password2: "",
  });

  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwords.password !== passwords.password2) {
      return setAlert({
        show: true,
        message: "Las contraseñas no coinciden",
        type: "error",
      });
    }

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
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={10}>
      <Typography variant="h5" mb={2} fontWeight="bold">
        Cambiar contraseña
      </Typography>

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

        <Button variant="contained" color="primary" type="submit" fullWidth>
          Guardar nueva contraseña
        </Button>
      </form>
    </Box>
  );
}
