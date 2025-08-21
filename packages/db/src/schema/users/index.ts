import { pgTable, text, varchar } from "drizzle-orm/pg-core";

import { roleValues } from "../../enums";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  password: text("password").notNull(),
  role: text("role", { enum: roleValues }).notNull().default("user"),
  stripeCustomerId: text("stripe_customer_id"),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  userName: varchar("user_name", { length: 255 }).notNull(),
});
