import { normalize } from "path";
import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { getTableColumns } from "drizzle-orm";
import z from "zod/v4";

import type { PublisherFr, PublisherJp, Status, Type } from "@kuman/db/enums";
import {
  and,
  arrayContainsPartial,
  arrayOverlaps,
  eq,
  ilike,
  inArray,
  or,
  schema,
  sql,
} from "@kuman/db";
import {
  createOrUpdateSerie,
  searchParamsSchema,
} from "@kuman/shared/validators";

import { publicProcedure } from "../trpc";

export const mangaRouter = {
  create: publicProcedure
    .input(createOrUpdateSerie)
    .mutation(async ({ ctx, input }) => {
      const { cover, ...restinput } = input;
      const slug = input.slug;

      let publicUrl: string | null = null;

      if (input.cover) {
        const path = `mangas/${slug}/${input.cover.name}`;

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

  update: publicProcedure
    .input(createOrUpdateSerie)
    .mutation(async ({ ctx, input }) => {
      const { cover, ...restinput } = input;
      const slug = input.slug;

      let publicUrl: string | null = null;

      console.log(input.cover);
      if (input.cover) {
        const path = `mangas/${slug}/${input.cover.name}`;

        const { data, error } = await ctx.supabase.storage
          .from("covers")
          .upload(path, input.cover, {
            cacheControl: "31536000",
            upsert: true,
          });

        console.log("data");
        console.log(data);
        console.log("error");
        console.log(error);

        if (data) {
          publicUrl = ctx.supabase.storage
            .from("covers")
            .getPublicUrl(data.path).data.publicUrl;
        }
      }

      console.log(publicUrl);

      await ctx.db
        .update(schema.mangas)
        .set({
          ...restinput,
          status: input.status as Status,
          genres: input.genres,
          type: input.type as Type,
          publisherFr: input.publisherFr as PublisherFr,
          publisherJp: input.publisherJp as PublisherJp,
          slug,
          coverUrl: publicUrl,
        })
        .where(eq(schema.mangas.slug, slug));
    }),

  getAll: publicProcedure
    .input(
      searchParamsSchema.extend({ search: z.string().optional() }).optional(),
    )
    .query(async ({ ctx, input }) => {
      const select = {
        id: schema.mangas.id,
        slug: schema.mangas.slug,
        title: schema.mangas.title,
        genres: schema.mangas.genres,
        type: schema.mangas.type,
        status: schema.mangas.status,
        author: schema.mangas.author,
        coverUrl: schema.mangas.coverUrl,
      };

      if (!input) {
        return ctx.db.select(select).from(schema.mangas);
      }

      return ctx.db
        .select(select)
        .from(schema.mangas)
        .where(
          or(
            input.genres
              ? arrayOverlaps(schema.mangas.genres, input.genres)
              : undefined,
            input.search
              ? or(
                  ilike(
                    sql<string>`lower(unaccent(${schema.mangas.title}))`,
                    `%${normalize(input.search)}%`,
                  ),
                  ilike(
                    sql<string>`lower(unaccent(${schema.mangas.originalTitle}))`,
                    `%${normalize(input.search)}%`,
                  ),
                  ilike(
                    sql<string>`lower(unaccent(${schema.mangas.romajiTitle}))`,
                    `%${normalize(input.search)}%`,
                  ),
                  ilike(
                    sql<string>`lower(unaccent(${schema.mangas.slug}))`,
                    `%${normalize(input.search)}%`,
                  ),
                  arrayContainsPartial(
                    schema.mangas.alternativeTitles,
                    input.search,
                  ),
                )
              : undefined,
            input.types ? inArray(schema.mangas.type, input.types) : undefined,
          ),
        );
    }),

  get: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const { createdAt, updatedAt, ...baseColumns } = getTableColumns(
        schema.mangas,
      );

      let manga;

      if (ctx.session?.user?.id) {
        manga = await ctx.db
          .select({
            ...baseColumns,
            currentPage: schema.bookmarks.currentPage,
            currentChapter: schema.bookmarks.currentChapter,
          })
          .from(schema.mangas)
          .leftJoin(
            schema.bookmarks,
            eq(schema.bookmarks.userId, ctx.session.user.id),
          )
          .where(and(eq(schema.mangas.slug, input.slug)))
          .then((rows) => rows[0]);
      } else {
        manga = await ctx.db
          .select({
            ...baseColumns,
            currentPage: sql<null>`NULL`,
            currentChapter: sql<null>`NULL`,
          })
          .from(schema.mangas)
          .where(eq(schema.mangas.slug, input.slug))
          .then((rows) => rows[0]);
      }

      if (!manga) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cette série n'existe pas.",
        });
      }

      return manga;
    }),
} satisfies TRPCRouterRecord;
