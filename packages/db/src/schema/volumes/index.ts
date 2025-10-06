import { relations } from "drizzle-orm";
import {
  date,
  pgTable,
  smallint,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

import { generateTomeId } from "@kuman/shared/ids";

import { chapters } from "../chapters";
import { mangas } from "../mangas";

export const volumes = pgTable(
  "volumes",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateTomeId()),
    mangaSlug: text("manga_slug")
      .references(() => mangas.slug)
      .notNull(),
    volumeNumber: smallint("volume_number").notNull(),
    title: text("title"),
    releaseDate: date("release_date", { mode: "string" }).notNull(),
    pageCount: smallint("page_count"),
    chapterCount: smallint("chapter_count"),
    summary: text("summary").notNull(),
    coverImageUrl: text("cover_image_url"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [unique().on(table.mangaSlug, table.volumeNumber)],
);

export const volumesRelation = relations(volumes, ({ one, many }) => ({
  manga: one(mangas, {
    fields: [volumes.mangaSlug],
    references: [mangas.slug],
  }),
  chapters: many(chapters),
}));
