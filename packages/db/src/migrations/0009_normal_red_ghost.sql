ALTER TABLE "chapters" ALTER COLUMN "id" SET DEFAULT 'chapter_01K163H14CPTJH1C3TZ6M3ZBBJ';--> statement-breakpoint
ALTER TABLE "mangas" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "mangas" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "mangas" ALTER COLUMN "genres" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "mangas" ALTER COLUMN "publisher_jp" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "mangas" DROP COLUMN "publisher_fr";