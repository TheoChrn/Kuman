import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia";

import { db } from "../client";
import { schema } from "../schema";

export const lucia = new Lucia(
  new DrizzlePostgreSQLAdapter(db, schema.sessions, schema.users),
  {
    sessionCookie: {
      expires: false,
      attributes: {
        secure: process.env.NODE_ENV === "production",
      },
    },
    getUserAttributes: (attributes) => {
      return {
        username: attributes.username,
        email: attributes.email,
      };
    },
  },
);

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      username: string;
      email: string;
    };
  }
}
