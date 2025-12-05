// components/departamentos/DepartamentoForm.jsx
import { useEffect, useState } from "react";
import { Box, TextField, Button, Switch, FormControlLabel } from "@mui/material";

export default function DepartamentoForm({ initialData, onSubmit }) {
  const [nombre, setNombre] = useState("");
  const [estado, setEstado] = useState(true);

  useEffect(() => {
    if (initialData) {
      setNombre(initialData.nombre || "");
      setEstado(initialData.estado ?? true);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      nombre,
      estado,
    };

    onSubmit(data);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2, p: 1 }}
    >
      <TextField
        label="Nombre del Departamento"
        value={nombre}
        required
        onChange={(e) => setNombre(e.target.value)}
      />

      <FormControlLabel
        control={<Switch checked={estado} onChange={(e) => setEstado(e.target.checked)} />}
        label="Activo"
      />

      <Button type="submit" variant="contained" sx={{ bgcolor: "#FF3C00" }}>
        Guardar
      </Button>
    </Box>
  );
}
