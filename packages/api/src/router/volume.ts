import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";

import { and, eq, schema } from "@kuman/db";
import { createOrUpdateVolume } from "@kuman/shared/validators";

import { protectedAdminProcedure, publicProcedure } from "../trpc";

export const volumeRouter = {
  create: protectedAdminProcedure
    .input(createOrUpdateVolume)
    .mutation(async ({ ctx, input }) => {
      const { cover, ...restInput } = input;

      let publicUrl: string | null = null;

      if (input.cover) {
        const path = `mangas/${input.mangaSlug}/volume-${input.volumeNumber}/${input.cover.name}`;

        const { data } = await ctx.supabase.storage
          .from("public-bucket")
          .upload(path, input.cover, {
            cacheControl: "31536000",
            upsert: true,
          });

        if (data) {
          publicUrl = ctx.supabase.storage
            .from("public-bucket")
            .getPublicUrl(data.path).data.publicUrl;
        }
      }

      const res = await ctx.db
        .insert(schema.volumes)
        .values({
          ...restInput,
          title: input.title,
          coverImageUrl: publicUrl,
        })
        .onConflictDoNothing()
        .returning({ id: schema.volumes.id })
        .then((rows) => rows[0]);

      if (!res?.id) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Ce volume est déjà enregistré",
        });
      }
    }),
  update: protectedAdminProcedure
    .input(createOrUpdateVolume)
    .mutation(async ({ ctx, input }) => {
      const { cover, ...restInput } = input;

      console.log(restInput);
      let publicUrl: string | null = null;

      if (input.cover) {
        const path = `mangas/${input.mangaSlug}/volume-${input.volumeNumber}/${input.cover.name}`;

        const { data, error } = await ctx.supabase.storage
          .from("public-bucket")
          .upload(path, input.cover, {
            cacheControl: "31536000",
            upsert: true,
          });

        console.log(error);

        if (data) {
          publicUrl = ctx.supabase.storage
            .from("public-bucket")
            .getPublicUrl(data.path).data.publicUrl;
        }
      }

      await ctx.db
        .update(schema.volumes)
        .set({
          ...restInput,
          title: input.title,
          coverImageUrl: publicUrl,
        })
        .where(
          and(
            eq(schema.volumes.mangaSlug, input.mangaSlug),
            eq(schema.volumes.volumeNumber, input.volumeNumber),
          ),
        );
    }),

  getAllBySerie: publicProcedure
    .input(z.object({ mangaSlug: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db
        .select({
          volumeNumber: schema.volumes.volumeNumber,
          id: schema.volumes.id,
        })
        .from(schema.volumes)
        .where(eq(schema.volumes.mangaSlug, input.mangaSlug))
        .then((rows) => rows.sort((a, b) => b.volumeNumber - a.volumeNumber));
    }),

  get: protectedAdminProcedure
    .input(z.object({ serieSlug: z.string(), volume: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db
        .select({
          id: schema.volumes.id,
          title: schema.volumes.title,
          volumeNumber: schema.volumes.volumeNumber,
          coverImageUrl: schema.volumes.coverImageUrl,
          chapterCount: schema.volumes.chapterCount,
          serieSlug: schema.volumes.mangaSlug,
          summary: schema.volumes.summary,
          pageCount: schema.volumes.pageCount,
          releaseDate: schema.volumes.releaseDate,
        })
        .from(schema.volumes)
        .where(
          and(
            eq(schema.volumes.mangaSlug, input.serieSlug),
            eq(schema.volumes.volumeNumber, input.volume),
          ),
        )
        .then((rows) => rows[0]!);
    }),
} satisfies TRPCRouterRecord;
