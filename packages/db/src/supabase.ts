import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";

import { env } from "@kuman/shared/env";

export function createSupabaseClient() {
  return createClient(
    env.VITE_SUPABASE_URL,
    env.VITE_SUPABASE_SERVICE_ROLE_KEY,
  );
}

export type { SupabaseClient };
