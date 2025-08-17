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
        type: schema.mangas.type,
        slug: schema.mangas.slug,
        currentChapter: schema.bookmarks.currentChapter,
        currentPage: schema.bookmarks.currentPage,
      })
      .from(schema.bookmarks)
      .innerJoin(
        schema.mangas,
        eq(schema.mangas.slug, schema.bookmarks.mangaSlug),
      )
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
        mangaSlug: z.string(),
        currentChapter: z.number().positive(),
        currentPage: z.number().positive(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .insert(schema.bookmarks)
        .values({
          mangaSlug: input.mangaSlug,
          currentChapter: input.currentChapter,
          currentPage: input.currentChapter,
          userId: ctx.session.user.id,
        })
        .onConflictDoUpdate({
          target: [schema.bookmarks.userId, schema.bookmarks.mangaSlug],
          set: {
            currentChapter: input.currentChapter,
            currentPage: input.currentPage,
          },
        });
    }),

  delete: protectedProcedure
    .input(
      z.object({
        mangaSlug: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return ctx.db
        .delete(schema.bookmarks)
        .where(
          and(
            eq(schema.bookmarks.mangaSlug, input.mangaSlug),
            eq(schema.bookmarks.userId, ctx.session.user.id),
          ),
        );
    }),
} satisfies TRPCRouterRecord;
