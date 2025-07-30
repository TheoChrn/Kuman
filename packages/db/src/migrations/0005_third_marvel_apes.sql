CREATE TYPE "public"."publisher_fr" AS ENUM('kana', 'glenat', 'pika', 'ki-oon', 'kurokawa', 'delcourt-tonkam', 'panini', 'crunchyroll', 'soleil', 'akata', 'komikku', 'nobi-nobi', 'meian', 'noeve-grafx', 'vega-dupuis');--> statement-breakpoint
CREATE TYPE "public"."publisher_jp" AS ENUM('shueisha', 'kodansha', 'shogakukan', 'hakusensha', 'square-enix', 'futabasha', 'akita-shoten', 'shinchosha', 'mediafactory', 'gentosha');--> statement-breakpoint
ALTER TABLE "chapters" ALTER COLUMN "id" SET DEFAULT 'chapter_01K13T38NC966N5KZRYFMJPQRW';--> statement-breakpoint
ALTER TABLE "mangas" 
ALTER COLUMN "alternative_names" 
SET DATA TYPE text[] 
USING string_to_array("alternative_names", ', ');
ALTER TABLE "mangas" ALTER COLUMN "alternative_names" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "mangas" ALTER COLUMN "publisher_jp" SET DATA TYPE "public"."publisher_jp" USING "publisher_jp"::"public"."publisher_jp";--> statement-breakpoint
ALTER TABLE "mangas" ALTER COLUMN "publisher_fr" SET DATA TYPE "public"."publisher_fr" USING "publisher_fr"::"public"."publisher_fr";