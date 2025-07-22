import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import path from "path";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import viteReact from "@vitejs/plugin-react";

export default defineConfig({
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      external: ["pg", "pg-cloudflare", "cloudflare:sockets"],
    },
  },
  css: {
    modules: {
      localsConvention: "dashes",
    },
  },
  envDir: path.resolve(__dirname, "../"),
  plugins: [
    tsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tanstackStart({ target: "netlify", customViteReactPlugin: true }),
    viteReact(),
  ],
});
