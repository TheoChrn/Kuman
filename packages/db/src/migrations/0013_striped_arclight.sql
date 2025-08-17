ALTER TABLE "bookmarks" DROP CONSTRAINT "bookmarks_manga_id_mangas_id_fk";
--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_manga_id_mangas_slug_fk" FOREIGN KEY ("manga_id") REFERENCES "public"."mangas"("slug") ON DELETE no action ON UPDATE no action;