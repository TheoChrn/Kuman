import { Type } from "@kuman/db/enums";

export const typeIcons = {
  shônen: "🧒🏻",
  shôjo: "👧🏻",
  seinen: "🧑🏻",
  josei: "👩🏻",
  kodomo: "👶🏻",
  yonkoma: "📰",
} as const satisfies Record<Type, string>;
