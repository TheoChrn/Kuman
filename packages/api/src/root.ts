import { chapterRouter } from "./router/chapter";
import { testRouter } from "./router/test";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  chapters: chapterRouter,
  test: testRouter,
});

export type AppRouter = typeof appRouter;
