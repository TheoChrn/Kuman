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

export const createOrUpdateSerieForm = z.object({
  title: baseInputRequiredTextField(),
  originalTitle: baseInputRequiredTextField(),
  romajiTitle: baseInputRequiredTextField(),
  alternativeTitles: z
    .array(z.string())
    .transform((val) => (val.length ? val : null)),
  author: baseInputRequiredTextField(),
  synopsis: baseInputRequiredTextField(),
  cover: z.file().nullable(),
  tomeCount: baseInputRequiredNumberField(z.number().min(1)),
  releaseDate: baseInputRequiredTextField(z.iso.date()),
  status: baseInputRequiredTextField(z.enum(statusValues)),
  type: baseInputRequiredTextField(z.enum(typeValues)),
  genres: z.array(z.string()).pipe(z.array(z.enum(genreValues))),
  publisherJp: baseInputRequiredTextField(z.enum(publisherJpValues)),
  publisherFr: baseInputRequiredTextField(z.enum(publisherFrValues)),
});

export const createOrUpdateSerie = z
  .instanceof(FormData)
  .transform((formData) => {
    const json = formData.get("json")!.toString();
    const data = JSON.parse(json);
    const cover = formData.get("cover");
    return { ...data, cover };
  })
  .pipe(createOrUpdateSerieForm.extend({ slug: z.string(), id: z.string() }));

export const searchParamsSchema = z.object({
  types: z.array(z.enum(typeValues)).optional(),
  genres: z.array(z.enum(genreValues)).optional(),
});
