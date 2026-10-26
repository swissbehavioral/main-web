export type BlockType = "heading" | "paragraph" | "list" | "quote" | "callout";
export interface ContentBlock {
  slot?: string;
  type: BlockType;
  text: string;
}
export interface ContentDocument {
  /** Indicates published text changes; never selects the page layout. */
  customized?: boolean;
  seoTitle?: string;
  id: string;
  kind: "page" | "post";
  path: string;
  title: string;
  eyebrow: string;
  summary: string;
  metaDescription: string;
  body: ContentBlock[];
  reviewRequired: boolean;
  reviewNotes: string;
  author: string;
  reviewer: string;
  sources: string;
  category: string;
  publishedAt: string;
}
export interface ContentRecord {
  id: string;
  kind: "page" | "post";
  path: string;
  draft: ContentDocument;
  published: ContentDocument | null;
  updatedAt: string;
  archived: boolean;
}
export const BLOCK_TYPES: BlockType[] = [
  "heading",
  "paragraph",
  "list",
  "quote",
  "callout",
];
export const blockLabels: Record<BlockType, string> = {
  heading: "Section heading",
  paragraph: "Paragraph",
  list: "Bullet list",
  quote: "Quotation",
  callout: "Notice / callout",
};
export function validContentPath(path: string, kind: "page" | "post") {
  return kind === "post"
    ? /^\/resources\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(path)
    : /^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)?)?$/.test(
        path,
      );
}
export function validateContent(
  doc: ContentDocument,
  publishing = false,
): string[] {
  const errors: string[] = [];
  if (doc.seoTitle && doc.seoTitle.length > 180) errors.push("Keep the SEO title under 180 characters.");
  if (!doc.title.trim() || doc.title.length > 180)
    errors.push("Enter a title of 1–180 characters.");
  if (!validContentPath(doc.path, doc.kind) || doc.path.length > 180)
    errors.push("Use a lowercase URL with words separated by hyphens.");
  if (
    doc.summary.length > 1000 ||
    doc.metaDescription.length > 300 ||
    doc.eyebrow.length > 100
  )
    errors.push("Shorten the introduction, SEO description, or section label.");
  if (
    doc.author.length > 150 ||
    doc.reviewer.length > 150 ||
    doc.sources.length > 3000 ||
    doc.reviewNotes.length > 3000 ||
    doc.category.length > 80
  )
    errors.push("A metadata field is too long.");
  if (
    !Array.isArray(doc.body) ||
    doc.body.length > 80 ||
    doc.body.some(
      (b) =>
        !b ||
        !BLOCK_TYPES.includes(b.type) ||
        typeof b.text !== "string" ||
        b.text.length > 6000,
    )
  )
    errors.push(
      "Use at most 80 valid blocks, each no longer than 6,000 characters.",
    );
  if (JSON.stringify(doc).length > 55000)
    errors.push(
      "This document is too long. Keep its total text below 55,000 characters.",
    );
  if (
    publishing &&
    (!doc.summary.trim() ||
      !Array.isArray(doc.body) ||
      !doc.body.some((b) => typeof b?.text === "string" && b.text.trim()))
  )
    errors.push(
      "Publishing requires an introduction and at least one non-empty content block.",
    );
  if (publishing && doc.kind === "post" && !doc.author.trim())
    errors.push("Add an author before publishing a blog post.");
  if (doc.kind === "post" && doc.reviewRequired && publishing)
    errors.push(
      "This article is marked for review. Complete the review before publishing.",
    );
  return errors;
}
export function safeJsonLd(value: unknown) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
