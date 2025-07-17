import { pgTable, text, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  firstName: varchar("password", { length: 255 }),
  lastName: varchar("password", { length: 255 }),
  userName: varchar("password", { length: 255 }),
});
