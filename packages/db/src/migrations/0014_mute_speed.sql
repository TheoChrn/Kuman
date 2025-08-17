ALTER TABLE "bookmarks" RENAME COLUMN "manga_id" TO "manga_slug";--> statement-breakpoint
ALTER TABLE "bookmarks" DROP CONSTRAINT "bookmarks_user_id_manga_id_unique";--> statement-breakpoint
ALTER TABLE "bookmarks" DROP CONSTRAINT "bookmarks_manga_id_mangas_slug_fk";
--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_manga_slug_mangas_slug_fk" FOREIGN KEY ("manga_slug") REFERENCES "public"."mangas"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_user_id_manga_slug_unique" UNIQUE("user_id","manga_slug");