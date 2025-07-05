import type { Config } from "drizzle-kit";

if (!process.env.POSTGRES_URL) {
  throw new Error("Missing POSTGRES_URL");
}

const nonPoolingUrl = process.env.POSTGRES_URL.replace(":6543", ":5432");

export default {
  dialect: "postgresql",
  out: "src/migrations",
  schema: "./src/schemas/**/*.ts",
  dbCredentials: { url: nonPoolingUrl },
  verbose: true,
  strict: true,
  casing: "snake_case",
} satisfies Config;