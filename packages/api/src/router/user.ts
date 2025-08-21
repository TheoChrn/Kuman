import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { eq, schema } from "@kuman/db";
import { role, roleValues } from "@kuman/db/enums";

import { protectedProcedure, publicProcedure } from "../trpc";

export const userRouter = {
  getCurrentUser: publicProcedure.query(({ ctx }) => ctx.session?.user ?? null),
  updateRole: protectedProcedure
    .input(z.object({ role: z.enum(roleValues) }))
    .mutation(({ input, ctx }) =>
      ctx.db
        .update(schema.users)
        .set({ role: input.role })
        .where(eq(schema.users.id, ctx.session.user.id)),
    ),
} satisfies TRPCRouterRecord;
