// /components/common/ThemeProvider.jsx
import { createTheme, ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import { useMemo, useState, createContext, useContext } from "react";

export const ColorModeContext = createContext({
  mode: "light",
  toggleColorMode: () => {},
});

export const CustomThemeProvider = ({ children }) => {
  const [mode, setMode] = useState("light");

  const toggleColorMode = () =>
    setMode((prev) => (prev === "light" ? "dark" : "light"));

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: "#ffffff" },
          secondary: { main: "#FF3C00" },
          success: { main: "#006400" },
          info: { main: "#808080" },
          text: {
            primary: mode === "light" ? "#000000" : "#ffffff",
            secondary: "#FF3C00",
          },
          background: {
            default: mode === "light" ? "#f5f5f5" : "#121212",
            paper: mode === "light" ? "#ffffff" : "#1e1e1e",
          },
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={{ mode, toggleColorMode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ColorModeContext.Provider>
  );
};

export const useColorMode = () => useContext(ColorModeContext);
