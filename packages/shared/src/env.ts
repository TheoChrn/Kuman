import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";
import { z } from "zod/v4";

const _filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);

config({ path: resolve(process.cwd(), "../.env") });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  POSTGRES_URL: z.string().trim().min(1),
  VITE_SUPABASE_URL: z.url(),
  VITE_BASE_URL: z.url(),
  VITE_SUPABASE_ANON_KEY: z.string().trim().min(1),
  VITE_SUPABASE_SERVICE_ROLE_KEY: z.string().trim().min(1),
  VITE_STRIPE_SECRET_KEY: z.string().trim().min(1),
});

export const env = envSchema.parse(process.env);

export type Env = typeof env;
