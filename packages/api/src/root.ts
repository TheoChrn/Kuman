import { chapterRouter } from "./router/chapter";
import { mangaRouter } from "./router/manga";
import { volumeRouter } from "./router/volume";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  chapters: chapterRouter,
  mangas: mangaRouter,
  volumes: volumeRouter,
});

export type AppRouter = typeof appRouter;
