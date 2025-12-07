import { useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { useSwipeable } from "react-swipeable";

export default function NotificationItem({ noti, marcarLeida }) {
  const theme = useTheme();
  const [swipePos, setSwipePos] = useState(0);
  const [isMarked, setIsMarked] = useState(noti.leido);

  const handlers = useSwipeable({
    onSwiping: (eventData) => {
      setSwipePos(Math.max(0, eventData.deltaX));
    },
    onSwiped: async (eventData) => {
      if (eventData.deltaX > 100 && !isMarked) {
        try {
          await marcarLeida(noti.id);
          setIsMarked(true);
        } catch (e) {
          console.error("Error al marcar como leída:", e);
        }
      }
      setSwipePos(0);
    },
    trackMouse: true, // permite swipe con mouse
  });

  return (
    <Box
      {...handlers}
      sx={{
        mb: 2,
        px: 2,
        py: 1.5,
        borderRadius: 3,
        backgroundColor: isMarked
          ? theme.palette.background.paper
          : `${theme.palette.secondary.main}15`, // color más suave
        boxShadow: "0px 2px 6px rgba(0,0,0,0.05)",
        borderLeft: isMarked
          ? "4px solid transparent"
          : `4px solid ${theme.palette.secondary.main}40`,
        transform: `translateX(${swipePos}px)`,
        transition: "transform 0.2s, background-color 0.3s",
        cursor: "grab",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Indicador de swipe (opcional) */}
      {swipePos > 0 && !isMarked && (
        <Box
          sx={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: swipePos,
            bgcolor: theme.palette.secondary.main,
            opacity: 0.3,
            borderRadius: "3px 0 0 3px",
          }}
        />
      )}

      <Typography
        sx={{
          fontWeight: isMarked ? 500 : 700,
          fontSize: "1rem",
          mb: 0.5,
          color: isMarked ? theme.palette.text.primary : theme.palette.text.secondary,
        }}
      >
        {noti.titulo}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
        {noti.mensaje}
      </Typography>
      <Typography variant="caption" color="text.disabled">
        {new Date(noti.fecha).toLocaleString()}
      </Typography>
    </Box>
  );
}
