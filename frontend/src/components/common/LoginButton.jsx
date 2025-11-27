import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function LoginButton() {
  const navigate = useNavigate();

  return (
    <Button
      variant="outlined"
      onClick={() => navigate("/login")}
      sx={{
        mt: 1,
        borderColor: "#EB2A05",
        color: "#EB2A05",
        fontWeight: "bold",
        "&:hover": {
          borderColor: "#c82104",
          color: "#c82104",
          background: "rgba(235, 42, 5, 0.1)",
        },
      }}
    >
      Iniciar Sesion
    </Button>
  );
}
