import test from "node:test";
import assert from "node:assert/strict";
import {
  validateContent,
  validContentPath,
  safeJsonLd,
} from "../app/lib/content.types.ts";
import { can } from "../app/lib/permissions.ts";
const doc = {
  id: "post-qa",
  kind: "post",
  path: "/resources/test-article",
  title: "An article",
  eyebrow: "Journal",
  summary: "General information",
  metaDescription: "An article",
  body: [{ type: "paragraph", text: "A useful paragraph." }],
  reviewRequired: false,
  reviewNotes: "",
  author: "QA editorial team",
  reviewer: "",
  sources: "",
  category: "General",
  publishedAt: "",
};
test("Only administrators and managers can manage content", () => {
  assert(can("admin", "content"));
  assert(can("manager", "content"));
  assert(!can("agent", "content"));
  assert(!can("viewer", "content"));
});
test("Publishing requires content, an author, and completed review", () => {
  assert.deepEqual(validateContent(doc, true), []);
  assert(validateContent({ ...doc, author: "" }, true).length);
  assert(validateContent({ ...doc, reviewRequired: true }, true).length);
  assert(validateContent({ ...doc, body: [] }, true).length);
  assert.deepEqual(
    validateContent({ ...doc, reviewRequired: true }, false),
    [],
  );
});
test("Malformed and oversized blocks are rejected", () => {
  assert(validateContent({ ...doc, body: null }, true).length);
  assert(
    validateContent(
      { ...doc, body: [{ type: "html", text: "<script>bad()</script>" }] },
      true,
    ).length,
  );
  assert(
    validateContent({
      ...doc,
      body: [{ type: "paragraph", text: "a".repeat(6001) }],
    }).length,
  );
});
test("Slugs cannot traverse routes or inject markup", () => {
  assert(validContentPath("/resources/my-article", "post"));
  for (const path of [
    "/admin",
    "/resources/../admin",
    "/resources/<script>",
    "https://external.example",
    "//external.example",
  ])
    assert(!validContentPath(path, "post"));
});
test("JSON-LD preserves text without closing script tags", () => {
  const title = "</script><script>alert(1)</script>";
  const output = safeJsonLd({ title });
  assert(!output.includes("</script>"));
  assert.equal(JSON.parse(output).title, title);
});
