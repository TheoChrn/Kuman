import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const VITE_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL!;

export const VITE_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export function createSupabaseClient(): SupabaseClient {
  return createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY);
}

export const supabase = createSupabaseClient();
