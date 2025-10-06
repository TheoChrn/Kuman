import { config } from "dotenv";
import type { Config } from "drizzle-kit";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env") });

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
