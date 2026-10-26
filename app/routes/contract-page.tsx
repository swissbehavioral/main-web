import { localizedMeta } from "../lib/locale";
import { contentMeta } from "../lib/content-meta";
import { data } from "react-router";
import { ContractPage } from "../components/contract-page";
import { getPublishedContent } from "../lib/content.server";
import { site } from "../data/site";
import type { Route } from "./+types/contract-page";
export async function loader({ request }: Route.LoaderArgs) {
  const path = new URL(request.url).pathname.replace(/\/$/, "");
  const doc = await getPublishedContent(path);
  if (!doc || doc.kind !== "page")
    throw data("Page not found", { status: 404 });
  return { doc };
}
export function meta({ loaderData, matches }: Route.MetaArgs) {
  return localizedMeta(contentMeta(loaderData?.doc),matches);
}

export default function Page({ loaderData }: Route.ComponentProps) {
  return <ContractPage doc={loaderData.doc} />;
}
