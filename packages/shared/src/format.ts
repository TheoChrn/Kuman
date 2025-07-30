export function toSlug(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // non-alphanum → tiret
    .replace(/^-+|-+$/g, "") // trim tirets
    .replace(/-{2,}/g, "-"); // tirets consécutifs
}
