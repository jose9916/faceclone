import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: process.env.PORT || 3000,
  },
  preview: {
    host: "0.0.0.0",
    port: process.env.PORT || 3000,
    allowedHosts: ["triumphant-adaptation-production.up.railway.app"],
  },
});
