import { relations } from "drizzle-orm";
import { pgTable, smallint, text, varchar } from "drizzle-orm/pg-core";

import { generateChapterId } from "../../generate-ids";
import { volumes } from "../volumes";

export const chapters = pgTable("chapters", {
  id: text("id").primaryKey().default(generateChapterId()),
  number: smallint("number").notNull(),
  volumeId: text("volume_id")
    .references(() => volumes.id)
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  pageCount: smallint("page_count").notNull(),
});

export const chaptersRelations = relations(chapters, ({ one }) => ({
  volume: one(volumes, {
    fields: [chapters.volumeId],
    references: [volumes.id],
  }),
}));
