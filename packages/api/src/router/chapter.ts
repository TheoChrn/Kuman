/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-non-null-assertion */

import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";

import { and, eq, generateChapterId, jsonAgg, schema } from "@kuman/db";
import { createChapter } from "@kuman/shared/validators";

import {
  protectedProcedure,
  publicProcedure,
  subscriberProtectedProcedure,
} from "../trpc";

export const chapterRouter = {
  getFreeChapter: publicProcedure
    .input(z.object({ chapterNumber: z.number(), serie: z.string() }))
    .query(async ({ input, ctx }) => {
      const chapter = await ctx.db
        .select({
          name: schema.chapters.name,
          number: schema.chapters.number,
          volumeNumber: schema.volumes.volumeNumber,
          pageCount: schema.chapters.pageCount,
        })
        .from(schema.chapters)
        .leftJoin(schema.volumes, eq(schema.volumes.mangaSlug, input.serie))
        .where(
          and(
            eq(schema.chapters.number, input.chapterNumber),
            eq(schema.chapters.volumeId, schema.volumes.id),
          ),
        )
        .then((rows) => ({ ...rows[0] }));

      const { data: list } = await ctx.supabase.storage
        .from("assets")
        .list(
          `mangas/${input.serie}/volume-${chapter.volumeNumber}/chapter-${input.chapterNumber}`,
        );

      const images = list?.map(
        (l) =>
          `mangas/${input.serie}/volume-${chapter.volumeNumber}/chapter-${input.chapterNumber}/${l.name}`,
      );

      const { data } = await ctx.supabase.storage
        .from("assets")
        .createSignedUrls(images ?? [], 60)
        .then((rows) => ({
          ...rows,
          data: rows.data?.map(({ path, ...row }) => row),
        }));

      return { ...chapter, pages: data };
    }),
  get: subscriberProtectedProcedure
    .input(z.object({ chapterNumber: z.number(), serie: z.string() }))
    .query(async ({ input, ctx }) => {
      const chapter = await ctx.db
        .select({
          name: schema.chapters.name,
          number: schema.chapters.number,
          volumeNumber: schema.volumes.volumeNumber,
          pageCount: schema.chapters.pageCount,
        })
        .from(schema.chapters)
        .leftJoin(schema.volumes, eq(schema.volumes.mangaSlug, input.serie))
        .where(
          and(
            eq(schema.chapters.number, input.chapterNumber),
            eq(schema.chapters.volumeId, schema.volumes.id),
          ),
        )
        .then((rows) => ({ ...rows[0] }));

      const { data: list } = await ctx.supabase.storage
        .from("assets")
        .list(
          `mangas/${input.serie}/volume-${chapter.volumeNumber}/chapter-${input.chapterNumber}`,
        );

      const images = list?.map(
        (l) =>
          `mangas/${input.serie}/volume-${chapter.volumeNumber}/chapter-${input.chapterNumber}/${l.name}`,
      );

      const { data } = await ctx.supabase.storage
        .from("assets")
        .createSignedUrls(images ?? [], 60)
        .then((rows) => ({
          ...rows,
          data: rows.data?.map(({ path, ...row }) => row),
        }));

      return { ...chapter, pages: data };
    }),

  getAll: publicProcedure
    .input(z.object({ serie: z.string() }))
    .query(async ({ ctx, input }) => {
      const res = await ctx.db
        .select({
          volumeNumber: schema.volumes.volumeNumber,
          title: schema.volumes.title,
          coverImageUrl: schema.volumes.coverImageUrl,
          summary: schema.volumes.summary,
          chapters: jsonAgg({
            name: schema.chapters.name,
            number: schema.chapters.number,
            pageCount: schema.chapters.pageCount,
          }).as("chapters"),
        })
        .from(schema.volumes)
        .leftJoin(
          schema.chapters,
          eq(schema.chapters.volumeId, schema.volumes.id),
        )
        .where(eq(schema.volumes.mangaSlug, input.serie))
        .groupBy(schema.volumes.id);

      return res;
    }),

  create: publicProcedure
    .input(createChapter)
    .mutation(async ({ ctx, input }) => {
      const { images, mangaSlug, volumeNumber, chapterNumber, ...restInput } =
        input;

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
