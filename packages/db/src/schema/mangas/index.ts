import { relations } from "drizzle-orm";
import {
  date,
  pgEnum,
  pgTable,
  smallint,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

import { genreValues, statusValues, typeValues } from "../../enums";
import {
  publisherFrValues,
  publisherJpValues,
} from "../../enums/mangas/publisher";
import { generateMangaId } from "../../generate-ids";
import { volumes } from "../volumes";

export const statusEnum = pgEnum("status", statusValues);
export const typeEnum = pgEnum("type", typeValues);
export const genreEnum = pgEnum("genre", genreValues);
export const publisherJp = pgEnum("publisher_jp", publisherJpValues);
export const publisherFr = pgEnum("publisher_fr", publisherFrValues);

export const mangas = pgTable(
  "mangas",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateMangaId()),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    originalTitle: text("original_title").notNull(),
    romajiTitle: text("romaji_title").notNull(),
    alternativeTitles: text("alternative_titles").array(),
    author: text("author").notNull(),
    synopsis: text("synopsis").notNull(),
    coverUrl: text("cover_url"),
    tomeCount: smallint("tome_count").notNull(),
    status: text("status", { enum: statusValues }).notNull(),
    type: text("type", { enum: typeValues }).notNull(),
    genres: text("genres", { enum: genreValues }).array().notNull(),
    releaseDate: date("release_date", { mode: "string" }).notNull(),
    publisherJp: text("publisher_jp", { enum: publisherJpValues }).notNull(),
    publisherFr: text("publisher_fr", { enum: publisherFrValues }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [unique().on(table.slug)],
);

export const mangasRelation = relations(mangas, ({ many }) => ({
  volumes: many(volumes),
}));
