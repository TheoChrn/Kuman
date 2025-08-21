ALTER TABLE "users" ADD COLUMN "role" text DEFAULT 'user' NOT NULL;--> statement-breakpoint
DROP TYPE "public"."genre";--> statement-breakpoint
DROP TYPE "public"."publisher_fr";--> statement-breakpoint
DROP TYPE "public"."publisher_jp";--> statement-breakpoint
DROP TYPE "public"."status";--> statement-breakpoint
DROP TYPE "public"."type";