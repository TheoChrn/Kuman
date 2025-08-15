import type { TRPCRouterRecord } from "@trpc/server";

import { publicProcedure } from "../trpc";

export const userRouter = {
  getCurrentUser: publicProcedure.query(({ ctx }) => ctx.session?.user?.id ?? null),
} satisfies TRPCRouterRecord;
