import React, { useState } from "react";
import { Typography, Button } from "@mui/material";
import TermsModal from "./TermsModal";
import PrivacityModal from "./PrivacityModal";

export default function BotonesTerminosPoliticas() {
  const [openTerms, setOpenTerms] = useState(false);
  const [openPrivacityTerms, setOpenPrivacityModal] = useState(false);

  const handleOpenTerms = () => setOpenTerms(true);
  const handleCloseTerms = () => setOpenTerms(false);

  const handleOpenPrivacityModal = () => setOpenPrivacityModal(true);
  const handleClosePrivacityModal = () => setOpenPrivacityModal(false);

  return (
    <>
      {/* Texto con botones */}
      <Typography
        variant="caption"
        color="text.primary"
        sx={{ mt: 4, textAlign: "center" }}
      >
        Al continuar, aceptas nuestros{" "}
        <Button
          variant="text"
          size="small"
          sx={{ textTransform: "none", p: 0, color: "orangered" }}
          onClick={handleOpenTerms}
        >
          Términos de uso
        </Button>{" "}
        y{" "}
        <Button
          variant="text"
          size="small"
          sx={{ textTransform: "none", p: 0, color: "green" }}
          onClick={handleOpenPrivacityModal}
        >
          Política de privacidad
        </Button>.
      </Typography>

      {/* Modal */}
      <TermsModal open={openTerms} handleClose={handleCloseTerms} />
      <PrivacityModal open={openPrivacityTerms} handleClose={handleClosePrivacityModal} />
    </>
  );
}
