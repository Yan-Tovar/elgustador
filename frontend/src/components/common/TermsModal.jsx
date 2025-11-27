import React from "react";
import {
  Modal,
  Box,
  Typography,
  Divider,
  IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: "70%", md: "50%" }, // responsivo
  bgcolor: "white",
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
  maxHeight: "80vh", // límite de altura
  overflowY: "auto", // scroll interno
};

export default function TermsModal({ open, handleClose }) {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" sx={{ color: "orange" }}>
            Términos y Condiciones
          </Typography>
          <IconButton onClick={handleClose} size="small" sx={{ color: "grey.600" }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ my: 2, bgcolor: "green" }} />

        {/* Contenido con scroll */}
        <Typography variant="body2" sx={{ color: "grey.800", textAlign: "justify" }}>
          Bienvenido a nuestra plataforma. Al utilizar nuestros servicios, aceptas los siguientes términos:
          <br /><br />
          1. Uso responsable: Te comprometes a utilizar la aplicación de manera ética y legal.
          <br /><br />
          2. Privacidad: Respetamos tu información personal y la tratamos conforme a nuestra política de privacidad.
          <br /><br />
          3. Limitación de responsabilidad: La empresa no se hace responsable por daños derivados del mal uso de la plataforma.
          <br /><br />
          4. Cambios: Nos reservamos el derecho de actualizar estos términos en cualquier momento.
          <br /><br />
          Gracias por confiar en nosotros 💚🧡.
        </Typography>
      </Box>
    </Modal>
  );
}
