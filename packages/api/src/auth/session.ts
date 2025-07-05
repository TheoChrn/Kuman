import { db, generateUserId, schema } from "@kuman/db";

import { lucia } from "./lucia";

async function createUser({
  userId,
  userInfo,
}: {
  userId: string;
  userInfo: {
    firstName?: string;
    lastName?: string;
    userName?: string;
    email: string;
    password: string;
  };
}) {
  await db.insert(schema.users).values({
    id: userId,
    userName: userInfo.userName,
    firstName: userInfo.firstName,
    lastName: userInfo.lastName,
    email: userInfo.email,
    password: userInfo.password,
  });

  return { userId };
}

export async function createSession({
  userInfo,
}: {
  userInfo: {
    firstName?: string;
    lastName?: string;
    userName?: string;
    email: string;
    password: string;
  };
}) {
  const existingUserByEmail = await db.query.users.findFirst({
    columns: {
      id: true,
    },
    where: (user, { eq }) => eq(user.email, userInfo.email),
  });

  if (!existingUserByEmail) {
    const userId = generateUserId();

    await createUser({
      userId,
      userInfo,
    });

    return {
      session: await lucia.createSession(userId, {}),
    };
  }

  return {
    session: await lucia.createSession(existingUserByEmail.id, {}),
  };
}

export async function validateSessionCookies(headers: Headers) {
  const sessionId = lucia.readSessionCookie(headers.get("Cookie") ?? "");

  if (!sessionId) return null;

  const { user, session } = await lucia.validateSession(sessionId);

  if (!session) {
    const sessionCookie = lucia.createBlankSessionCookie();
    headers.append("Set-Cookie", sessionCookie.serialize());
  }

  if (session?.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id);
    headers.append("Set-Cookie", sessionCookie.serialize());
  }

  return {
    user,
    sessionId: sessionId,
  };
}

export type Session = Awaited<ReturnType<typeof validateSessionCookies>>;

export async function validateBearerTokens(bearerToken: string) {
  const sessionId = lucia.readBearerToken(bearerToken);
  if (!sessionId) return null;
  const { user } = await lucia.validateSession(sessionId);

  return {
    sessionId: sessionId,
    user,
  };
}
