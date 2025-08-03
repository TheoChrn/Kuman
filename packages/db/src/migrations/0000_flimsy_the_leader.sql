CREATE TYPE "public"."genre" AS ENUM('action', 'aventure', 'comédie', 'drame', 'fantastique', 'horreur', 'mystère', 'psychologique', 'romance', 'science-fiction', 'slice of life', 'sport', 'surnaturel', 'thriller', 'historique', 'arts martiaux', 'militaire', 'mecha', 'musique', 'policier', 'ecchi', 'yaoi', 'yuri', 'isekai', 'tranche de vie', 'cyberpunk', 'space opera', 'voyage temporel', 'cuisine', 'animaux');--> statement-breakpoint
CREATE TYPE "public"."publisher_fr" AS ENUM('kana', 'glenat', 'pika', 'ki-oon', 'kurokawa', 'delcourt-tonkam', 'panini', 'crunchyroll', 'soleil', 'akata', 'komikku', 'nobi-nobi', 'meian', 'noeve-grafx', 'vega-dupuis');--> statement-breakpoint
CREATE TYPE "public"."publisher_jp" AS ENUM('shueisha', 'kodansha', 'shogakukan', 'hakusensha', 'square-enix', 'futabasha', 'akita-shoten', 'shinchosha', 'mediafactory', 'gentosha');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('pause', 'ongoing', 'completed');--> statement-breakpoint
CREATE TYPE "public"."type" AS ENUM('shônen', 'shôjo', 'seinen', 'josei', 'kodomo', 'yonkoma');--> statement-breakpoint
CREATE TABLE "chapters" (
	"id" text PRIMARY KEY DEFAULT 'chapter_01K1H5WXXM193X0MS88P67QN24' NOT NULL,
	"number" smallint NOT NULL,
	"volume_id" text DEFAULT 'some-id' NOT NULL,
	"name" varchar(255) NOT NULL,
	"page_count" smallint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mangas" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text,
	"slug" text NOT NULL,
	"original_title" text NOT NULL,
	"romaji_title" text NOT NULL,
	"alternative_titles" text[],
	"author" text NOT NULL,
	"synopsis" text NOT NULL,
	"cover_url" text,
	"tome_count" smallint NOT NULL,
	"status" text NOT NULL,
	"type" text NOT NULL,
	"genres" text[] NOT NULL,
	"release_date" date NOT NULL,
	"publisher_jp" text NOT NULL,
	"publisher_fr" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "mangas_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "volumes" (
	"id" text PRIMARY KEY NOT NULL,
	"manga_slug" text DEFAULT 'test' NOT NULL,
	"volume_number" smallint NOT NULL,
	"title" text,
	"release_date" date NOT NULL,
	"page_count" smallint,
	"chapter_count" smallint,
	"summary" text NOT NULL,
	"cover_image_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_volume_id_volumes_id_fk" FOREIGN KEY ("volume_id") REFERENCES "public"."volumes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "volumes" ADD CONSTRAINT "volumes_manga_slug_mangas_slug_fk" FOREIGN KEY ("manga_slug") REFERENCES "public"."mangas"("slug") ON DELETE no action ON UPDATE no action;