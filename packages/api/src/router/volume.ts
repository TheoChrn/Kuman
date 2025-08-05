import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";

import { eq, schema } from "@kuman/db";
import { createVolume } from "@kuman/shared/validators";

import { publicProcedure } from "../trpc";

export const volumeRouter = {
  create: publicProcedure
    .input(createVolume)
    .mutation(async ({ ctx, input }) => {
      const { cover, ...restInput } = input;

      let publicUrl: string | null = null;

      if (input.cover) {
        const path = `mangas/${input.mangaSlug}/volume-${input.volumeNumber}/${input.cover.name}`;

        const { data } = await ctx.supabase.storage
          .from("covers")
          .upload(path, input.cover, {
            cacheControl: "31536000",
          });

        if (data) {
          publicUrl = ctx.supabase.storage
            .from("covers")
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

  getAllBySerie: publicProcedure
    .input(z.object({ mangaSlug: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db
        .select({
          volumeNumber: schema.volumes.volumeNumber,
          id: schema.volumes.id,
        })
        .from(schema.volumes)
        .where(eq(schema.volumes.mangaSlug, input.mangaSlug));
    }),
} satisfies TRPCRouterRecord;
