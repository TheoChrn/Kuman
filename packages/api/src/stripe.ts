import { resolve } from "path";
import { config } from "dotenv";
import Stripe from "stripe";

config({ path: resolve(process.cwd(), ".env") });

if (!process.env.VITE_STRIPE_SECRET_KEY) {
  throw new Error("Missing Stripe key");
}

export const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY);
