// src/pages/FacturasPage.jsx
import { useEffect, useState, useRef, useCallback } from "react";
import { Box, Typography, CircularProgress, TextField } from "@mui/material";

import FacturaCard from "../components/common/facturas/FacturaCard";

import {
  getFacturasUsuario,
  descargarFacturaPDF,
  enviarFacturaEmail,
} from "../services/facturasService";

import DashboardLayout from "../components/layout/DashboardLayout";
import { saveAs } from "file-saver";

export default function FacturasPage() {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enviandoId, setEnviandoId] = useState(null);

  const [search, setSearch] = useState(""); // 🔎 Texto del buscador
  const [page, setPage] = useState(1); // 📄 Page para paginación
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef();

  // ======================================================
  // Cargar facturas con paginación y búsqueda
  // ======================================================
  const cargarFacturas = async (reset = false) => {
    try {
      const res = await getFacturasUsuario({
        q: search,
        page: page,
      });

      const nuevas = res.data.results || [];

      if (reset) {
        setFacturas(nuevas);
      } else {
        setFacturas((prev) => [...prev, ...nuevas]);
      }

      setHasMore(res.data.has_more);
      setLoading(false);
    } catch (err) {
      console.error("Error cargando facturas:", err);
      setLoading(false);
    }
  };

  // ======================================================
  // Scroll infinito → detectar último card
  // ======================================================
  const lastFacturaRef = useCallback(
    (node) => {
      if (loading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1); // siguiente página
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // ======================================================
  // Cargar primera página o recargar tras búsqueda
  // ======================================================
  useEffect(() => {
    setLoading(true);
    setPage(1);
    cargarFacturas(true); // reset
  }, [search]);

  // ======================================================
  // Scroll infinito: cargar más páginas
  // ======================================================
  useEffect(() => {
    if (page > 1) cargarFacturas();
  }, [page]);

  // ======================================================
  // Acciones PDF / Email
  // ======================================================
  const handleDescargar = async (id) => {
    try {
      const response = await descargarFacturaPDF(id);
      const blob = new Blob([response.data], { type: "application/pdf" });
      saveAs(blob, `factura_${id}.pdf`);
    } catch {
      alert("Hubo un error al descargar la factura.");
    }
  };

  const handleEnviarCorreo = async (id) => {
    try {
      setEnviandoId(id);
      await enviarFacturaEmail(id);
      alert("Factura enviada al correo.");
    } catch {
      alert("No se pudo enviar la factura.");
    } finally {
      setEnviandoId(null);
    }
  };

  return (
    <DashboardLayout>
      <Box p={{ xs: 2, md: 4 }}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
          Mis Facturas
        </Typography>

        {/* Buscador integrado dentro de la vista */}
        <TextField
          fullWidth
          placeholder="Buscar por número, fecha, total..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 3 }}
        />

        {/* LISTADO */}
        <Box
          mt={2}
          display="grid"
          gap={2}
          gridTemplateColumns={{
            xs: "1fr",
            sm: "1fr 1fr",
            md: "1fr 1fr 1fr",
          }}
        >
          {facturas.map((f, i) => {
            const isLast = i === facturas.length - 1;

            return (
              <div key={f.id} ref={isLast ? lastFacturaRef : null}>
                <FacturaCard
                  factura={f}
                  enviandoId={enviandoId}
                  onDescargar={() => handleDescargar(f.id)}
                  onEnviar={() => handleEnviarCorreo(f.id)}
                />
              </div>
            );
          })}
        </Box>

        {/* Loader inferior */}
        {loading && (
          <Box textAlign="center" py={3}>
            <CircularProgress />
          </Box>
        )}

        {!hasMore && !loading && (
          <Typography textAlign="center" py={2} color="gray">
            No hay más facturas
          </Typography>
        )}
      </Box>
    </DashboardLayout>
  );
}
