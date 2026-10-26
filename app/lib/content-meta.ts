import type { ContentDocument } from "./content.types";
export function contentMeta(doc?: ContentDocument) {
  const title =
    doc && doc.seoTitle
      ? doc.seoTitle
      : doc
        ? `${doc.title} | Swiss Behavioral Health`
        : "Swiss Behavioral Health";
  const description = doc?.metaDescription || doc?.summary || "";
  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    ...(doc ? [{ tagName: "link" as const, rel: "canonical", href: `https://www.swissbehavioralhealth.com${doc.path}` }, {property:"og:url",content:`https://www.swissbehavioralhealth.com${doc.path}`}] : []),
    {
      property: "og:type",
      content: doc?.kind === "post" ? "article" : "website",
    },
    ...(doc?.kind === "post" && doc.reviewRequired
      ? [{ name: "robots", content: "noindex, follow" }]
      : []),
  ];
}
