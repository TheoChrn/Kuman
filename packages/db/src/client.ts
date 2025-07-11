import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { schema } from "./schema";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? {
          rejectUnauthorized: false,
        }
      : false,
});

export const db: NodePgDatabase<typeof schema> = drizzle(pool, {
  schema,
  casing: "snake_case",
});
