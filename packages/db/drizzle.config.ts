import type { Config } from "drizzle-kit";

import { env } from "@kuman/shared/env";

const nonPoolingUrl = env.POSTGRES_URL;

export default {
  dialect: "postgresql",
  out: "src/migrations",
  schema: "./src/schema/**/*.ts",
  dbCredentials: { url: nonPoolingUrl },
  verbose: true,
  strict: true,
  casing: "snake_case",
} satisfies Config;
