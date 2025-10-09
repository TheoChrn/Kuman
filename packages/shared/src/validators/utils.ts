import { z } from "zod/v4";

/**
 * Creates a Zod schema for a number input field that is optional.
 * Converts the input string to a number, returning `null` if conversion fails.
 * Can be further refined with an optional Zod schema.
 *
 * @template T The type of the number (number | null | undefined)
 * @param schema Optional Zod schema to pipe the transformed value through
 * @returns A Zod schema transforming string input into a nullable number
 */
export function baseInputNumberField<T extends number | null | undefined>(
  schema?: z.ZodSchema<T, any>,
) {
  const base = z.string().transform((val) => Number(val) || null);
  return schema ? base.pipe(schema) : base;
}

/**
 * Creates a Zod schema for a required number input field.
 * Converts the input string to a number. If conversion fails, it will throw validation errors.
 * Can be further refined with an optional Zod schema.
 *
 * @template T The type of the number (number)
 * @param schema Optional Zod schema to pipe the transformed value through
 * @returns A Zod schema transforming string input into a required number
 */
export function baseInputRequiredNumberField<T extends number>(
  schema?: z.ZodSchema<T, any>,
) {
  const base = z
    .string()
    .trim()
    .transform((val) => Number(val));
  return schema ? base.pipe(schema) : base;
}

/**
 * Creates a Zod schema for a text input field that is optional.
 * Trims whitespace and converts empty strings to `null`.
 * Can be further refined with an optional Zod schema.
 *
 * @template T The type of the text (string | null)
 * @param schema Optional Zod schema to pipe the transformed value through
 * @returns A Zod schema transforming string input into a nullable string
 */
export function baseInputTextField<T extends string | null>(
  schema?: z.ZodSchema<T, any>,
) {
  const base = z
    .string()
    .trim()
    .transform<string | null>((val) => val || null);
  return schema ? base.pipe(schema) : base;
}

/**
 * Creates a Zod schema for a text input field that is optional.
 * Trims whitespace and converts empty strings to `undefined`.
 * Can be further refined with an optional Zod schema.
 *
 * @template T The type of the text (string | undefined)
 * @param schema Optional Zod schema to pipe the transformed value through
 * @returns A Zod schema transforming string input into an optional string
 */
export function optionalInputTextField<T extends string | undefined>(
  schema?: z.ZodSchema<T, any>,
) {
  const base = z
    .string()
    .trim()
    .transform<string | undefined>((val) => val || undefined);
  return schema ? base.pipe(schema) : base;
}

/**
 * Creates a Zod schema for a required text input field.
 * Trims whitespace and validates that the input is not empty.
 * Provides a default error message if the field is empty.
 * Can be further refined with an optional Zod schema.
 *
 * @template T The type of the text (string)
 * @param schema Optional Zod schema to pipe the value through
 * @returns A Zod schema transforming string input into a required, non-empty string
 */
export function baseInputRequiredTextField<T extends string>(
  schema?: z.ZodSchema<T, any>,
) {
  const base = z.string().trim().min(1, "Ce champs est obligatoire");
  return schema ? base.pipe(schema) : base;
}

export const passwordSchema = z
  .string()
  .regex(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{};:'"\\|,.<>/?]).{12,128}$/,
    "Le mot de passe doit contenir au moins 12 caractères, avec au moins une majuscule, une minuscule, un chiffre et un caractère spécial.",
  );
