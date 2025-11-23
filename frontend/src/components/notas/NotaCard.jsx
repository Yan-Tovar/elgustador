import { Card, CardContent, Typography, Box, Button } from "@mui/material";

export default function NotaCard({ nota, onEdit, onDelete }) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        mb: 2,
        boxShadow: 3,
        p: 1,
      }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight="bold">
          {nota.titulo}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {nota.contenido.substring(0, 150)}...
        </Typography>

        <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
          <Button variant="contained" size="small" onClick={onEdit}>
            Editar
          </Button>

          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={onDelete}
          >
            Eliminar
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
