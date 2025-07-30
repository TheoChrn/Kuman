CREATE TYPE "public"."genre" AS ENUM('action', 'aventure', 'comédie', 'drame', 'fantastique', 'horreur', 'mystère', 'psychologique', 'romance', 'science-fiction', 'slice of life', 'sport', 'surnaturel', 'thriller', 'historique', 'arts martiaux', 'militaire', 'mecha', 'musique', 'policier', 'ecchi', 'yaoi', 'yuri', 'isekai', 'tranche de vie', 'cyberpunk', 'space opera', 'voyage temporel', 'cuisine', 'animaux');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('pause', 'ongoing', 'completed');--> statement-breakpoint
CREATE TYPE "public"."type" AS ENUM('shônen', 'shôjo', 'seinen', 'josei', 'kodomo', 'yonkoma');--> statement-breakpoint

--> statement-breakpoint
CREATE TABLE "mangas" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"name_japanese" text NOT NULL,
	"name_romaji" text NOT NULL,
	"name_alternative" text NOT NULL,
	"author" text NOT NULL,
	"synopsis" text NOT NULL,
	"cover_url" text NOT NULL,
	"tome_count" smallint NOT NULL,
	"status" "status" NOT NULL,
	"type" "type" NOT NULL,
	"genres" "genre"[] NOT NULL,
	"release_date" date NOT NULL,
	"publisher_jp" text NOT NULL,
	"publisher_fr" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "mangas_slug_unique" UNIQUE("slug")
);

