ALTER TABLE "mangas" RENAME COLUMN "name" TO "title";--> statement-breakpoint
ALTER TABLE "mangas" RENAME COLUMN "japanese_name" TO "original_title";--> statement-breakpoint
ALTER TABLE "mangas" RENAME COLUMN "romaji_name" TO "romaji_title";--> statement-breakpoint
ALTER TABLE "mangas" RENAME COLUMN "alternative_names" TO "alternative_titles";--> statement-breakpoint
ALTER TABLE "chapters" ALTER COLUMN "id" SET DEFAULT 'chapter_01K15WQNTB16RYC74HSWJXG0PF';