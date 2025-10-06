CREATE TABLE "comments" (
	"id" text PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"user_id" text NOT NULL,
	"manga_slug" text NOT NULL,
	"parent_id" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "volumes" ALTER COLUMN "manga_slug" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_manga_slug_mangas_slug_fk" FOREIGN KEY ("manga_slug") REFERENCES "public"."mangas"("slug") ON DELETE no action ON UPDATE no action;