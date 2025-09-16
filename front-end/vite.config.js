import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Puerto en desarrollo
  },
  preview: {
    port: 8080, // 👈 Railway normalmente expone el front en 8080
    host: true, // Acepta conexiones externas
    allowedHosts: [
      "triumphant-adaptation-production.up.railway.app", // 👈 añade tu dominio de Railway
    ],
  },
});
