import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import path from "path";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    port: 3000,
  },
  envDir: path.resolve(__dirname, "../"),
  plugins: [
    tsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tanstackStart(),
  ],
});
