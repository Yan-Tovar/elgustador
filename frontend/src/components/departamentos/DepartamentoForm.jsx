// components/departamentos/DepartamentoForm.jsx
import { useState, useEffect } from "react";
import { Box, TextField, Button, Stack } from "@mui/material";

export default function DepartamentoForm({ onSubmit, initialData }) {
  const [form, setForm] = useState({
    nombre: "",
    estado: true,
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Stack spacing={2}>
        <TextField
          label="Nombre del Departamento"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          fullWidth
          required
        />

        <TextField
          label="Estado (true/false)"
          name="estado"
          value={form.estado}
          onChange={handleChange}
          fullWidth
        />

        <Button variant="contained" type="submit" color="primary">
          Guardar
        </Button>
      </Stack>
    </Box>
  );
}
