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

import {
  showAlert,
  showToast,
  showConfirm,
} from "../components/feedback/SweetAlert";

export default function FacturasPage() {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enviandoId, setEnviandoId] = useState(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef();

  // ======================================================
  // Cargar facturas con paginación y búsqueda
  // ======================================================
  const cargarFacturas = async (reset = false) => {
    try {
      const res = await getFacturasUsuario({
        q: search,
        page,
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
      showAlert("Error", "No se pudieron cargar las facturas.", "error");
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
          setPage((prev) => prev + 1);
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
    cargarFacturas(true);
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
      const res = await descargarFacturaPDF(id);
      const blob = new Blob([res.data], { type: "application/pdf" });
      saveAs(blob, `factura_${id}.pdf`);

      showToast("Factura descargada correctamente", "success");
    } catch (err) {
      console.error(err);
      showAlert("Error", "No se pudo descargar la factura.", "error");
    }
  };

  const handleEnviarCorreo = async (id) => {
    try {
      const confirmar = await showConfirm(
        "Enviar factura",
        "¿Deseas enviar esta factura a tu correo electrónico?"
      );

      if (!confirmar) return;

      setEnviandoId(id);
      await enviarFacturaEmail(id);

      showToast("Factura enviada al correo.", "success");
    } catch (err) {
      console.error(err);
      showAlert("Error", "No se pudo enviar la factura.", "error");
    } finally {
      setEnviandoId(null);
    }
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <DashboardLayout>
      <Box p={{ xs: 2, md: 4 }}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
          Mis Facturas
        </Typography>

        {/* Buscador */}
        <TextField
          fullWidth
          placeholder="Buscar por número, fecha, total..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 3 }}
        />

        {/* ===================== */}
        {/* ESTADO: SIN FACTURAS */}
        {/* ===================== */}
        {!loading && facturas.length === 0 && (
          <Box
            sx={{
              width: "100%",
              minHeight: "60vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              px: 2,
            }}
          >
            <Box
              component="img"
              src="/NoFacturas.png"
              alt="Sin facturas"
              sx={{
                width: { xs: "60%", sm: "40%", md: "250px" },
                maxWidth: "280px",
                mb: 2,
                objectFit: "contain",
              }}
            />

            <Typography
              variant="h6"
              sx={{
                color: "text.primary",
                fontWeight: 600,
                fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.5rem" },
                mb: 1,
              }}
            >
              Aún no tienes facturas
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                fontSize: { xs: "0.9rem", sm: "1rem" },
                maxWidth: "350px",
              }}
            >
              Cuando realices pagos aparecerán aquí para que puedas revisarlos.
            </Typography>
          </Box>
        )}

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

        {!hasMore && !loading && facturas.length > 0 && (
          <Typography textAlign="center" py={2} color="gray">
            No hay más facturas
          </Typography>
        )}
      </Box>
    </DashboardLayout>
  );
}
