import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { asc, eq, schema, sql } from "@kuman/db";

import { publicProcedure } from "../trpc";

export const chapterRouter = {
  rawGet: publicProcedure
    .input(z.object({ chapterNumber: z.coerce.number() }))
    .query(async ({ input, ctx }) => {
      return ctx.db.execute(
        sql`SELECT * FROM ${schema.chapters} WHERE ${schema.chapters.number} = ${input.chapterNumber}`,
      );
    }),
  get: publicProcedure
    .input(z.object({ chapterNumber: z.number() }))
    .query(async ({ input, ctx }) => {
      const { data: list } = await ctx.supabase.storage
        .from("assets")
        .list(
          `mangas/shingeki-no-kyojin/tome-1/chapter-${input.chapterNumber}`,
        );

      const images = list?.map(
        (l) =>
          `mangas/shingeki-no-kyojin/tome-1/chapter-${input.chapterNumber}/${l.name}`,
      );

      const { data } = await ctx.supabase.storage
        .from("assets")
        .createSignedUrls(images ?? [], 60)
        .then((rows) => ({
          ...rows,
          data: rows.data?.map(({ path, ...row }) => row),
        }));

      return ctx.db
        .select()
        .from(schema.chapters)
        .where(eq(schema.chapters.number, input.chapterNumber))
        .then((rows) => ({ ...rows[0], pages: data }));
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select({
        name: schema.chapters.name,
        number: schema.chapters.number,
      })
      .from(schema.chapters)
      .orderBy(asc(schema.chapters.number));
  }),
  getUrls: publicProcedure
    .input(z.object({ paths: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const results = await Promise.all(
        input.paths.map((path) =>
          ctx.supabase.storage.from("assets").createSignedUploadUrl(path),
        ),
      );

      return results.map(({ data, error }) => ({
        data,
        error: error?.message ?? null,
      }));
    }),
} satisfies TRPCRouterRecord;
