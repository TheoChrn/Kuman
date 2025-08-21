import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { schema } from "@kuman/db";

import { stripe } from "../stripe";
import { protectedProcedure } from "../trpc";

const intervalValues = ["month", "year"] as const;
type IntervalValues = typeof intervalValues;
type Interval = IntervalValues[number];

const intervalsMap = {
  MONTH: "month",
  YEAR: "year",
} as const satisfies Record<string, Interval>;

const intervalPrice = {
  [intervalsMap.MONTH]: "price_1Rx8uXJ0vbs8RJyvVOts6LEQ",
  [intervalsMap.YEAR]: "price_1RxCJBJ0vbs8RJyv4TLAVZJC",
} as const satisfies Record<Interval, string>;

export const stripeRouter = {
  createStripeSession: protectedProcedure
    .input(
      z.object({
        interval: z.enum(intervalValues),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.session.user.stripeCustomerId) {
        const configuration = await stripe.billingPortal.configurations.create({
          features: {
            subscription_update: {
              enabled: true,
              default_allowed_updates: ["price"],

              products: [
                {
                  product: "prod_Ssukw9mQuaFAYh",
                  prices: [
                    intervalPrice[intervalsMap.MONTH],
                    intervalPrice[intervalsMap.YEAR],
                  ],
                },
              ],
            },
            subscription_cancel: {
              enabled: true,
            },
            payment_method_update: {
              enabled: true,
            },
          },
        });

        const portalSession = await stripe.billingPortal.sessions.create({
          customer: ctx.session.user.stripeCustomerId,
          return_url: "http://localhost:3000/profile/options/abonnement",
          configuration: configuration.id,
        });

        return portalSession.url;
      }

      const { id } = await stripe.customers.create({
        email: ctx.session.user.email,
      });

      await ctx.db.update(schema.users).set({ stripeCustomerId: id });

      const session = await stripe.checkout.sessions.create({
        customer: id,
        mode: "subscription",
        subscription_data: {
          trial_period_days: 14,
        },

        line_items: [
          {
            price: intervalPrice[input.interval],
            quantity: 1,
          },
        ],
        metadata: {
          userId: ctx.session.user.id,
          email: ctx.session.user.email,
        },
        success_url: `http://localhost:3000/profile/options/abonnement/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: "http://localhost:3000/profile/options/abonnement/cancel",
      });

      return session.url;
    }),

  retrieveCheckoutSession: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      const session = await stripe.checkout.sessions.retrieve(input.sessionId);
      return session;
    }),

  getStripeCustomer: protectedProcedure.query(async ({ ctx }) => {
    const subscriptions = await stripe.subscriptions.list({
      customer: ctx.session.user.stripeCustomerId,
      status: "all",
      expand: ["data.default_payment_method"],
    });

    const activeSubscription = subscriptions.data.find(
      (sub) => sub.status === "active",
    );

    return activeSubscription?.status;
  }),
} satisfies TRPCRouterRecord;
