import type { TRPCRouterRecord } from "@trpc/server";

import { publicProcedure } from "../trpc";

export const userRouter = {
  getCurrentUser: publicProcedure.query(({ ctx }) => ctx.session?.user ?? null),
} satisfies TRPCRouterRecord;
