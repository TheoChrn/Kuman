import type { TRPCRouterRecord } from "@trpc/server";

import { publicProcedure } from "../trpc";

export const testRouter = {
  bidon: publicProcedure.query(async () => {
    return "Réponse bidon";
  }),
  imageUrlBucketExample: publicProcedure.query(async ({ ctx }) => {
    const bucket = await ctx.supabase.storage
      .from("assets")
      .createSignedUrl("chapters/test.jpg", 60);
    return bucket.data?.signedUrl ?? null;
  }),
} satisfies TRPCRouterRecord;
