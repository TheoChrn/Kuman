ALTER TABLE "bookmars" RENAME TO "bookmarks";--> statement-breakpoint
ALTER TABLE "bookmarks" DROP CONSTRAINT "bookmars_user_id_manga_id_unique";--> statement-breakpoint
ALTER TABLE "bookmarks" DROP CONSTRAINT "bookmars_manga_id_mangas_id_fk";
--> statement-breakpoint
ALTER TABLE "bookmarks" DROP CONSTRAINT "bookmars_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_manga_id_mangas_id_fk" FOREIGN KEY ("manga_id") REFERENCES "public"."mangas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_user_id_manga_id_unique" UNIQUE("user_id","manga_id");