import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,            // Puerto por defecto
    open: true,            // Abre el navegador automáticamente
    host: true             // Permite acceso desde redes locales
  },
  resolve: {
    alias: {
      '@': '/src'          // Atajo para importar desde src (opcional pero recomendado)
    }
  }
})
