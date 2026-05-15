import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  envDir: '../',
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/hello": "http://localhost:8080",
      "/relationships": "http://localhost:8080"
    }
  }
});
