import netlify from "@netlify/vite-plugin-tanstack-start";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@kuman/shared": path.resolve(__dirname, "../packages/shared/src"),
      "@kuman/db": path.resolve(__dirname, "../packages/db/src"),
      "@kuman/api": path.resolve(__dirname, "../packages/api/src"),
    },
  },
  envDir: path.resolve(__dirname, "../"),

  plugins: [
    tsconfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tanstackStart(),
    netlify(),
    viteReact(),
  ],
});
