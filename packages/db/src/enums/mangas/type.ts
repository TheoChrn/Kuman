export const typeValues = [
  "shônen",
  "shôjo",
  "seinen",
  "josei",
  "kodomo",
  "yonkoma",
] as const;

export type TypeValues = typeof typeValues;
export type Type = TypeValues[number];

export const type = {
  SHONEN: "shônen",
  SHOJO: "shôjo",
  SEINEN: "seinen",
  JOSEI: "josei",
  KODOMO: "kodomo",
  YONKOMA: "yonkoma",
} as const satisfies Record<string, Type>;
