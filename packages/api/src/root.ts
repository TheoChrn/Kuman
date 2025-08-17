import { authRouter } from "./router/auth";
import { chapterRouter } from "./router/chapter";
import { mangaRouter } from "./router/manga";
import { bookmarksRouter } from "./router/bookmarks";
import { volumeRouter } from "./router/volume";
import { userRouter } from "./router/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  chapters: chapterRouter,
  mangas: mangaRouter,
  volumes: volumeRouter,
  auth: authRouter,
  user: userRouter,
  bookmarks: bookmarksRouter,
});

export type AppRouter = typeof appRouter;
