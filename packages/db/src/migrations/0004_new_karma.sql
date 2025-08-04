ALTER TABLE "chapters" ALTER COLUMN "id" SET DEFAULT 'chapter_01K1RQF80FGPKVZV5N56T8HG4R';--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "release_date" date NOT NULL;--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;