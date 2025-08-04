import { z } from "zod/v4";

import {
  baseInputNumberField,
  baseInputRequiredNumberField,
  baseInputRequiredTextField,
  baseInputTextField,
} from "./utils";

export const createVolumeForm = z.object({
  title: baseInputTextField(),
  volumeNumber: baseInputRequiredNumberField(
    z.number().positive("Le numéro doit être supérieur à 1"),
  ),
  releaseDate: baseInputRequiredTextField(z.iso.date()),
  pageCount: baseInputNumberField(),
  chapterCount: baseInputNumberField(),
  summary: baseInputRequiredTextField(),
  cover: z.file().nullable(),
  mangaSlug: baseInputRequiredTextField(),
});

export const createVolume = z
  .instanceof(FormData)
  .transform((formData) => {
    const json = formData.get("json")!.toString();
    const data = JSON.parse(json);
    const cover = formData.get("cover");
    return { ...data, cover };
  })
  .pipe(createVolumeForm);
