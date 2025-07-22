import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: resolve(__dirname, "../../../.env") });

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  throw new Error("Missing SUPABASE_URL");
}

export function createSupabaseClient(token?: string): SupabaseClient {
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      global: { headers },
    },
  );
}

export type CreateSupabaseClient = typeof createSupabaseClient;
export type { SupabaseClient };
