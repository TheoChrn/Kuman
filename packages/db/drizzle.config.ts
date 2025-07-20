import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import type { Config } from "drizzle-kit";
import { config } from "dotenv";

const _filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);

config({ path: resolve(_dirname, "../../.env") });

if (!process.env.POSTGRES_URL) {
  throw new Error("Missing POSTGRES_URL");
}

const nonPoolingUrl = process.env.POSTGRES_URL.replace(":6543", ":5432");

export default {
  dialect: "postgresql",
  out: "src/migrations",
  schema: "./src/schema/**/*.ts",
  dbCredentials: { url: nonPoolingUrl },
  verbose: true,
  strict: true,
  casing: "snake_case",
} satisfies Config;
