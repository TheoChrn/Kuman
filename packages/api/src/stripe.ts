import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";
import Stripe from "stripe";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: resolve(__dirname, "../../../.env") });

if (!process.env.VITE_STRIPE_SECRET_KEY) {
  throw new Error("Missing Strike key");
}

export const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY);
