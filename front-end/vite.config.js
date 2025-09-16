import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175, // puerto para desarrollo local
  },
  preview: {
    port: process.env.PORT || 8080, // Railway asigna el puerto
    host: "0.0.0.0", // permite conexiones externas
    allowedHosts: [
      "earnest-healing-production-bb56.up.railway.app", // tu dominio de Railway
    ],
  },
});
