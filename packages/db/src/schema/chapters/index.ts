import { relations } from "drizzle-orm";
import {
  date,
  pgTable,
  smallint,
  text,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";

import { generateChapterId } from "../../generate-ids";
import { volumes } from "../volumes";

export const chapters = pgTable(
  "chapters",
  {
    id: text("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    number: smallint("number").notNull(),
    volumeId: text("volume_id")
      .references(() => volumes.id)
      .notNull(),
    pageCount: smallint("page_count").notNull(),
    releaseDate: date("release_date", { mode: "string" }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [unique().on(table.number, table.volumeId)],
);

export const chaptersRelations = relations(chapters, ({ one }) => ({
  volume: one(volumes, {
    fields: [chapters.volumeId],
    references: [volumes.id],
  }),
}));
