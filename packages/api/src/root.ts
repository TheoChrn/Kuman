import { chapterRouter } from "./router/chapter";
import { mangaRouter } from "./router/manga";
import { testRouter } from "./router/test";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  chapters: chapterRouter,
  test: testRouter,
  mangas: mangaRouter,
});

export type AppRouter = typeof appRouter;
