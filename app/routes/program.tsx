import { localizedMeta } from "../lib/locale";
import { contentMeta } from "../lib/content-meta";
import { data } from "react-router";
import { ContractPage } from "../components/contract-page";
import { getPublishedContent } from "../lib/content.server";
import { site } from "../data/site";
import type { Route } from "./+types/program";
export async function loader({ params }: Route.LoaderArgs) {
  const doc = await getPublishedContent(`/treatment/${params.program}`);
  if (!doc || doc.kind !== "page")
    throw data("Program not found", { status: 404 });
  return { doc };
}
export function meta({ loaderData, matches }: Route.MetaArgs) {
  return localizedMeta(contentMeta(loaderData?.doc),matches);
}

export default function Program({ loaderData }: Route.ComponentProps) {
  return <ContractPage doc={loaderData.doc} />;
}
