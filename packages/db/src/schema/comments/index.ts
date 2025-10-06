import { relations } from "drizzle-orm";
import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { generateCommentId } from "@kuman/shared/ids";

import { mangas } from "../mangas";
import { users } from "../users";

export const comments = pgTable("comments", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateCommentId()),
  content: text("content").notNull(),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  mangaSlug: text("manga_slug")
    .references(() => mangas.slug)
    .notNull(),
  deleted: boolean("deleted").default(false),
  parentId: text("parent_id"),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const commentsRelation = relations(comments, ({ one, many }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  manga: one(mangas, {
    fields: [comments.mangaSlug],
    references: [mangas.slug],
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
  }),
  replies: many(comments, {
    relationName: "parent",
  }),
}));
