import { readFormData } from "../lib/security.server";
import { pageSeeds } from "../data/content-seeds";
import { validatePageStructure } from "../lib/page-copy";
import { randomUUID } from "node:crypto";
import { data, redirect } from "react-router";
import { ContentEditor } from "../components/content-editor";
import { requirePermission } from "../lib/auth.server";
import { getContentRecord, saveContent } from "../lib/content.server";
import {
  validateContent,
  type ContentDocument,
  type ContentBlock,
  type ContentRecord,
} from "../lib/content.types";
import { sameOrigin, privateHeaders } from "../lib/security.server";
import type { Route } from "./+types/admin.content-edit";
const blank = (): ContentRecord => {
  const id = randomUUID();
  return {
    id,
    kind: "post",
    path: "/resources/new-article",
    draft: {
      id,
      kind: "post",
      path: "/resources/new-article",
      title: "",
      eyebrow: "SBH JOURNAL",
      summary: "",
      metaDescription: "",
      body: [{ type: "paragraph", text: "" }],
      reviewRequired: false,
      reviewNotes: "",
      author: "",
      reviewer: "",
      sources: "",
      category: "",
      publishedAt: "",
    },
    published: null,
    archived: false,
    updatedAt: "new",
  };
};
export async function loader({ request, params }: Route.LoaderArgs) {
  await requirePermission(request, "content");
  const record =
    params.id === "new" ? blank() : await getContentRecord(params.id);
  if (!record) throw data("Content not found", { status: 404 });
  return data({ record }, { headers: privateHeaders });
}
export async function action({ request, params }: Route.ActionArgs) {
  sameOrigin(request);
  const user = await requirePermission(request, "content");
  const form = await readFormData(request);
  const existing =
    params.id === "new" ? blank() : await getContentRecord(params.id);
  if (!existing) throw data("Content not found", { status: 404 });
  const intent = String(form.get("intent"));
  if (!["save", "publish", "unpublish", "archive", "restore"].includes(intent))
    return data({ errors: ["Choose a valid action."] }, { status: 400 });
  let body: ContentBlock[];
  try {
    body = JSON.parse(String(form.get("body") || "[]"));
  } catch {
    return data(
      { errors: ["The block data could not be read."] },
      { status: 400 },
    );
  }
  const text = (name: string) => String(form.get(name) || "").trim();
  const doc: ContentDocument = {
    ...existing.draft,
    id: existing.id,
    path:
      existing.kind === "post" ? `/resources/${text("slug")}` : existing.path,
    title: text("title"),
    eyebrow: text("eyebrow"),
    summary: text("summary"),
    metaDescription: text("metaDescription"),
    seoTitle: form.has("seoTitle") ? text("seoTitle") : existing.draft.seoTitle,
    body,
    reviewRequired: existing.kind === "post" && form.get("reviewRequired") === "on",
    reviewNotes: existing.kind === "post" ? text("reviewNotes") : "",
    ...(existing.kind === "post"
      ? {
          author: text("author"),
          reviewer: text("reviewer"),
          sources: text("sources"),
          category: text("category"),
        }
      : {}),
  };
  const errors = validateContent(doc, intent === "publish");
  const seed = pageSeeds.find((seed) => seed.id === doc.id);
  if (seed && !errors.length) errors.push(...validatePageStructure(seed, doc));
  if (intent === "publish" && form.get("confirmPublish") !== "on")
    errors.push("Confirm that you have reviewed this content for publication.");
  if (
    ["archive", "restore", "unpublish"].includes(intent) &&
    form.get("confirmVisibility") !== "on"
  )
    errors.push("Confirm this visibility change.");
  if (errors.length) return data({ errors }, { status: 400 });
  try {
    await saveContent(
      doc,
      intent as "save" | "publish" | "unpublish" | "archive" | "restore",
      text("revision"),
      user.email,
    );
    return redirect(`/admin/content/${doc.id}?saved=1`);
  } catch (e) {
    if (e instanceof Response)
      return data({ errors: [await e.text()] }, { status: e.status });
    console.error("[content] Save failed", (e as { code?: number }).code);
    return data(
      {
        errors: [
          "The content could not be saved. Check the connection and try again; copy your changes before reloading.",
        ],
      },
      { status: 503 },
    );
  }
}
export function meta() {
  return [{ title: "Content editor | SBH Admin" }];
}
export default function Editor({
  loaderData: { record },
  actionData,
}: Route.ComponentProps) {
  return (
    <ContentEditor
      key={`${record.id}:${record.updatedAt}`}
      record={record}
      errors={actionData?.errors}
      saved={record.updatedAt !== "seed" && record.updatedAt !== "new"}
    />
  );
}
