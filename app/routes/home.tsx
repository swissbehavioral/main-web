import { localizedMeta } from "../lib/locale";
import { contentMeta } from "../lib/content-meta";
import { data } from "react-router";
import { HomeExperience } from "../components/home-experience";
import { getPublishedContent } from "../lib/content.server";
import { site } from "../data/site";
import type { Route } from "./+types/home";
export async function loader() {
  const doc = await getPublishedContent("/");
  if (!doc) throw data("Home page unavailable", { status: 503 });
  return { doc };
}
export function meta({ loaderData, matches }: Route.MetaArgs) {
  return localizedMeta(contentMeta(loaderData?.doc),matches);
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <HomeExperience doc={loaderData.doc} />;
}
