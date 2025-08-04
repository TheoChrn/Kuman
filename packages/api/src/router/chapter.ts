/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";

import { asc, eq, generateChapterId, schema } from "@kuman/db";
import { createChapter } from "@kuman/shared/validators";

import { publicProcedure } from "../trpc";

export const chapterRouter = {
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

  create: publicProcedure
    .input(createChapter)
    .mutation(async ({ ctx, input }) => {
      const { images, mangaSlug, volumeNumber, chapterNumber, ...restInput } =
        input;

      const existingChapter = await ctx.db.select().from(schema.chapters);

      const insert = await ctx.db
        .insert(schema.chapters)
        .values({
          id: generateChapterId(),
          ...restInput,
          number: chapterNumber,
        })
        .onConflictDoNothing()
        .returning({ id: schema.chapters.id })
        .then((rows) => rows[0]);

      if (!insert?.id) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Ce chapitre est déjà enregistré",
        });
      }

      const paths = input.images.map(
        (file) =>
          `mangas/${mangaSlug}/volume-${volumeNumber}/chapter-${chapterNumber}/${file.name}`,
      );

      if (input.chapterNumber === 1) {
        await Promise.all(
          images.map((image, index) =>
            ctx.supabase.storage.from("covers").upload(paths[index]!, image, {
              cacheControl: "31536000",
            }),
          ),
        );
      }

      const results = await Promise.all(
        paths.map((path) =>
          ctx.supabase.storage.from("assets").createSignedUploadUrl(path),
        ),
      );

      const hasErrors = results
        .map(({ error }) => error)
        .some((d) => d?.message);

      if (hasErrors) return;

      await Promise.all(
        images.map((image, index) =>
          ctx.supabase.storage
            .from("assets")
            .uploadToSignedUrl(
              results[index]!.data!.path,
              results[index]!.data!.token,
              image,
              {
                cacheControl: "15778800",
                upsert: false,
              },
            ),
        ),
      );
    }),
} satisfies TRPCRouterRecord;
