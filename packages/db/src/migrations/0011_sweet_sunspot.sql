ALTER TABLE "chapters" ALTER COLUMN "id" SET DEFAULT 'chapter_01K163V36MV9Y0ZA72E44CPA23';--> statement-breakpoint
ALTER TABLE "mangas" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "mangas" ALTER COLUMN "genres" SET DATA TYPE text[] USING ARRAY[genres];