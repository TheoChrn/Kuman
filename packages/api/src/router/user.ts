import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { hash, verify } from "argon2";
import { z } from "zod/v4";

import { eq, schema } from "@kuman/db";
import { roleValues } from "@kuman/db/enums";
import { updateUserSchema } from "@kuman/shared/validators";

import { protectedProcedure, publicProcedure } from "../trpc";

export const userRouter = {
  getCurrentUser: publicProcedure.query(({ ctx }) => {
    return ctx.session?.user ?? null;
  }),

  updateRole: protectedProcedure
    .input(z.object({ role: z.enum(roleValues) }))
    .mutation(({ input, ctx }) =>
      ctx.db
        .update(schema.users)
        .set({ role: input.role })
        .where(eq(schema.users.id, ctx.session.user.id)),
    ),

  updatePersonalData: protectedProcedure
    .input(updateUserSchema)
    .mutation(async ({ input, ctx }) => {
      const { currentPassword, password, ...restInput } = input;
      if (password && currentPassword) {
        const currentUserPassword = await ctx.db
          .select({
            password: schema.users.password,
          })
          .from(schema.users)
          .where(eq(schema.users.id, ctx.session.user.id))
          .then((res) => res[0]!.password);

        const isSamePassword = await verify(
          currentUserPassword,
          currentPassword,
        );

        if (!isSamePassword) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Le mot de passe est incorrect",
          });
        }

        const hashedPassword = await hash(password);

        return ctx.db
          .update(schema.users)
          .set({ password: hashedPassword, ...restInput })
          .where(eq(schema.users.id, ctx.session.user.id));
      }

      return ctx.db
        .update(schema.users)
        .set(restInput)
        .where(eq(schema.users.id, ctx.session.user.id));
    }),
} satisfies TRPCRouterRecord;
