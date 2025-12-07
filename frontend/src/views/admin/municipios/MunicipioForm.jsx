// components/municipios/MunicipioForm.jsx
import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  MenuItem,
} from "@mui/material";

import { getDepartamentos } from "../../../services/DepartamentoService";

export default function MunicipioForm({ initialData, onSubmit }) {
  const [nombre, setNombre] = useState("");
  const [estado, setEstado] = useState(true);
  const [costo_envio, setCostoEnvio] = useState("");
  const [departamento_id, setDepartamentoId] = useState("");
  const [departamentos, setDepartamentos] = useState([]);

  // Cargar departamentos
  useEffect(() => {
    const load = async () => {
      const res = await getDepartamentos();
      setDepartamentos(res.data);
    };
    load();
  }, []);

  // Cargar datos en edición
  useEffect(() => {
    if (initialData) {
      setNombre(initialData.nombre || "");
      setEstado(initialData.estado ?? true);
      setCostoEnvio(initialData.costo_envio ?? "");
      setDepartamentoId(initialData.departamento?.id || "");
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      nombre,
      estado,
      costo_envio,
      departamento_id, 
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
        label="Nombre del Municipio"
        value={nombre}
        color="secondary"
        required
        onChange={(e) => setNombre(e.target.value)}
      />

      <TextField
        select
        label="Departamento"
        value={departamento_id}
        color="secondary"
        required
        onChange={(e) => setDepartamentoId(e.target.value)}
        fullWidth
      >
        {departamentos.map((d) => (
          <MenuItem key={d.id} value={d.id}>
            {d.nombre}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Costo de envío"
        type="number"
        color="secondary"
        required
        value={costo_envio}
        onChange={(e) => setCostoEnvio(e.target.value)}
      />

      <FormControlLabel
        control={<Switch color="secondary" checked={estado} onChange={(e) => setEstado(e.target.checked)} />}
        label="Activo"
        
      />

      <Button type="submit" variant="contained" sx={{ bgcolor: "#FF3C00" }}>
        Guardar
      </Button>
    </Box>
  );
}
