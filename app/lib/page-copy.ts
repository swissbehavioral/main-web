import type { ContentDocument } from "./content.types";
export const designedPageIds = new Set([
  "page-resources",
  "page-home",
  "page-about",
  "page-team",
  "page-licensing",
  "page-treatment",
  "page-php",
  "page-iop",
  "page-op",
  "page-admissions",
  "page-insurance",
  "page-contact",
  "page-faq",
  "page-privacy",
  "page-terms",
]);
const normalize = (text: string) => text.replace(/\s+/g, " ").trim();
/** Text substitutions only: never edit markup, attributes, destinations or styles. */
export function buildPageCopy(seed: ContentDocument, doc: ContentDocument) {
  const replacements = new Map<string, string>();
  function pair(before: string, after: string) {
    if (before && before !== after) replacements.set(normalize(before), after);
  }
  seed.body.forEach((block, index) => {
    const edited = doc.body[index];
    if (!edited || edited.type !== block.type) return;
    pair(block.text, edited.text);
    if (block.text.includes("\n")) {
      const before = block.text.split("\n"),
        after = edited.text.split("\n");
      if (before.length === after.length)
        before.forEach((line, i) => pair(line, after[i]));
    }
    const before = block.text.split(": "),
      after = edited.text.split(": ");
    if (before.length === 2 && after.length === 2)
      before.forEach((line, i) => pair(line, after[i]));
  });
  return (text: string) => replacements.get(normalize(text)) ?? text;
}
const structuralKeys = new Set([
  "to",
  "href",
  "path",
  "id",
  "slug",
  "code",
  "status",
  "icon",
  "type",
  "src",
  "image",
  "photo",
]);
export function mapPageData<T>(value: T, copy: (text: string) => string): T {
  function visit(item: unknown, key = ""): unknown {
    if (structuralKeys.has(key)) return item;
    if (typeof item === "string") return copy(item);
    if (Array.isArray(item)) return item.map((entry) => visit(entry));
    if (item && typeof item === "object")
      return Object.fromEntries(
        Object.entries(item).map(([k, v]) => [k, visit(v, k)]),
      );
    return item;
  }
  return visit(value) as T;
}
export function validatePageStructure(
  seed: ContentDocument,
  doc: ContentDocument,
): string[] {
  if (!designedPageIds.has(doc.id)) return [];
  if (
    seed.body.length !== doc.body.length ||
    seed.body.some(
      (block, i) =>
        block.type !== doc.body[i]?.type ||
        doc.body[i]?.slot !== `${doc.id}:${i}`,
    )
  )
    return [
      "This page uses a fixed design. Edit its existing text fields without adding, removing, reordering or changing section types.",
    ];
  if (
    seed.body.some(
      (block, i) =>
        block.text.includes("\n") &&
        block.text.split("\n").length !== doc.body[i].text.split("\n").length,
    )
  )
    return [
      "Keep the same number of lines in each designed list or statistic; edit the wording of each line.",
    ];
  return [];
}
