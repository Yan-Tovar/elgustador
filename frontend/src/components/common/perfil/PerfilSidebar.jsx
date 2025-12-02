// components/perfil/PerfilSidebar.jsx
import { Card, Box, Button, Typography, Divider } from "@mui/material";

export default function PerfilSidebar({ usuario, onOpenModal }) {

  const maskEmail = (email) => {
    if (!email) return "";

    const [name, domain] = email.split("@");

    const visible = name.slice(0, 4);
    const hidden = "*".repeat(Math.max(name.length - 4, 0));

    return `${visible}${hidden}@${domain}`;
  };

  return (
    <Card sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" fontWeight="bold">
        Configuración del perfil
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2">Número de teléfono</Typography>
        <Typography variant="body1">{usuario.telefono || "No definido"}</Typography>
        <Button variant="contained" color="warning" size="small" sx={{ mt: 1 }}
          onClick={() => onOpenModal("telefono")}
        >
          Editar
        </Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2">Email</Typography>
        <Typography variant="body1">{maskEmail(usuario.email)}</Typography>
        <Button variant="contained" color="warning" size="small" sx={{ mt: 1 }}
          onClick={() => onOpenModal("email")}
        >
          Editar
        </Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2">Datos personales</Typography>
        <Typography variant="body1">
          {usuario.nombre} {usuario.apellido}
        </Typography>
        <Button variant="contained" color="warning" size="small" sx={{ mt: 1 }}
          onClick={() => onOpenModal("datos")}
        >
          Editar
        </Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2">Dirección</Typography>
        <Typography variant="body1">{usuario.direccion_detallada || "No definida"}</Typography>
        <Button variant="contained" color="warning" size="small" sx={{ mt: 1 }}
          onClick={() => onOpenModal("direccion")}
        >
          Editar
        </Button>
      </Box>
    </Card>
  );
}
