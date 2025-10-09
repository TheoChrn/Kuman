/**
 * Converts a string into a URL-friendly slug.
 * Removes accents, converts to lowercase, replaces non-alphanumeric characters with hyphens,
 * and normalizes consecutive or edge hyphens.
 *
 * @param input The string to transform
 * @returns A URL-safe slug string
 */
export function toSlug(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .toLowerCase() // converts to lowercase
    .replace(/[^a-z0-9]+/g, "-") // replaces non-alphanumeric characters with hyphens
    .replace(/^-+|-+$/g, "") // trim hyphens
    .replace(/-{2,}/g, "-"); //  trim consecutive hyphens
}

/**
 * Normalizes a string by removing diacritics (accents) and converting it to lowercase.
 * Uses Unicode NFKD normalization to decompose accented characters before stripping them.
 *
 * @param input The string to normalize
 * @returns A lowercase string without accents
 */
export function normalize(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}
