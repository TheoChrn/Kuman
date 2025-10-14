import { z } from "zod/v4";

import {
  baseInputRequiredNumberField,
  baseInputRequiredTextField,
} from "./utils";

export function transformFormData(formData: FormData) {
  console.log("test de parse");
  console.log(formData.get("json"));
  const data = JSON.parse(formData.get("json")!.toString());
  console.log(data);
  const files = formData.getAll("images");

  const images = data.metaData?.map((meta: any, i: number) => ({
    ...meta,
    file: files[i] ?? null,
  }));

  return { ...data, images };
}

export const imageSchema = z.object({
  path: z.string().nullable().optional(),
  file: z.file().nullable(),
  url: z.string().optional(),
  status: z.string().pipe(z.enum(["existing", "new", "deleted"])),
});

export type ImageSchema = z.input<typeof imageSchema>;

export const createOrUpdateChapterForm = z.object({
  name: baseInputRequiredTextField(),
  mangaSlug: baseInputRequiredTextField(),
  volumeNumber: baseInputRequiredNumberField(z.number().positive()),
  chapterNumber: baseInputRequiredNumberField(z.number().positive()),
  pageCount: baseInputRequiredNumberField(z.number().positive()),
  releaseDate: baseInputRequiredTextField(z.iso.date()),
  images: z.array(imageSchema),
});

export const createChapter = z
  .instanceof(FormData)
  .transform(transformFormData)
  .pipe(createOrUpdateChapterForm);

export const updateChapter = z
  .instanceof(FormData)
  .transform(transformFormData)
  .pipe(createOrUpdateChapterForm.extend({ id: z.string() }));
