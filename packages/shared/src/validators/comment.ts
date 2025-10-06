import { z } from "zod/v4";

import { baseInputRequiredTextField, passwordSchema } from "./utils";

export const commentFormSchema = z.object({
  content: baseInputRequiredTextField(),
});

export const createCommentSchema = commentFormSchema.extend({
  parentId: z.string().optional(),
});
export const updateCommentSchema = commentFormSchema.extend({
  id: z.string(),
});
