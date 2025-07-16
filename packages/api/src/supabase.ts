import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: resolve(__dirname, "../../../.env") });

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE) {
  throw new Error("Missing POSTGRES_URL");
}

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE,
);
