import { authRouter } from "./router/auth";
import { bookmarksRouter } from "./router/bookmarks";
import { chapterRouter } from "./router/chapter";
import { mangaRouter } from "./router/manga";
import { stripeRouter } from "./router/stripe";
import { userRouter } from "./router/user";
import { volumeRouter } from "./router/volume";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  chapters: chapterRouter,
  mangas: mangaRouter,
  volumes: volumeRouter,
  auth: authRouter,
  user: userRouter,
  bookmarks: bookmarksRouter,
  stripe: stripeRouter,
});

export type AppRouter = typeof appRouter;
