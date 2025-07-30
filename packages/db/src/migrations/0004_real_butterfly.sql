ALTER TABLE "mangas" RENAME COLUMN "name_japanese" TO "japanese_name";--> statement-breakpoint
ALTER TABLE "mangas" RENAME COLUMN "name_romaji" TO "romaji_name";--> statement-breakpoint
ALTER TABLE "mangas" RENAME COLUMN "name_alternative" TO "alternative_names";--> statement-breakpoint
ALTER TABLE "chapters" ALTER COLUMN "id" SET DEFAULT 'chapter_01K13Q9WR6EWC6CHT4NCZJ1KCB';