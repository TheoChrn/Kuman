import type { TRPCRouterRecord } from "@trpc/server";
import type { User } from "lucia";
import { getCookie } from "@tanstack/react-start/server";
import { TRPCError } from "@trpc/server";
import { hash, verify } from "argon2";

import { eq, schema } from "@kuman/db";
import { role } from "@kuman/db/enums";
import { loginFormSchema, registerFormSchema } from "@kuman/shared/validators";

import { lucia } from "../auth/lucia";
import { createSession } from "../auth/session";
import { protectedProcedure, publicProcedure } from "../trpc";

export const authRouter = {
  login: publicProcedure
    .input(loginFormSchema)
    .mutation(async ({ input, ctx }) => {
      const existingUserByEmail = await ctx.db
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, input.email))
        .then((res) => res[0]);

      if (!existingUserByEmail) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "L'email ou le mot de passe est incorrect",
        });
      }
      const hashedPassword = await verify(
        existingUserByEmail.password,
        input.password,
      );

      if (!hashedPassword) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "L'email ou le mot de passe est incorrect",
        });
      }

      const { session } = await createSession({
        userId: existingUserByEmail.id,
        userInfo: {
          email: input.email,
          password: existingUserByEmail.password,
          userName: existingUserByEmail.userName,
        },
      });

      const cookie = lucia.createSessionCookie(session.id);

      ctx.resHeaders.set("Set-Cookie", cookie.serialize());

      return existingUserByEmail;
    }),

  register: publicProcedure
    .input(registerFormSchema)
    .mutation(async ({ input, ctx }) => {
      const existingUserByEmail = await ctx.db
        .select({ id: schema.users.id })
        .from(schema.users)
        .where(eq(schema.users.email, input.email))
        .then((res) => res[0]);

      if (existingUserByEmail) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Cet email est déjà utilisé",
        });
      }

      const hashedPassword = await hash(input.password);

      const { session } = await createSession({
        userInfo: {
          ...input,
          password: hashedPassword,
        },
      });

      const cookie = lucia.createSessionCookie(session.id);

      ctx.resHeaders.set("Set-Cookie", cookie.serialize());

      return {
        id: session.userId,
        email: input.email,
        role: role.USER,
        firstName: null,
        lastName: null,
        stripeCustomerId: null,
        userName: input.userName,
      } as User;
    }),

  logout: protectedProcedure.mutation(async ({ ctx }) => {
    const sessionId = getCookie(lucia.sessionCookieName);

    if (!sessionId) return;

    const { session } = await lucia.validateSession(sessionId);

    if (!session) return;

    await lucia.invalidateSession(session.id);
    const sessionCookie = lucia.createBlankSessionCookie();
    ctx.resHeaders.set("Set-Cookie", sessionCookie.serialize());
  }),
} satisfies TRPCRouterRecord;
