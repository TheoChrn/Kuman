import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { schema } from "@kuman/db";

import { publicProcedure } from "../trpc";

export const mangaRouter = {
  create: publicProcedure.input(z.any()).mutation(async ({ ctx, input }) => {
    console.log("procédure");
    console.log(input);
    // await ctx.db.insert(schema.chapters).values({
    //   name: input.name,
    //   pageCount: input.chapters.length,
    //   number: 1,
    // });
  }),
} satisfies TRPCRouterRecord;
