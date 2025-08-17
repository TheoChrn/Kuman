import { relations } from "drizzle-orm";
import {
  pgTable,
  smallint,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

import { generateBookmarkId } from "../../generate-ids";
import { mangas } from "../mangas";
import { users } from "../users";

export const bookmarks = pgTable(
  "bookmarks",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateBookmarkId()),
    mangaSlug: text("manga_slug")
      .references(() => mangas.slug)
      .notNull(),
    userId: text("user_id")
      .references(() => users.id)
      .notNull(),
    currentPage: smallint("current_page").notNull().default(1),
    currentChapter: smallint("current_chapter").notNull().default(1),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [unique().on(table.userId, table.mangaSlug)],
);

export const bookmarksRelation = relations(bookmarks, ({ many }) => ({
  mangas: many(mangas),
  users: many(users),
}));
