/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-non-null-assertion */

import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";

import { and, asc, eq, jsonAgg, schema } from "@kuman/db";
import { generateChapterId } from "@kuman/shared/ids";
import { createChapter, updateChapter } from "@kuman/shared/validators";

import {
  protectedAdminProcedure,
  protectedSubscriberProcedure,
  publicProcedure,
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
          releaseDate: schema.chapters.releaseDate,
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
        .from("public-bucket")
        .list(
          `mangas/${input.serie}/volume-${chapter.volumeNumber}/chapter-${input.chapterNumber}`,
        );

      const images = list?.map(
        (l) =>
          `mangas/${input.serie}/volume-${chapter.volumeNumber}/chapter-${input.chapterNumber}/${l.name}`,
      );

      const { data } = await ctx.supabase.storage
        .from("public-bucket")
        .createSignedUrls(images ?? [], 60)
        .then((rows) => ({
          ...rows,
          data: rows.data?.map(({ path, ...row }) => row.signedUrl),
        }));

      return { ...chapter, pages: data };
    }),

  get: protectedSubscriberProcedure
    .input(z.object({ chapterNumber: z.number(), serie: z.string() }))
    .query(async ({ input, ctx }) => {
      const chapter = await ctx.db
        .select({
          name: schema.chapters.name,
          number: schema.chapters.number,
          volumeNumber: schema.volumes.volumeNumber,
          pageCount: schema.chapters.pageCount,
          releaseDate: schema.chapters.releaseDate,
        })
        .from(schema.chapters)
        .leftJoin(schema.volumes, eq(schema.volumes.mangaSlug, input.serie))
        .where(
          and(
            eq(schema.chapters.number, input.chapterNumber),
            eq(schema.chapters.volumeId, schema.volumes.id),
          ),
        )
        .then((rows) => rows[0]!);

      const { data: list } = await ctx.supabase.storage
        .from("private")
        .list(
          `mangas/${input.serie}/volume-${chapter.volumeNumber}/chapter-${input.chapterNumber}`,
        );

      const images = list?.map(
        (l) =>
          `mangas/${input.serie}/volume-${chapter.volumeNumber}/chapter-${input.chapterNumber}/${l.name}`,
      );

      const { data } = await ctx.supabase.storage
        .from("private")
        .createSignedUrls(images ?? [], 60)
        .then((rows) => ({
          ...rows,
          data: rows.data?.map(({ path, ...row }) => row.signedUrl),
        }));

      return { ...chapter, pages: data };
    }),

  getChapterAdminProcedure: protectedAdminProcedure
    .input(z.object({ chapterNumber: z.number(), serie: z.string() }))
    .query(async ({ input, ctx }) => {
      const chapter = await ctx.db
        .select({
          id: schema.chapters.id,
          name: schema.chapters.name,
          number: schema.chapters.number,
          volumeNumber: schema.volumes.volumeNumber,
          pageCount: schema.chapters.pageCount,
          releaseDate: schema.chapters.releaseDate,
          serieSlug: schema.volumes.mangaSlug,
        })
        .from(schema.chapters)
        .leftJoin(schema.volumes, eq(schema.volumes.mangaSlug, input.serie))
        .where(
          and(
            eq(schema.chapters.number, input.chapterNumber),
            eq(schema.chapters.volumeId, schema.volumes.id),
          ),
        )
        .then((rows) => rows[0]!);

      const { data: list } = await ctx.supabase.storage
        .from("private")
        .list(
          `mangas/${input.serie}/volume-${chapter.volumeNumber}/chapter-${input.chapterNumber}`,
        );

      const images = list?.map(
        (l) =>
          `mangas/${input.serie}/volume-${chapter.volumeNumber}/chapter-${input.chapterNumber}/${l.name}`,
      );

      const { data: signedUrls } = await ctx.supabase.storage
        .from("private")
        .createSignedUrls(images ?? [], 60); // URL valides 60s

      const pages = signedUrls?.map(({ path, signedUrl }) => ({
        path,
        url: signedUrl,
        status: "existing",
        file: null,
      }));

      return { ...chapter, pages: pages ?? [] };
    }),

  getAllFromSerieGrouppedByVolume: publicProcedure
    .input(z.object({ serie: z.string() }))
    .query(async ({ ctx, input }) => {
      const res = await ctx.db
        .select({
          volumeNumber: schema.volumes.volumeNumber,
          title: schema.volumes.title,
          coverImageUrl: schema.volumes.coverImageUrl,
          summary: schema.volumes.summary,
          chapters: jsonAgg(
            {
              name: schema.chapters.name,
              number: schema.chapters.number,
              pageCount: schema.chapters.pageCount,
            },
            { orderBy: [asc(schema.chapters.number)] },
          ).as("chapters"),
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

  create: protectedAdminProcedure
    .input(createChapter)
    .mutation(async ({ ctx, input }) => {
      const { images, mangaSlug, volumeNumber, chapterNumber, ...restInput } =
        input;

      const volumeId = await ctx.db
        .select({ id: schema.volumes.id })
        .from(schema.volumes)
        .where(
          and(
            eq(schema.volumes.mangaSlug, input.mangaSlug),
            eq(schema.volumes.volumeNumber, input.volumeNumber),
          ),
        )
        .then((rows) => rows[0]?.id);

      if (!volumeId)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ce volume n'existe pas",
        });

      const insert = await ctx.db
        .insert(schema.chapters)
        .values({
          id: generateChapterId(),
          ...restInput,
          number: chapterNumber,
          volumeId: volumeId,
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

      const nonNullImages = input.images.filter((image) => image.file !== null);

      if (!nonNullImages.length) return;

      const buckets =
        input.chapterNumber === 1 ? ["public-bucket", "private"] : ["private"];

      await Promise.all(
        buckets.map(async (bucket) => {
          await Promise.all(
            nonNullImages.map((image, index) => {
              const path = `mangas/${mangaSlug}/volume-${volumeNumber}/chapter-${chapterNumber}/${image.file!.name}`;
              return ctx.supabase.storage
                .from(bucket)
                .upload(path, image.file!, {
                  cacheControl: "31536000",
                  upsert: true,
                });
            }),
          );
        }),
      );
    }),
  update: protectedAdminProcedure
    .input(updateChapter)
    .mutation(async ({ ctx, input }) => {
      const { images, mangaSlug, volumeNumber, chapterNumber, ...restInput } =
        input;

      const volumeId = await ctx.db
        .select({ id: schema.volumes.id })
        .from(schema.volumes)
        .where(
          and(
            eq(schema.volumes.mangaSlug, input.mangaSlug),
            eq(schema.volumes.volumeNumber, input.volumeNumber),
          ),
        )
        .then((rows) => rows[0]?.id);

      if (!volumeId)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ce volume n'existe pas",
        });

      console.log("toto");

      await ctx.db
        .update(schema.chapters)
        .set({
          ...restInput,
          number: chapterNumber,
          volumeId: volumeId,
        })
        .where(eq(schema.chapters.id, input.id));

      if (!input.images.length) return;

      const buckets =
        input.chapterNumber === 1 ? ["public-bucket", "private"] : ["private"];

      const imageToDelete = input.images.filter(
        (image) => image.status === "deleted" && image.path,
      );

      if (imageToDelete.length) {
        await Promise.all(
          buckets.map(async (bucket) => {
            await ctx.supabase.storage
              .from(bucket)
              .remove(imageToDelete.map((image) => image.path!));
          }),
        );
      }

      const nonNullImages = input.images.filter(
        (image) => image.file !== null && image.status === "new",
      );

      if (!nonNullImages.length) return;

      await Promise.all(
        buckets.map(async (bucket) => {
          await Promise.all(
            nonNullImages.map((image) => {
              const path = `mangas/${mangaSlug}/volume-${volumeNumber}/chapter-${chapterNumber}/${image.file!.name}`;
              return ctx.supabase.storage
                .from(bucket)
                .upload(path, image.file!, {
                  cacheControl: "31536000",
                  upsert: true,
                });
            }),
          );
        }),
      );
    }),
} satisfies TRPCRouterRecord;
