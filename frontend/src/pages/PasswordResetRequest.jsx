import { useState } from "react";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import { requestPasswordReset } from "../services/auth";

export default function PasswordResetRequest() {
  const [email, setEmail] = useState("");
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await requestPasswordReset(email);

      setAlert({
        show: true,
        message: "Si el correo existe, se envió un enlace de recuperación.",
        type: "success",
      });
    } catch (error) {
      setAlert({
        show: true,
        message: "Ocurrió un error enviando el enlace.",
        type: "error",
      });
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={10}>
      <Typography variant="h5" mb={2} fontWeight="bold">
        Recuperar contraseña
      </Typography>

      {alert.show && (
        <Alert severity={alert.type} sx={{ mb: 2 }}>
          {alert.message}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Correo electrónico"
          fullWidth
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Button variant="contained" color="primary" type="submit" fullWidth>
          Enviar enlace
        </Button>
      </form>
    </Box>
  );
}
