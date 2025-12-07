// src/App.jsx
import { AuthProvider } from "./context/AuthContext";
import { CustomThemeProvider } from "./components/common/ThemeProvider";
import AppRouter from "./AppRouter";

function App() {
  return (
    <AuthProvider>
      <CustomThemeProvider>
          <AppRouter />
      </CustomThemeProvider>
    </AuthProvider>
  );
}

export default App;
