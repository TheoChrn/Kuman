export const publisherFrValues = [
  "kana",
  "glenat",
  "pika",
  "ki-oon",
  "kurokawa",
  "delcourt-tonkam",
  "panini",
  "crunchyroll",
  "soleil",
  "akata",
  "komikku",
  "nobi-nobi",
  "meian",
  "noeve-grafx",
  "vega-dupuis",
] as const;

export type PublisherFrValues = typeof publisherFrValues;
export type PublisherFr = PublisherFrValues[number];

export const publisherFr = {
  KANA: "kana",
  GLENAT: "glenat",
  PIKA: "pika",
  KIOON: "ki-oon",
  KUROKAWA: "kurokawa",
  DELCOURT_TONKAM: "delcourt-tonkam",
  PANINI: "panini",
  CRUNCHYROLL: "crunchyroll",
  SOLEIL: "soleil",
  AKATA: "akata",
  KOMIKKU: "komikku",
  NOBI_NOBI: "nobi-nobi",
  MEIAN: "meian",
  NOEVE_GRAFX: "noeve-grafx",
  VEGA_DUPUIS: "vega-dupuis",
} as const satisfies Record<string, PublisherFr>;

export const publisherFrLabelFrench = {
  [publisherFr.KANA]: "Kana",
  [publisherFr.GLENAT]: "Glénat",
  [publisherFr.PIKA]: "Pika",
  [publisherFr.KIOON]: "Ki-oon",
  [publisherFr.KUROKAWA]: "Kurokawa",
  [publisherFr.DELCOURT_TONKAM]: "Delcourt/Tonkam",
  [publisherFr.PANINI]: "Panini Manga",
  [publisherFr.CRUNCHYROLL]: "Crunchyroll Éditions",
  [publisherFr.SOLEIL]: "Soleil Manga",
  [publisherFr.AKATA]: "Akata",
  [publisherFr.KOMIKKU]: "Komikku",
  [publisherFr.NOBI_NOBI]: "Nobi Nobi",
  [publisherFr.MEIAN]: "Meian",
  [publisherFr.NOEVE_GRAFX]: "Noeve Grafx",
  [publisherFr.VEGA_DUPUIS]: "Vega-Dupuis",
} as const satisfies Record<PublisherFr, string>;

export const publisherJpValues = [
  "shueisha",
  "kodansha",
  "shogakukan",
  "hakusensha",
  "square-enix",
  "futabasha",
  "akita-shoten",
  "shinchosha",
  "mediafactory",
  "gentosha",
] as const;

export type PublisherJpValues = typeof publisherJpValues;
export type PublisherJp = PublisherJpValues[number];

export const publisherJp = {
  SHUEISHA: "shueisha",
  KODANSHA: "kodansha",
  SHOGAKUKAN: "shogakukan",
  HAKUSENSHA: "hakusensha",
  SQUARE_ENIX: "square-enix",
  FUTABASHA: "futabasha",
  AKITA_SHOTEN: "akita-shoten",
  SHINCHOSHA: "shinchosha",
  MEDIAFACTORY: "mediafactory",
  GENTOSHA: "gentosha",
} as const satisfies Record<string, PublisherJp>;

export const publisherJpLabelFrench = {
  [publisherJp.SHUEISHA]: "Shueisha",
  [publisherJp.KODANSHA]: "Kodansha",
  [publisherJp.SHOGAKUKAN]: "Shogakukan",
  [publisherJp.HAKUSENSHA]: "Hakusensha",
  [publisherJp.SQUARE_ENIX]: "Square Enix",
  [publisherJp.FUTABASHA]: "Futabasha",
  [publisherJp.AKITA_SHOTEN]: "Akita Shoten",
  [publisherJp.SHINCHOSHA]: "Shinchosha",
  [publisherJp.MEDIAFACTORY]: "Media Factory",
  [publisherJp.GENTOSHA]: "Gentosha",
} as const satisfies Record<PublisherJp, string>;
