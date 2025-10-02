import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import path from "path";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import viteReact from "@vitejs/plugin-react";
import netlify from "@netlify/vite-plugin-tanstack-start";

export default defineConfig({
  server: {
    port: 3000,
  },
  optimizeDeps: {
    include: ["**/*.scss"],
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
    tanstackStart(),
    netlify(),
    viteReact(),
  ],
});
