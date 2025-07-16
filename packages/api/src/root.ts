import { supabase } from "./supabase";
import { createTRPCRouter, publicProcedure } from "./trpc";

export const appRouter = createTRPCRouter({
  bidon: publicProcedure.query(async () => {
    return "Réponse bidon";
  }),
  imageUrlBucketExample: publicProcedure.query(async () => {
    const bucket = await supabase.storage
      .from("assets")
      .createSignedUrl("chapters/test.jpg", 60);
    console.log(bucket);
    return bucket.data?.signedUrl ?? null;
  }),
});

export type AppRouter = typeof appRouter;
