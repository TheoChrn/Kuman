import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { eq, schema } from "@kuman/db";

import { stripe } from "../stripe";
import { protectedProcedure, protectedSubscriberProcedure } from "../trpc";

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
        const subscriptions = await stripe.subscriptions.list({
          customer: ctx.session.user.stripeCustomerId,
          status: "all",
          limit: 1,
        });

        if (subscriptions.data.length > 0) {
          const portalSession = await stripe.billingPortal.sessions.create({
            customer: ctx.session.user.stripeCustomerId,
            return_url:
              "http://https://theochrn-kuman.netlify.app/profile/abonnement",
          });
          return portalSession.url;
        }

        const session = await stripe.checkout.sessions.create({
          customer: ctx.session.user.stripeCustomerId,
          mode: "subscription",
          subscription_data: { trial_period_days: 14 },
          line_items: [{ price: intervalPrice[input.interval], quantity: 1 }],
          metadata: {
            userId: ctx.session.user.id,
            email: ctx.session.user.email,
          },
          success_url: `http://https://theochrn-kuman.netlify.app/profile/abonnement/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url:
            "http://https://theochrn-kuman.netlify.app/profile/abonnement/cancel",
        });
        return session.url;
      }

      const { id } = await stripe.customers.create({
        email: ctx.session.user.email,
      });

      const session = await stripe.checkout.sessions.create({
        customer: id,
        mode: "subscription",
        subscription_data: { trial_period_days: 14 },
        line_items: [{ price: intervalPrice[input.interval], quantity: 1 }],
        metadata: {
          userId: ctx.session.user.id,
          email: ctx.session.user.email,
        },
        success_url: `https://theochrn-kuman.netlify.app/profile/abonnement/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url:
          "https://theochrn-kuman.netlify.app/profile/abonnement/cancel",
      });

      await ctx.db
        .update(schema.users)
        .set({ stripeCustomerId: id })
        .where(eq(schema.users.id, ctx.session.user.id));

      return session.url;
    }),

  retrieveCheckoutSession: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      const session = await stripe.checkout.sessions.retrieve(input.sessionId);
      return session;
    }),

  getStripeCustomer: protectedSubscriberProcedure.query(async ({ ctx }) => {
    const subscriptions = await stripe.subscriptions.list({
      customer: ctx.session.user.stripeCustomerId!,
      status: "all",
      expand: ["data.default_payment_method"],
    });

    const activeSubscription = subscriptions.data.find(
      (sub) => sub.status === "active",
    );

    return activeSubscription?.status ?? null;
  }),
} satisfies TRPCRouterRecord;
