CREATE TABLE "bookmars" (
	"id" text PRIMARY KEY NOT NULL,
	"manga_id" text NOT NULL,
	"user_id" text NOT NULL,
	"current_page" smallint DEFAULT 1 NOT NULL,
	"current_chapter" smallint DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "bookmars_user_id_manga_id_unique" UNIQUE("user_id","manga_id")
);
--> statement-breakpoint
ALTER TABLE "bookmars" ADD CONSTRAINT "bookmars_manga_id_mangas_id_fk" FOREIGN KEY ("manga_id") REFERENCES "public"."mangas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmars" ADD CONSTRAINT "bookmars_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;