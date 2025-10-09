import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { env } from "@kuman/shared/env";

import { schema } from "./schema";

const pool = new Pool({
  connectionString: env.POSTGRES_URL,
  ssl: false,
});

export const db: NodePgDatabase<typeof schema> = drizzle(pool, {
  schema,
  casing: "snake_case",
});
