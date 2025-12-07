import { Box, useTheme } from "@mui/material";

export default function AnimacionCantidad({ tipo }) {
  const theme = useTheme();
  const color =
    tipo === "sumar"
      ? theme.palette.success.main
      : theme.palette.secondary.main;

  return (
    <>
      <style>
        {`
          @keyframes burbuja {
            0% { transform: scale(0.4) translateY(10px); opacity: 0.6; }
            50% { transform: scale(1) translateY(-6px); opacity: 1; }
            100% { transform: scale(0.4) translateY(-20px); opacity: 0; }
          }
        `}
      </style>

      <Box
        sx={{
          position: "absolute",
          right: 10,
          top: 10,
          width: 26,
          height: 26,
          borderRadius: "50%",
          backgroundColor: color,
          animation: "burbuja 0.6s ease forwards",
          opacity: 0.85,
        }}
      />
    </>
  );
}
