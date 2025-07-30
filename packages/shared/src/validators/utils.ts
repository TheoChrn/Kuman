import { z } from "zod/v4";

export function baseInputNumberField<T extends number | null | undefined>(
  schema?: z.ZodSchema<T, any>,
) {
  const base = z.string().transform((val) => Number(val) || null);
  return schema ? base.pipe(schema) : base;
}
export function baseInputRequiredNumberField<T extends number>(
  schema?: z.ZodSchema<T, any>,
) {
  const base = z
    .string()
    .trim()
    .transform((val) => Number(val));
  return schema ? base.pipe(schema) : base;
}

export function baseInputTextField<T extends string | null | undefined>(
  schema?: z.ZodSchema<T, any>,
) {
  const base = z
    .string()
    .trim()
    .transform<string | null>((val) => val || null);
  return schema ? base.pipe(schema) : base;
}
export function baseInputRequiredTextField<T extends string>(
  schema?: z.ZodSchema<T, any>,
) {
  const base = z.string().trim().min(1, "Ce champs est obligatoire");
  return schema ? base.pipe(schema) : base;
}
