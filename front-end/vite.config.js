import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // para desarrollo local
  },
  preview: {
    allowedHosts: [
      "faceclone-production-a0c4.up.railway.app", // el host que Railway te dio
    ],
    port: process.env.PORT || 8080,
    host: "0.0.0.0",
  },
});
