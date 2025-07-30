import { z } from "zod/v4";

import {
  genreValues,
  publisherFrValues,
  publisherJpValues,
  statusValues,
  typeValues,
} from "@kuman/db/enums";

import {
  baseInputRequiredNumberField,
  baseInputRequiredTextField,
} from "./utils";

export const createMangaForm = z.object({
  title: baseInputRequiredTextField(),
  originalTitle: baseInputRequiredTextField(),
  romajiTitle: baseInputRequiredTextField(),
  alternativeTitles: z
    .array(z.string())
    .transform((val) => (val.length ? val : null)),
  author: baseInputRequiredTextField(),
  synopsis: baseInputRequiredTextField(),
  cover: z.file(),
  tomeCount: baseInputRequiredNumberField(z.number().min(1)),
  releaseDate: baseInputRequiredTextField(z.iso.date()),
  status: baseInputRequiredTextField(z.enum(statusValues)),
  type: baseInputRequiredTextField(z.enum(typeValues)),
  genres: z.array(z.string()).pipe(z.array(z.enum(genreValues))),
  publisherJp: baseInputRequiredTextField(z.enum(publisherJpValues)),
  publisherFr: baseInputRequiredTextField(z.enum(publisherFrValues)),
});

export const createManga = createMangaForm.omit({ cover: true }).extend({
  coverUrl: z.string().nullable(),
  slug: z.string().trim().min(1),
});
