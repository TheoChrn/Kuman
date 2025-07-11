import { createTRPCRouter, publicProcedure } from "./trpc";

export const appRouter = createTRPCRouter({
  bidon: publicProcedure.query(() => {
    return "Réponse bidon";
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
