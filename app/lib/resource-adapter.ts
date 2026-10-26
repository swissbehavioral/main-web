import type { ContentDocument } from "./content.types";
import type { ResourcePost } from "../data/resources";
import { resourcePosts } from "../data/resources";
/** Preserve the original article renderer and wording while using persisted content. */
export function toResourcePost(doc: ContentDocument): ResourcePost {
  const original = resourcePosts.find(
    (p) => doc.path === `/resources/${p.slug}`,
  );
  return {
    slug: doc.path.replace("/resources/", ""),
    title: doc.title,
    description: doc.summary,
    tag: doc.category as ResourcePost["tag"],
    publishedAt: doc.publishedAt,
    readingMinutes:
      !doc.customized && original
        ? original.readingMinutes
        : Math.max(
            1,
            Math.ceil(
              doc.body
                .map((b) => b.text)
                .join(" ")
                .split(/\s+/).length / 200,
            ),
          ),
    body: doc.body.map((b) =>
      b.type === "list"
        ? { type: "list", items: b.text.split("\n").filter(Boolean) }
        : {
            type:
              b.type === "heading"
                ? "h"
                : b.type === "paragraph"
                  ? "p"
                  : b.type === "callout"
                    ? "note"
                    : b.type,
            text: b.text,
          },
    ),
  };
}
