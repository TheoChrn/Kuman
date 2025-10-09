import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { and, desc, eq, schema, sql } from "@kuman/db";
import { role } from "@kuman/db/enums";

import { protectedProcedure, publicProcedure } from "../trpc";

export const commentRouter = {
  // Get tous les commentaires pour une série
  // SELECT
  //   comments.id,
  //   CASE WHEN comments.deleted = true THEN 'Ce commentaire a été supprimé' ELSE comments.content END AS content,
  //   comments.updatedAt,
  //   comments.createdAt,
  //   comments.parentId,
  //   comments.userId,
  //   comments.deleted,
  //   users.userName,
  //   users.role
  // FROM comments
  // LEFT JOIN users ON users.id = comments.userId
  // WHERE comments.mangaSlug = $1
  // ORDER BY comments.createdAt DESC;
  getAll: publicProcedure
    .input(
      z.object({
        serieSlug: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db
        .select({
          id: schema.comments.id,
          content:
            sql<string>`CASE WHEN ${schema.comments.deleted} = true THEN 'Ce commentaire a été supprimé' ELSE ${schema.comments.content} END`.as(
              "content",
            ),
          updatedAt: schema.comments.updatedAt,
          createdAt: schema.comments.createdAt,
          parentId: schema.comments.parentId,
          userId: schema.comments.userId,
          deleted: schema.comments.deleted,
          userName: schema.users.userName,
          role: schema.users.role,
        })
        .from(schema.comments)
        .leftJoin(schema.users, eq(schema.users.id, schema.comments.userId))
        .where(eq(schema.comments.mangaSlug, input.serieSlug))
        .orderBy(desc(schema.comments.createdAt))
        .then((rows) =>
          rows.map(({ userName, role, ...row }) => ({
            ...row,
            user: { userName: userName!, role: role! },
          })),
        );
    }),

  // Create un commentaire
  // INSERT INTO comments (content, mangaSlug, parentId, userId)
  // VALUES ($1, $2, $3, $4);
  create: protectedProcedure
    .input(
      z.object({
        serieSlug: z.string(),
        content: z.string(),
        parentId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(schema.comments).values({
        content: input.content,
        mangaSlug: input.serieSlug,
        parentId: input.parentId,
        userId: ctx.session.user.id,
      });
    }),

  // Update un commentaire
  // Si admin :
  // UPDATE comments
  // SET content = $1, updatedAt = CURRENT_TIMESTAMP
  // WHERE id = $2;
  // Sinon :
  // UPDATE comments
  // SET content = $1, updatedAt = CURRENT_TIMESTAMP
  // WHERE userId = $2 AND id = $3;
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        content: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role === role.ADMINISTRATOR) {
        await ctx.db
          .update(schema.comments)
          .set({
            content: input.content,
            updatedAt: new Date(),
          })
          .where(eq(schema.comments.id, input.id));
      } else {
        await ctx.db
          .update(schema.comments)
          .set({
            content: input.content,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(schema.comments.userId, ctx.session.user.id),
              eq(schema.comments.id, input.id),
            ),
          );
      }
    }),

  // Soft delete d'un commentaire
  // Si admin :
  // UPDATE comments
  // SET deleted = true
  // WHERE id = $1;
  // Sinon :
  // UPDATE comments
  // SET deleted = true
  // WHERE userId = $1 AND id = $2;
  softDelete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role === role.ADMINISTRATOR) {
        await ctx.db
          .update(schema.comments)
          .set({
            deleted: true,
          })
          .where(eq(schema.comments.id, input.id));
      } else {
        await ctx.db
          .update(schema.comments)
          .set({
            deleted: true,
          })
          .where(
            and(
              eq(schema.comments.userId, ctx.session.user.id),
              eq(schema.comments.id, input.id),
            ),
          );
      }
    }),
} satisfies TRPCRouterRecord;
