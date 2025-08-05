import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import z from "zod";

import type {
  Genre,
  PublisherFr,
  PublisherJp,
  Status,
  Type,
} from "@kuman/db/enums";
import { eq, schema } from "@kuman/db";
import { toSlug } from "@kuman/shared/format";
import { createManga } from "@kuman/shared/validators";

import { publicProcedure } from "../trpc";

export const mangaRouter = {
  create: publicProcedure
    .input(createManga)
    .mutation(async ({ ctx, input }) => {
      const { cover, ...restinput } = input;
      const slug = toSlug(input.romajiTitle);
      const path = `mangas/${slug}/${input.cover.name}`;

      let publicUrl: string | null = null;

      const { data } = await ctx.supabase.storage
        .from("covers")
        .upload(path, input.cover, {
          cacheControl: "31536000",
        });

      if (data) {
        publicUrl = ctx.supabase.storage.from("covers").getPublicUrl(data.path)
          .data.publicUrl;
      }

      const res = await ctx.db
        .insert(schema.mangas)
        .values({
          ...restinput,
          status: input.status as Status,
          genres: input.genres,
          type: input.type as Type,
          publisherFr: input.publisherFr as PublisherFr,
          publisherJp: input.publisherJp as PublisherJp,
          slug,
          coverUrl: publicUrl,
        })
        .onConflictDoNothing()
        .returning({ id: schema.mangas.id })
        .then((rows) => rows[0]);

      if (!res?.id) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Ce manga existe déjà",
        });
      }
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select({
        slug: schema.mangas.slug,
        title: schema.mangas.title,
        id: schema.mangas.id,
      })
      .from(schema.mangas);
  }),
  get: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db
        .select({
          slug: schema.mangas.slug,
          title: schema.mangas.title,
          originalTitle: schema.mangas.originalTitle,
          romajiTitle: schema.mangas.romajiTitle,
          alternativeTitles: schema.mangas.alternativeTitles,
          author: schema.mangas.author,
          synopsis: schema.mangas.synopsis,
          coverUrl: schema.mangas.coverUrl,
          tomeCount: schema.mangas.tomeCount,
          status: schema.mangas.status,
          type: schema.mangas.type,
          genres: schema.mangas.genres,
          releaseDate: schema.mangas.releaseDate,
          publisherJp: schema.mangas.publisherJp,
          publisherFr: schema.mangas.publisherFr,
        })
        .from(schema.mangas)
        .where(eq(schema.mangas.slug, input.slug))
        .then((rows) => rows[0]!);
    }),
} satisfies TRPCRouterRecord;
