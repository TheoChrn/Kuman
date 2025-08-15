import { db } from "@kuman/db/client";

import { generateUserId } from "../../../db/src/generate-ids";
import { schema } from "../../../db/src/schema";
import { lucia } from "./lucia";

async function createUser({
  userId,
  userInfo,
}: {
  userId: string;
  userInfo: {
    userName: string;
    email: string;
    password: string;
  };
}) {
  await db.insert(schema.users).values({
    id: userId,
    userName: userInfo.userName,
    email: userInfo.email,
    password: userInfo.password,
  });

  return { userId };
}

export async function createSession({
  userId,
  userInfo,
}: {
  userId?: string;
  userInfo: {
    userName: string;
    email: string;
    password: string;
  };
}) {
  if (!userId) {
    const generatedUserId = generateUserId();

    await createUser({
      userId: generatedUserId,
      userInfo,
    });

    return {
      session: await lucia.createSession(generatedUserId, {}),
    };
  }

  return {
    session: await lucia.createSession(userId, {}),
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

