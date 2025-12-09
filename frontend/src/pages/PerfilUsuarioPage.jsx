// pages/PerfilUsuarioDashboard.jsx
import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import TwoColumnInnerLayout from "../components/layout/TwoColumnInnerLayout";

import Swal from "sweetalert2";

import { fetchUsuario } from "../services/usuariosService";
import { requestPasswordReset } from "../services/auth";

import PerfilSidebar from "../components/common/perfil/PerfilSidebar";
import ModalDatosPersonales from "../components/common/perfil/modals/ModalDatosPersonales";
import ModalEmail from "../components/common/perfil/modals/ModalEmail";
import ModalTelefono from "../components/common/perfil/modals/ModalTelefono";
import ModalDireccion from "../components/common/perfil/modals/ModalDireccion";
import PqrsModal from "../components/common/PqrsModal";
import { showToast } from "../components/feedback/SweetAlert";

import { Box, Card, Typography, CircularProgress } from "@mui/material";

export default function PerfilUsuarioDashboard() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetchUsuario();
        setUsuario(res.data);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const maskEmail = (email) => {
    if (!email) return "";

    const [name, domain] = email.split("@");

    // Tomar las 4 primeras letras del nombre
    const visible = name.slice(0, 4);
    const hidden = "*".repeat(Math.max(name.length - 4, 0));

    return `${visible}${hidden}@${domain}`;
  };

  // ===============================
  //  Acción para cambiar contraseña
  // ===============================
  const handlePasswordReset = async () => {
    const confirm = await Swal.fire({
      title: "¿Seguro quieres cambiar contraseña?",
      text: "Te enviaremos un enlace a tu correo registrado.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, enviar correo",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return; 

    try {
      await requestPasswordReset(usuario.email);

      Swal.fire({
        title: "Correo enviado",
        text: "Te enviamos un enlace para restablecer tu contraseña.",
        icon: "success",
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "No se pudo enviar el correo. Intenta nuevamente.",
        icon: "error",
      });
    }
  };

  // ===============================

  if (loading)
    return (
      <DashboardLayout>
        <Box display="flex" justifyContent="center" mt={10}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <TwoColumnInnerLayout
        left={
          <>
            {/* Card informativo */}
            <Card 
              sx={{ 
                p: 3, 
                display: "flex", 
                mb: 3,
                borderRadius: "25px",
                border: "dashed gray 1px",                
              }}
            >
              <Box
                component="img"
                src="/PerfilDatosAlert.png"
                sx={{
                  width: 70,
                  height: "auto",
                  objectFit: "contain",
                  borderRadius: 2,
                  mx: 1,
                }}
              />
              <Box>
                <Typography variant="text" fontWeight="bold">
                  Seguridad de la Cuenta
                </Typography>
                <Typography variant="body2" mt={2}>
                  Tu información está protegida. Usa los botones de la derecha para
                  gestionar tu perfil y seguridad.
                </Typography>
              </Box>
            </Card>

            <Card
              onClick={handlePasswordReset}
              sx={{ 
                p: 3, 
                display: "flex", 
                mb: 3,
                borderRadius: "25px",
                border: "dashed gray 1px", 
              }}
            >
              <Box
                component="img"
                src="/CambiarContraseña.png"
                sx={{
                  width: 70,
                  height: "auto",
                  objectFit: "contain",
                  borderRadius: 2,
                  mx: 1,
                }}
              />
              <Box>
                <Typography variant="text" fontWeight="bold">
                  Cambiar contraseña
                </Typography>
                <Typography variant="body2" mt={1}>
                  Haz clic para enviar un correo de restablecimiento a:
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {maskEmail(usuario.email)}
                </Typography>
              </Box>
            </Card>

            <Card 
              sx={{ 
                p: 3, 
                display: "flex", 
                mb: 3,
                borderRadius: "25px",
                border: "dashed gray 1px",                
              }}
              onClick={() => setOpenModal(true)}
            >
              <Box
                component="img"
                src="/pqrs.png"
                sx={{
                  width: 70,
                  height: "auto",
                  objectFit: "contain",
                  borderRadius: 2,
                  mx: 1,
                }}
              />
              <Box>
                <Typography variant="text" fontWeight="bold">
                  Enviar un PQRS
                </Typography>
                <Typography variant="body2" mt={2}>
                  ¡Escribe aquello que quieres!
                  Tu información está protegida.
                </Typography>

                <PqrsModal
                  open={openModal}
                  onClose={() => setOpenModal(false)}
                  onSuccess={() => {
                    setOpenModal(false);             // Cierra el modal
                    showToast("PQRS enviado correctamente", "success"); // Muestra toast
                  }}
                />

              </Box>
            </Card>
          </>
        }
        right={<PerfilSidebar usuario={usuario} onOpenModal={setModal} />}
      />

      {/* ========= MODALES ========= */}
      {modal === "datos" && (
        <ModalDatosPersonales
          open
          onClose={() => setModal(null)}
          usuario={usuario}
          setUsuario={setUsuario}
        />
      )}

      {modal === "email" && (
        <ModalEmail
          open
          onClose={() => setModal(null)}
          usuario={usuario}
          setUsuario={setUsuario}
        />
      )}

      {modal === "telefono" && (
        <ModalTelefono
          open
          onClose={() => setModal(null)}
          usuario={usuario}
          setUsuario={setUsuario}
        />
      )}

      {modal === "direccion" && (
        <ModalDireccion
          open
          onClose={() => setModal(null)}
          usuario={usuario}
          setUsuario={setUsuario}
        />
      )}
    </DashboardLayout>
  );
}
