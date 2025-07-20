import { pgTable, smallint, text, varchar } from "drizzle-orm/pg-core";

import { generateChapterId } from "../../generate-ids";

export const chapters = pgTable("chapters", {
  id: text("id").primaryKey().default(generateChapterId()),
  number: smallint("number").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  pageCount: smallint("page_count").notNull(),
});
