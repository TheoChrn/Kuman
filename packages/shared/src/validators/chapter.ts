import { z } from "zod/v4";

import {
  baseInputRequiredNumberField,
  baseInputRequiredTextField,
} from "./utils";

export const createChapterForm = z.object({
  name: baseInputRequiredTextField(),
  mangaSlug: baseInputRequiredTextField(),
  volumeId: baseInputRequiredTextField(),
  chapterNumber: baseInputRequiredNumberField(),
  pageCount: baseInputRequiredNumberField(),
  releaseDate: baseInputRequiredTextField(z.iso.date()),
  images: z.array(z.instanceof(File)),
});

export const createChapter = z
  .instanceof(FormData)
  .transform((formData) => {
    const json = formData.get("json")!.toString();
    const data = JSON.parse(json);
    const images = formData.getAll("images");
    return { ...data, images };
  })
  .pipe(createChapterForm.extend({ volumeNumber: z.number().positive() }));
