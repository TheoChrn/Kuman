/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import type { TRPCRouterRecord } from "@trpc/server";

import type {
  Genre,
  PublisherFr,
  PublisherJp,
  Status,
  Type,
} from "@kuman/db/enums";
import { schema } from "@kuman/db";
import { createManga } from "@kuman/shared/validators";

import { publicProcedure } from "../trpc";

export const mangaRouter = {
  create: publicProcedure
    .input(createManga)
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .insert(schema.mangas)
        .values({
          ...input,
          status: input.status as Status,
          genres: input.genres as Genre[],
          type: input.type as Type,
          publisherFr: input.publisherFr as PublisherFr,
          publisherJp: input.publisherJp as PublisherJp,
        })
        .onConflictDoNothing();
    }),
} satisfies TRPCRouterRecord;
