import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import path from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import viteReact from "@vitejs/plugin-react";
import netlify from "@netlify/vite-plugin-tanstack-start";
// import { nitroV2Plugin } from "@tanstack/nitro-v2-vite-plugin";
import { cloudflare } from "@cloudflare/vite-plugin";

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
  // ssr: {
  //   noExternal: ["@kuman/shared", "@kuman/db", "@kuman/api"],
  // },
  // build: {
  //   rollupOptions: {
  //     external: ["pg", "pg-cloudflare", "cloudflare:sockets"],
  //   },
  // },
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
