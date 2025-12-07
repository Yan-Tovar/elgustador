import { Box, Drawer, IconButton, Typography, Divider, useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import useNotificaciones from "../../hooks/useNotificaciones";
import NotificationItem from "./NotificationItem";

export default function NotificationsDrawer({ open, onClose }) {
  const theme = useTheme();
  const { notificaciones, marcarNotificacionLeida } = useNotificaciones();

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        [`& .MuiDrawer-paper`]: {
          width: { xs: "85%", sm: "60%", md: 360 },
          background: theme.palette.background.default,
          borderTopLeftRadius: 18,
          borderBottomLeftRadius: 18,
          boxShadow: "-4px 0px 12px rgba(0,0,0,0.08)",
        },
        "& .MuiBackdrop-root": {
          backgroundColor: "rgba(0,0,0,0.2)",
        },
      }}
    >
      {/* HEADER */}
      <Box sx={{ display: "flex", alignItems: "center", px: 2, py: 2, justifyContent: "space-between" }}>
        <Typography variant="h6" fontWeight="600">Notificaciones</Typography>
        <IconButton onClick={onClose}><CloseIcon /></IconButton>
      </Box>
      <Divider />

      {/* LISTA */}
      <Box sx={{ px: 2, py: 2, overflowY: "auto", height: "100%" }}>
        {notificaciones.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 6, opacity: 0.6 }}>
            <NotificationsNoneIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography>No tienes notificaciones</Typography>
          </Box>
        ) : (
          notificaciones.map((n) => (
            <NotificationItem
              key={n.id}
              noti={n}
              marcarLeida={marcarNotificacionLeida}
            />
          ))
        )}
      </Box>
    </Drawer>
  );
}
