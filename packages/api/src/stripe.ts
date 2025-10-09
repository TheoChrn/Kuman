import Stripe from "stripe";

import { env } from "@kuman/shared/env";

export const stripe = new Stripe(env.VITE_STRIPE_SECRET_KEY);
