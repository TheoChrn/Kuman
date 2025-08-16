import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { and, eq, schema } from "@kuman/db";

import { protectedProcedure } from "../trpc";

export const bookmarksRouter = {
  getMany: protectedProcedure.query(({ ctx }) => {
    return ctx.db
      .select({
        coverUrl: schema.mangas.coverUrl,
        title: schema.mangas.title,
        genres: schema.mangas.genres,
        slug: schema.mangas.slug,
      })
      .from(schema.bookmarks)
      .leftJoin(schema.mangas, eq(schema.mangas.id, schema.bookmarks.mangaId))
      .where(eq(schema.bookmarks.userId, ctx.session.user.id));
  }),

  get: protectedProcedure
    .input(z.object({ mangaSlug: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db
        .select({
          currentChapter: schema.bookmarks.currentChapter,
          currentPage: schema.bookmarks.currentPage,
        })
        .from(schema.bookmarks)
        .leftJoin(schema.mangas, eq(schema.mangas.slug, input.mangaSlug))
        .where(eq(schema.bookmarks.userId, ctx.session.user.id))
        .then((rows) => rows[0] ?? null);
    }),

  upsert: protectedProcedure
    .input(
      z.object({
        mangaId: z.string(),
        currentChapter: z.number().positive(),
        currentPage: z.number().positive(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .insert(schema.bookmarks)
        .values({
          ...input,
          userId: ctx.session.user.id,
        })
        .onConflictDoUpdate({
          target: [schema.users.id, schema.mangas.id],
          set: {
            currentChapter: input.currentChapter,
            currentPage: input.currentPage,
          },
        });
    }),
} satisfies TRPCRouterRecord;
