import path from "path";
import react from "@vitejs/plugin-react-swc";
import mkcert from "vite-plugin-mkcert";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), process.env.NODE_ENV == "development" ? mkcert() : null],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    open: true,
  },
});
