import { localizedMeta } from "../lib/locale";
import { ResourcesExperience } from "../components/resources-experience";
import { ContentBlocks } from "../components/content-blocks";
import { IconArrowRight } from "../components/icons";
import { PageHero } from "../components/page-hero";
import { ButtonLink } from "../components/ui/button";
import { Container } from "../components/ui/container";
import { getPublishedContent, listPublishedPosts } from "../lib/content.server";
import { toResourcePost } from "../lib/resource-adapter";
import { contentMeta } from "../lib/content-meta";
import { pageMeta } from "../data/site";
import { Link } from "react-router";
import type { Route } from "./+types/resources";

export async function loader() {
  return {
    doc: (await getPublishedContent("/resources"))!,
    posts: (await listPublishedPosts()).map(toResourcePost),
  };
}
export function meta({ loaderData, matches }: Route.MetaArgs) {
  return localizedMeta(contentMeta(loaderData?.doc),matches);
}

export default function ResourcesPage({ loaderData }: Route.ComponentProps) {
  return <ResourcesExperience {...loaderData} />;
}
