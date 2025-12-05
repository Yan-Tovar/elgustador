import { Card, CardContent, Typography, Box, Button, Tooltip } from "@mui/material";

export default function NotaCard({ nota, onEdit, onDelete }) {
  return (
    <Card
      sx={{
        width: 200,
        maxWidth: 200,
        minWidth: 200,
        height: "280px",           
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRadius: 3,
        boxShadow: 3,
        p: 1
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        {/* TÍTULO */}
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{
            mb: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}
        >
          <Tooltip title={nota.titulo}>
            {nota.titulo}
          </Tooltip>
        </Typography>

        {/* CONTENIDO PRIORITARIO */}
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            display: "-webkit-box",
            WebkitLineClamp: 4,  
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            mb: 2
          }}
        >
          {nota.contenido}
        </Typography>

        {/* FECHA (priorizada) */}
        <Typography variant="caption" sx={{ opacity: 0.7 }}>
          {new Date(nota.fecha_creacion).toLocaleDateString()}
        </Typography>
      </CardContent>

      {/* BOTONES */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button
          size="small"
          variant="outlined"
          color="text"
          onClick={onEdit}
        >
          Editar
        </Button>

        <Button
          size="small"
          variant="contained"
          color="error"
          onClick={onDelete}
        >
          Eliminar
        </Button>
      </Box>
    </Card>
  );
}
