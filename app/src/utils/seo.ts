export function seo({
  title,
  description = "Kuman est un framework React full-stack, type-safe et client-first basé sur TanStack.",
  keywords = "react, framework, full-stack, trpc, tanstack, typescript, query, router, seo, kuman",
  image = "/og-image.png",
  url = "https://theochrn-kuman.netlify.app/",
  locale = "fr_FR",
}: {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  locale?: string;
}) {
  return [
    { title },
    { name: "description", content: description },
    { name: "keywords", content: keywords },

    { name: "robots", content: "index, follow" },
    { name: "language", content: locale },

    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "Kuman" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:locale", content: locale },
    ...(image ? [{ property: "og:image", content: image }] : []),

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:creator", content: "@tannerlinsley" },
    { name: "twitter:site", content: "@tannerlinsley" },
    ...(image ? [{ name: "twitter:image", content: image }] : []),

    { rel: "canonical", href: url },
  ];
}
