import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia";

import type { Role } from "@kuman/db/enums";
import { schema } from "@kuman/db";
import { db } from "@kuman/db/client";

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
        userName: attributes.userName,
        firstName: attributes.firstName,
        lastName: attributes.lastName,
        email: attributes.email,
        role: attributes.role,
        stripeCustomerId: attributes.stripeCustomerId,
      };
    },
  },
);

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      userName: string;
      firstName: string;
      lastName: string;
      email: string;
      role: Role;
      stripeCustomerId: string;
    };
  }
}
