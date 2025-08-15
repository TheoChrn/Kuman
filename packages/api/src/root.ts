import { authRouter } from "./router/auth";
import { chapterRouter } from "./router/chapter";
import { mangaRouter } from "./router/manga";
import { userRouter } from "./router/user";
import { volumeRouter } from "./router/volume";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  chapters: chapterRouter,
  mangas: mangaRouter,
  volumes: volumeRouter,
  auth: authRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
