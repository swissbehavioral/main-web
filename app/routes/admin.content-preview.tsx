import { ResourcesExperience } from "../components/resources-experience";
import { toResourcePost } from "../lib/resource-adapter";
import { data, Link } from "react-router";
import { requirePermission } from "../lib/auth.server";
import { getContentRecord, listPublishedPosts } from "../lib/content.server";
import { privateHeaders } from "../lib/security.server";
import { ContentBlocks } from "../components/content-blocks";
import { ContractPage } from "../components/contract-page";
import { HomeExperience } from "../components/home-experience";
import type { Route } from "./+types/admin.content-preview";
export async function loader({ request, params }: Route.LoaderArgs) {
  await requirePermission(request, "content");
  const record = await getContentRecord(params.id);
  if (!record) throw data("Content not found", { status: 404 });
  return data(
    {
      doc: { ...record.draft, customized: true },
      posts:
        record.path === "/resources"
          ? (await listPublishedPosts()).map(toResourcePost)
          : [],
    },
    { headers: privateHeaders },
  );
}
export function meta() {
  return [
    { title: "Private draft preview | SBH" },
    { name: "robots", content: "noindex, nofollow" },
  ];
}
export default function Preview({
  loaderData: { doc, posts },
}: Route.ComponentProps) {
  return (
    <div className="cms-private-preview">
      <div className="draft-preview-banner">
        Private saved draft. Visitors see the published version.
      </div>
      <div className="public-body">
        {doc.kind === "post" ? (
          <article className="management-card article-reading">
            <p>{doc.category}</p>
            <h1 className="cms-preview-title">{doc.title}</h1>
            <p>{doc.summary}</p>
            <ContentBlocks blocks={doc.body} />
          </article>
        ) : doc.path === "/resources" ? (
          <ResourcesExperience doc={doc} posts={posts} />
        ) : doc.path === "/" ? (
          <HomeExperience doc={doc} />
        ) : (
          <ContractPage doc={doc} preview />
        )}
      </div>
    </div>
  );
}

export function headers() {
  return privateHeaders;
}
