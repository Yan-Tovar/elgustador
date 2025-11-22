import { Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { logoutBackend } from "../utils/Auth";

export default function LogoutButton() {
  return (
    <Button
      variant="outlined"
      color="error"
      startIcon={<LogoutIcon />}
      onClick={logoutBackend}
    >
      Cerrar Sesión
    </Button>
  );
}
