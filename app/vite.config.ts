import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import path from "path";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";

export default defineConfig({
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      external: ["pg", "pg-cloudflare", "cloudflare:sockets"],
    },
  },
  envDir: path.resolve(__dirname, "../"),
  plugins: [
    tsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tanstackStart({ target: "netlify", customViteReactPlugin: true }),
    react(),
  ],
});
