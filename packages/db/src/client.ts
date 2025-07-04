


import { Pool } from "pg";
import * as schema from "./schema";
import { drizzle } from 'drizzle-orm/node-postgres';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export const db = drizzle(pool, {
  schema: schema,
  casing: "snake_case",
});