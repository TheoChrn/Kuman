import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: resolve(__dirname, "../../../.env") });

if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
  throw new Error("Missing VITE_SUPABASE_URL");
}

export function createSupabaseClient({
  admin = false,
  token,
}: { admin?: boolean; token?: string } = {}): SupabaseClient {
  if (admin) {
    return createClient(
      process.env.VITE_SUPABASE_URL!,
      process.env.VITE_SUPABASE_SERVICE_ROLE_KEY!,
    );
  }

  return createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_ANON_KEY!,
    {
      global: token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : undefined,
    },
  );
}

export type { SupabaseClient };
